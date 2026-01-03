'use client'

/**
 * MultiChannelManager V4 - Supabase統合版
 * Phase 1: データ永続化 + 時間管理機能
 */

import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Task, TaskStatus, TaskPriority, TaskAttachments, TaskSubtask } from '@/lib/supabase/client'

// =====================================================
// タスク管理のメインコンポーネント
// =====================================================

export default function MultiChannelManagerV4() {
  // State管理
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 編集中のタスク（初期値）
  const initialEditingItem: Partial<Task> = {
    title: '',
    description: '',
    rate: 0,
    estimated_time: undefined,
    actual_time: 0,
    due_date: '',
    status: 'pending',
    priority: 'medium',
    attachments_json: {
      urls: [],
      images: [],
      codeSnippets: []
    },
    subtasks_json: [],
    tags: [],
    category: ''
  }
  const [editingItem, setEditingItem] = useState<Partial<Task>>(initialEditingItem)

  // 関連URL入力用
  const [urlsInput, setUrlsInput] = useState('')

  // タイムトラッカー用のState
  const [isTracking, setIsTracking] = useState(false)
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)

  // =====================================================
  // データ取得
  // =====================================================

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tasks/list')
      const data = await response.json()

      if (data.success) {
        setTasks(data.tasks)
        setError(null)
      } else {
        setError(data.error || 'タスクの取得に失敗しました')
      }
    } catch (err: any) {
      console.error('❌ タスク取得エラー:', err)
      setError('サーバーとの通信に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // =====================================================
  // タスク保存処理
  // =====================================================

  const handleSaveTask = useCallback(async () => {
    if (!editingItem.title || editingItem.title.trim() === '') {
      alert('タイトルは必須です')
      return
    }

    try {
      // URLのパース
      const parsedUrls = urlsInput
        .split(/[\n,]/)
        .map(url => url.trim())
        .filter(url => url.length > 0 && (url.startsWith('http') || url.startsWith('www')))

      const finalItem = {
        ...editingItem,
        attachments_json: {
          ...editingItem.attachments_json!,
          urls: parsedUrls
        }
      }

      const endpoint = editingItem.id ? '/api/tasks/update' : '/api/tasks/create'
      const method = editingItem.id ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalItem)
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchTasks() // リストを再取得
        setIsModalOpen(false)
        setEditingItem(initialEditingItem)
        setUrlsInput('')
      } else {
        alert(`エラー: ${data.error}`)
      }
    } catch (err: any) {
      console.error('❌ タスク保存エラー:', err)
      alert('タスクの保存に失敗しました')
    }
  }, [editingItem, urlsInput, fetchTasks])

  // =====================================================
  // タスク削除
  // =====================================================

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!confirm('このタスクをアーカイブしますか？')) return

    try {
      const response = await fetch('/api/tasks/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId })
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchTasks()
      } else {
        alert(`エラー: ${data.error}`)
      }
    } catch (err: any) {
      console.error('❌ タスク削除エラー:', err)
      alert('タスクの削除に失敗しました')
    }
  }, [fetchTasks])

  // =====================================================
  // 時間トラッキング機能
  // =====================================================

  const startTracking = useCallback((taskId: string) => {
    setIsTracking(true)
    setTrackingStartTime(new Date())
    setCurrentTaskId(taskId)
    console.log('⏱️ タイムトラッキング開始:', taskId)
  }, [])

  const stopTracking = useCallback(async () => {
    if (!trackingStartTime || !currentTaskId) return

    const endTime = new Date()
    const elapsedMinutes = Math.round((endTime.getTime() - trackingStartTime.getTime()) / (1000 * 60))

    // 既存のactual_timeに加算
    const currentTask = tasks.find(t => t.id === currentTaskId)
    const newActualTime = (currentTask?.actual_time || 0) + elapsedMinutes

    try {
      const response = await fetch('/api/tasks/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentTaskId,
          actual_time: newActualTime
        })
      })

      const data = await response.json()

      if (data.success) {
        console.log(`✅ 実績時間を記録: +${elapsedMinutes}分 (合計: ${newActualTime}分)`)
        fetchTasks()
      }
    } catch (err: any) {
      console.error('❌ 時間記録エラー:', err)
    }

    setIsTracking(false)
    setTrackingStartTime(null)
    setCurrentTaskId(null)
  }, [trackingStartTime, currentTaskId, tasks, fetchTasks])

  // =====================================================
  // UI補助機能
  // =====================================================

  const handleImageAttach = () => {
    const mockImage = {
      id: crypto.randomUUID(),
      name: `Image_${new Date().toISOString().substring(0, 10)}_${(editingItem.attachments_json?.images.length || 0) + 1}.jpg`,
      url: `/mock/image/${crypto.randomUUID()}`
    }
    setEditingItem(prev => ({
      ...prev,
      attachments_json: {
        ...prev.attachments_json!,
        images: [...(prev.attachments_json?.images || []), mockImage]
      }
    }))
  }

  const handleAddTodo = () => {
    setEditingItem(prev => ({
      ...prev,
      subtasks_json: [...(prev.subtasks_json || []), { text: '', completed: false }]
    }))
  }

  const openEditModal = (task: Task) => {
    setEditingItem(task)
    setUrlsInput(task.attachments_json?.urls?.join('\n') || '')
    setIsModalOpen(true)
  }

  // =====================================================
  // レンダリング
  // =====================================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">タスクを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🗓️ タスク管理 V4
          </h1>
          <p className="text-gray-600">
            データ永続化 + 時間管理機能搭載
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setEditingItem(initialEditingItem)
              setUrlsInput('')
              setIsModalOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
          >
            ➕ 新規タスク作成
          </button>

          <button
            onClick={fetchTasks}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
          >
            🔄 更新
          </button>
        </div>

        {/* タイムトラッカーステータス */}
        {isTracking && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
            <span>⏱️ タイムトラッキング中...</span>
            <button
              onClick={stopTracking}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              ⏹️ 停止
            </button>
          </div>
        )}

        {/* タスク統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-gray-500 text-sm mb-2">総タスク数</div>
            <div className="text-3xl font-bold text-gray-800">{tasks.length}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-gray-500 text-sm mb-2">進行中</div>
            <div className="text-3xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-gray-500 text-sm mb-2">完了</div>
            <div className="text-3xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-gray-500 text-sm mb-2">総実績時間</div>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(tasks.reduce((sum, t) => sum + (t.actual_time || 0), 0) / 60)}h
            </div>
          </div>
        </div>

        {/* タスクリスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-l-4"
              style={{
                borderColor:
                  task.status === 'completed' ? '#10b981' :
                  task.status === 'in_progress' ? '#3b82f6' :
                  task.status === 'blocked' ? '#ef4444' : '#9ca3af'
              }}
            >
              {/* タスクヘッダー */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">
                  {task.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${
                  task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  task.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority}
                </span>
              </div>

              {/* タスク説明 */}
              {task.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* 時間情報 */}
              <div className="space-y-2 mb-4">
                {task.estimated_time && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">⏱️ 見積もり:</span>
                    <span className="font-semibold">{task.estimated_time}分</span>
                  </div>
                )}
                {task.actual_time && task.actual_time > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">✅ 実績:</span>
                    <span className="font-semibold text-blue-600">{task.actual_time}分</span>
                  </div>
                )}
                {task.estimated_time && task.actual_time && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">📊 差異:</span>
                    <span className={`font-semibold ${
                      task.actual_time > task.estimated_time ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {task.actual_time > task.estimated_time ? '+' : ''}
                      {task.actual_time - task.estimated_time}分
                    </span>
                  </div>
                )}
              </div>

              {/* 締切日 */}
              {task.due_date && (
                <div className="text-sm text-gray-500 mb-4">
                  📅 締切: {task.due_date}
                </div>
              )}

              {/* ステータス */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  task.status === 'blocked' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.status}
                </span>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(task)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
                >
                  編集
                </button>
                {task.status !== 'in_progress' && !isTracking && (
                  <button
                    onClick={() => startTracking(task.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold"
                  >
                    ⏱️ 開始
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 空状態 */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">タスクがありません</p>
            <button
              onClick={() => {
                setEditingItem(initialEditingItem)
                setIsModalOpen(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              最初のタスクを作成
            </button>
          </div>
        )}
      </div>

      {/* モーダル（次のメッセージで実装） */}
      {isModalOpen && (
        <TaskEditModal
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          urlsInput={urlsInput}
          setUrlsInput={setUrlsInput}
          handleSaveTask={handleSaveTask}
          handleImageAttach={handleImageAttach}
          handleAddTodo={handleAddTodo}
          onClose={() => {
            setIsModalOpen(false)
            setEditingItem(initialEditingItem)
            setUrlsInput('')
          }}
        />
      )}
    </div>
  )
}

// =====================================================
// タスク編集モーダルコンポーネント
// =====================================================

interface TaskEditModalProps {
  editingItem: Partial<Task>
  setEditingItem: React.Dispatch<React.SetStateAction<Partial<Task>>>
  urlsInput: string
  setUrlsInput: React.Dispatch<React.SetStateAction<string>>
  handleSaveTask: () => void
  handleImageAttach: () => void
  handleAddTodo: () => void
  onClose: () => void
}

function TaskEditModal({
  editingItem,
  setEditingItem,
  urlsInput,
  setUrlsInput,
  handleSaveTask,
  handleImageAttach,
  handleAddTodo,
  onClose
}: TaskEditModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">
            {editingItem.id ? '📝 タスク編集' : '➕ 新規タスク作成'}
          </h3>

          <div className="space-y-6">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="タスクのタイトル"
                value={editingItem.title || ''}
                onChange={e => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 時間管理フィールド（Phase 1の核心機能） */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⏱️ 見積もり時間（分）
                </label>
                <input
                  type="number"
                  placeholder="60"
                  value={editingItem.estimated_time || ''}
                  onChange={e => setEditingItem(prev => ({ ...prev, estimated_time: parseInt(e.target.value) || undefined }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💰 単価（Rate）
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={editingItem.rate || ''}
                  onChange={e => setEditingItem(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 締切日 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 締切日
              </label>
              <input
                type="date"
                value={editingItem.due_date || ''}
                onChange={e => setEditingItem(prev => ({ ...prev, due_date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* ステータスと優先度 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ステータス
                </label>
                <select
                  value={editingItem.status || 'pending'}
                  onChange={e => setEditingItem(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  優先度
                </label>
                <select
                  value={editingItem.priority || 'medium'}
                  onChange={e => setEditingItem(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* 説明 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                詳細説明
              </label>
              <textarea
                placeholder="タスクの詳細..."
                value={editingItem.description || ''}
                onChange={e => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 関連URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔗 関連URL（カンマ/改行区切り）
              </label>
              <textarea
                value={urlsInput}
                onChange={e => setUrlsInput(e.target.value)}
                placeholder="https://example.com, https://app.com"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <small className="text-gray-500">
                検出されたURL: {urlsInput.split(/[\n,]/).filter(u => u.trim().length > 0 && (u.trim().startsWith('http') || u.trim().startsWith('www'))).length}件
              </small>
            </div>

            {/* ToDoリスト */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ✅ ToDoリスト
              </label>
              <div className="space-y-2 mb-2">
                {editingItem.subtasks_json?.map((todo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={e => {
                        const newTodos = [...(editingItem.subtasks_json || [])]
                        newTodos[index].completed = e.target.checked
                        setEditingItem(prev => ({ ...prev, subtasks_json: newTodos }))
                      }}
                      className="w-5 h-5"
                    />
                    <input
                      type="text"
                      value={todo.text}
                      onChange={e => {
                        const newTodos = [...(editingItem.subtasks_json || [])]
                        newTodos[index].text = e.target.value
                        setEditingItem(prev => ({ ...prev, subtasks_json: newTodos }))
                      }}
                      placeholder="ToDo item text"
                      className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg ${todo.completed ? 'line-through text-gray-400' : ''}`}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddTodo}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                + ToDo項目を追加
              </button>
            </div>
          </div>

          {/* モーダルアクション */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSaveTask}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg"
            >
              💾 保存
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold text-lg"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
