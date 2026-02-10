'use client'

/**
 * Phase 2: カンバンボードUI
 * タスク管理システムのビジュアル化とフロー管理
 */

import React, { useState, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import type { Task, TaskStatus } from '@/lib/supabase/client'

// =====================================================
// ステータス定義
// =====================================================

interface KanbanColumn {
  id: TaskStatus
  title: string
  color: string
  bgColor: string
  icon: string
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'pending',
    title: '未着手',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: '📋'
  },
  {
    id: 'in_progress',
    title: '進行中',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: '🚀'
  },
  {
    id: 'completed',
    title: '完了',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: '✅'
  },
  {
    id: 'blocked',
    title: 'ブロック',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '🚫'
  }
]

// =====================================================
// メインコンポーネント
// =====================================================

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

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
  // ドラッグ&ドロップ処理
  // =====================================================

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback(async (result: DropResult) => {
    setIsDragging(false)

    const { source, destination, draggableId } = result

    // ドロップ先がない場合は何もしない
    if (!destination) return

    // 同じ位置にドロップした場合は何もしない
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const taskId = draggableId
    const newStatus = destination.droppableId as TaskStatus

    // 楽観的UI更新
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )

    // APIでステータス更新
    try {
      const response = await fetch('/api/tasks/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: taskId,
          status: newStatus
        })
      })

      const data = await response.json()

      if (!data.success) {
        // 失敗した場合は元に戻す
        setError(`ステータス更新失敗: ${data.error}`)
        fetchTasks() // 最新データを再取得
      }
    } catch (err: any) {
      console.error('❌ ステータス更新エラー:', err)
      setError('ステータスの更新に失敗しました')
      fetchTasks() // 最新データを再取得
    }
  }, [fetchTasks])

  // =====================================================
  // ステータス別タスクの取得
  // =====================================================

  const getTasksByStatus = useCallback(
    (status: TaskStatus): Task[] => {
      return tasks
        .filter(task => task.status === status)
        .sort((a, b) => {
          // 優先度でソート
          const priorityOrder: Record<string, number> = {
            urgent: 4,
            high: 3,
            medium: 2,
            low: 1
          }
          return (
            (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
          )
        })
    },
    [tasks]
  )

  // =====================================================
  // レンダリング
  // =====================================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">カンバンボードを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 カンバンボード
          </h1>
          <p className="text-gray-600">
            タスクをドラッグ&ドロップしてステータスを変更できます
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={fetchTasks}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
          >
            🔄 更新
          </button>
          <a
            href="/management/tasks"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all inline-block"
          >
            📝 リストビュー
          </a>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {KANBAN_COLUMNS.map(column => {
            const columnTasks = getTasksByStatus(column.id)
            return (
              <div
                key={column.id}
                className={`${column.bgColor} rounded-lg p-6 shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm ${column.color} mb-1`}>
                      {column.icon} {column.title}
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                      {columnTasks.length}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* カンバンボード */}
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {KANBAN_COLUMNS.map(column => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={getTasksByStatus(column.id)}
                isDragging={isDragging}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}

// =====================================================
// カンバン列コンポーネント
// =====================================================

interface KanbanColumnProps {
  column: KanbanColumn
  tasks: Task[]
  isDragging: boolean
}

function KanbanColumn({ column, tasks, isDragging }: KanbanColumnProps) {
  return (
    <div className="flex flex-col">
      {/* 列ヘッダー */}
      <div
        className={`${column.bgColor} ${column.color} rounded-t-lg p-4 font-bold text-lg flex items-center justify-between shadow`}
      >
        <span>
          {column.icon} {column.title}
        </span>
        <span className="bg-white px-3 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>

      {/* ドロップ可能エリア */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`bg-white rounded-b-lg p-4 min-h-[600px] shadow-lg transition-all ${
              snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-400' : ''
            }`}
          >
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>

            {/* 空状態 */}
            {tasks.length === 0 && !isDragging && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-2">📭</div>
                <p>タスクなし</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

// =====================================================
// タスクカードコンポーネント
// =====================================================

interface TaskCardProps {
  task: Task
  index: number
}

function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border-2 border-gray-200 rounded-lg p-4 shadow-md hover:shadow-xl transition-all cursor-move ${
            snapshot.isDragging ? 'ring-2 ring-blue-400 shadow-2xl rotate-2' : ''
          }`}
        >
          {/* 優先度バッジ */}
          <div className="flex items-start justify-between mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                task.priority === 'urgent'
                  ? 'bg-red-100 text-red-700'
                  : task.priority === 'high'
                  ? 'bg-orange-100 text-orange-700'
                  : task.priority === 'medium'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {task.priority === 'urgent' && '🔥 緊急'}
              {task.priority === 'high' && '⚡ 高'}
              {task.priority === 'medium' && '📌 中'}
              {task.priority === 'low' && '📎 低'}
            </span>
          </div>

          {/* タスクタイトル */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {task.title}
          </h3>

          {/* タスク説明 */}
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* 時間情報 */}
          {(task.estimated_time || task.actual_time) && (
            <div className="space-y-1 mb-3 text-sm">
              {task.estimated_time && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">⏱️ 見積:</span>
                  <span className="font-semibold">{task.estimated_time}分</span>
                </div>
              )}
              {task.actual_time && task.actual_time > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">✅ 実績:</span>
                  <span className="font-semibold text-blue-600">
                    {task.actual_time}分
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 締切日 */}
          {task.due_date && (
            <div className="text-sm text-gray-500 mb-3">
              📅 締切: {task.due_date}
            </div>
          )}

          {/* サブタスク進捗 */}
          {task.subtasks_json && task.subtasks_json.length > 0 && (
            <div className="text-sm text-gray-600">
              ✅ {task.subtasks_json.filter(st => st.completed).length}/
              {task.subtasks_json.length} サブタスク完了
            </div>
          )}

          {/* タグ */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {task.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 詳細リンク */}
          <a
            href={`/management/tasks?edit=${task.id}`}
            className="block mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold"
            onClick={e => e.stopPropagation()}
          >
            📝 詳細を見る →
          </a>
        </div>
      )}
    </Draggable>
  )
}
