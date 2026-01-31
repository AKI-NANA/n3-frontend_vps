'use client';

/**
 * N3 Intelligence Map - 27次元知能可視化システム
 * 
 * 目的：n3_local_brain.sqliteから1,463個のファイルを読み取り、
 *       「このプログラムが何をするか」を高校生にも分かるように図解
 * 
 * 次元：27次元知能・LMS連携
 */

import { useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// 27次元ツールタイプの定義
const TOOL_TYPES = {
  '01_ダッシュボード': { color: '#FF6B6B', label: 'ダッシュボード', icon: '📊' },
  '02_データ取得': { color: '#4ECDC4', label: 'データ取得', icon: '🔍' },
  '03_データ一覧': { color: '#45B7D1', label: 'データ一覧', icon: '📋' },
  '04_商品編集': { color: '#96CEB4', label: '商品編集', icon: '✏️' },
  '05_利益計算': { color: '#FFEAA7', label: '利益計算', icon: '💰' },
  '06_フィルター管理': { color: '#DFE6E9', label: 'フィルター', icon: '🔧' },
  '07_データ編集': { color: '#74B9FF', label: 'データ編集', icon: '📝' },
  '08_出品管理': { color: '#A29BFE', label: '出品管理', icon: '📤' },
  '09_運用管理': { color: '#FD79A8', label: '運用管理', icon: '⚙️' },
  '10_リサーチ': { color: '#FDCB6E', label: 'リサーチ', icon: '🔬' },
  '11_カテゴリ管理': { color: '#6C5CE7', label: 'カテゴリ', icon: '🏷️' },
  '12_分析': { color: '#00B894', label: '分析', icon: '📈' },
  '13_財務': { color: '#00CEC9', label: '財務', icon: '💳' },
  '14_API連携': { color: '#FD79A8', label: 'API連携', icon: '🔌' },
  '15_設定': { color: '#B2BEC3', label: '設定', icon: '⚙️' },
  '16_認証': { color: '#636E72', label: '認証', icon: '🔐' },
  '17_開発ナレッジ事典': { color: '#2D3436', label: 'ナレッジ', icon: '📚' },
  'その他': { color: '#95A5A6', label: 'その他', icon: '📦' },
};

// カテゴリ別の色定義
const CATEGORY_COLORS = {
  tool: '#3498DB',
  api: '#E74C3C',
  component: '#2ECC71',
  lib: '#F39C12',
  service: '#9B59B6',
  hook: '#1ABC9C',
  type: '#34495E',
  config: '#95A5A6',
  migration: '#D35400',
  documentation: '#7F8C8D',
  other: '#BDC3C7',
};

interface CodeMapEntry {
  id: number;
  path: string;
  file_name: string;
  tool_type: string | null;
  category: string;
  main_features: string; // JSON array
  tech_stack: string;
  related_tools: string; // JSON array
  file_size: number;
}

interface UserStory {
  tool_type: string;
  story: string;
  example: string;
}

// 高校生への解説（userStory）
const USER_STORIES: UserStory[] = [
  {
    tool_type: '01_ダッシュボード',
    story: 'お店の売上や在庫を一目で見られる「管理画面」だよ',
    example: '今日の売上：10万円、在庫：500個、みたいな情報が一画面に表示される',
  },
  {
    tool_type: '02_データ取得',
    story: 'Yahoo!オークションから商品情報を自動で集めてくるプログラムだよ',
    example: '「Nike スニーカー」で検索して、価格や写真を全部保存してくれる',
  },
  {
    tool_type: '05_利益計算',
    story: 'この商品を売ったら儲けがいくらになるか、1秒で計算するヤツだよ',
    example: '仕入れ3000円、送料500円、手数料10% → 利益1200円！って自動計算',
  },
  {
    tool_type: '08_出品管理',
    story: 'eBayやAmazonに商品を自動で出品してくれるロボットだよ',
    example: '商品データを入れるだけで、写真や説明文を自動作成して出品完了',
  },
  {
    tool_type: '10_リサーチ',
    story: 'この商品が売れるか、ライバルは何人いるか調べるスパイツールだよ',
    example: 'Amazon USAで月に100個売れてる！競合は5人だけ！みたいな分析',
  },
  {
    tool_type: '14_API連携',
    story: '他のシステムとデータをやり取りする「通訳」プログラムだよ',
    example: 'eBayのサーバーに「在庫更新して」って命令を送ってくれる',
  },
];

export default function IntelligenceMapPage() {
  const [codeMap, setCodeMap] = useState<CodeMapEntry[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<CodeMapEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    byToolType: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byTechStack: {} as Record<string, number>,
  });

  // SQLiteからデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // PythonスクリプトでSQLiteクエリを実行
        // 本来はAPIエンドポイントを作成すべきだが、ここでは簡略化
        const response = await fetch('/api/intelligence-map/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sql: `
              SELECT 
                id, path, file_name, tool_type, category,
                main_features, tech_stack, related_tools, file_size
              FROM code_map
              WHERE project_name = 'n3-frontend'
              ORDER BY tool_type, category
            `,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch code map');
        }

        const data: CodeMapEntry[] = await response.json();
        setCodeMap(data);

        // 統計情報を集計
        const byToolType: Record<string, number> = {};
        const byCategory: Record<string, number> = {};
        const byTechStack: Record<string, number> = {};

        data.forEach((entry) => {
          // tool_type集計
          const toolType = entry.tool_type || 'その他';
          byToolType[toolType] = (byToolType[toolType] || 0) + 1;

          // category集計
          byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;

          // tech_stack集計
          byTechStack[entry.tech_stack] = (byTechStack[entry.tech_stack] || 0) + 1;
        });

        setStats({
          total: data.length,
          byToolType,
          byCategory,
          byTechStack,
        });

        // React Flowノードとエッジを生成
        generateFlowGraph(data);
      } catch (error) {
        console.error('Error fetching code map:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // React Flowのグラフを生成
  const generateFlowGraph = (data: CodeMapEntry[]) => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];

    // tool_typeごとにグループ化
    const groupedByToolType: Record<string, CodeMapEntry[]> = {};
    data.forEach((entry) => {
      const toolType = entry.tool_type || 'その他';
      if (!groupedByToolType[toolType]) {
        groupedByToolType[toolType] = [];
      }
      groupedByToolType[toolType].push(entry);
    });

    // ノードを配置（円形レイアウト）
    const toolTypes = Object.keys(groupedByToolType);
    const radius = 400;
    const centerX = 500;
    const centerY = 400;

    toolTypes.forEach((toolType, index) => {
      const angle = (index / toolTypes.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const files = groupedByToolType[toolType];
      const toolConfig = TOOL_TYPES[toolType as keyof typeof TOOL_TYPES] || TOOL_TYPES['その他'];

      generatedNodes.push({
        id: toolType,
        type: 'default',
        position: { x, y },
        data: {
          label: (
            <div className="text-center">
              <div className="text-2xl mb-1">{toolConfig.icon}</div>
              <div className="font-bold text-sm">{toolConfig.label}</div>
              <div className="text-xs text-gray-500">{files.length}ファイル</div>
            </div>
          ),
        },
        style: {
          background: toolConfig.color,
          color: '#fff',
          border: '2px solid #fff',
          borderRadius: '50%',
          width: 120,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      });

      // related_toolsから他のtool_typeへのエッジを生成
      const relatedSet = new Set<string>();
      files.forEach((file) => {
        try {
          const related = JSON.parse(file.related_tools || '[]');
          related.forEach((r: string) => {
            if (r !== toolType && toolTypes.includes(r)) {
              relatedSet.add(r);
            }
          });
        } catch (e) {
          // JSON parse error
        }
      });

      relatedSet.forEach((target) => {
        generatedEdges.push({
          id: `${toolType}-${target}`,
          source: toolType,
          target,
          animated: true,
          style: { stroke: '#999', strokeWidth: 2 },
        });
      });
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    const toolType = node.id;
    const files = codeMap.filter((f) => (f.tool_type || 'その他') === toolType);
    if (files.length > 0) {
      setSelectedNode(files[0]); // 代表として最初のファイルを表示
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">🧠</div>
          <div className="text-xl font-bold">N3 Local Brain を読み込み中...</div>
          <div className="text-sm text-gray-500 mt-2">1,463個のファイル情報を解析中</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">🧠 N3 Intelligence Map</h1>
        <p className="text-sm opacity-90">27次元知能可視化システム - 1,463個のプログラムが何をしているか一目で分かる</p>
        <div className="flex gap-4 mt-4">
          <Badge variant="secondary">総ファイル数: {stats.total}</Badge>
          <Badge variant="secondary">ツールタイプ: {Object.keys(stats.byToolType).length}種類</Badge>
          <Badge variant="secondary">カテゴリ: {Object.keys(stats.byCategory).length}種類</Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 左：React Flow */}
        <div className="flex-1 bg-gray-50">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* 右：詳細パネル */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <Tabs defaultValue="story" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="story" className="flex-1">高校生への解説</TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">統計</TabsTrigger>
            </TabsList>

            <TabsContent value="story" className="p-4">
              <h3 className="font-bold text-lg mb-4">💡 これは何をするプログラム？</h3>
              <ScrollArea className="h-[calc(100vh-250px)]">
                {USER_STORIES.map((story, index) => (
                  <Card key={index} className="p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {TOOL_TYPES[story.tool_type as keyof typeof TOOL_TYPES]?.icon}
                      </span>
                      <h4 className="font-bold">
                        {TOOL_TYPES[story.tool_type as keyof typeof TOOL_TYPES]?.label}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{story.story}</p>
                    <div className="bg-blue-50 p-2 rounded text-xs text-gray-600">
                      <strong>例：</strong> {story.example}
                    </div>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="stats" className="p-4">
              <h3 className="font-bold text-lg mb-4">📊 統計情報</h3>
              <ScrollArea className="h-[calc(100vh-250px)]">
                {/* ツールタイプ別 */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">ツールタイプ別</h4>
                  {Object.entries(stats.byToolType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center mb-2">
                        <span className="text-sm">{type}</span>
                        <Badge>{count}件</Badge>
                      </div>
                    ))}
                </div>

                {/* カテゴリ別 */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">カテゴリ別</h4>
                  {Object.entries(stats.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center mb-2">
                        <span className="text-sm">{category}</span>
                        <Badge variant="outline">{count}件</Badge>
                      </div>
                    ))}
                </div>

                {/* 技術スタック別 */}
                <div>
                  <h4 className="font-semibold mb-2">技術スタック別</h4>
                  {Object.entries(stats.byTechStack)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([tech, count]) => (
                      <div key={tech} className="flex justify-between items-center mb-2">
                        <span className="text-sm">{tech}</span>
                        <Badge variant="secondary">{count}件</Badge>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
