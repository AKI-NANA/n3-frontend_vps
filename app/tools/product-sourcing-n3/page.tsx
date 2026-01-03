/**
 * Product Sourcing N3 - 製品主導型仕入れ先管理システム
 * 
 * 元ツール: /tools/product-sourcing
 * デザイン: N3 Design System
 * 
 * 注意: Firebase機能は無効化され、表示のみモードで動作
 */

'use client';

import React, { useState } from 'react';
import {
  N3Panel,
  N3Tabs,
  N3FilterGrid,
  N3FilterRow,
  N3FilterField,
  N3Input,
  N3Button,
  N3Checkbox,
  N3TextArea,
  N3Table,
  N3TableHeader,
  N3TableRow,
  N3TableCell,
  N3EmptyState,
  N3Badge,
  N3ToastContainer,
  N3Select,
  useToast,
} from '@/components/n3';
import { Package, Building, Mail, Trash2, Copy } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
}

interface Supplier {
  id: string;
  companyName: string;
  websiteUrl?: string;
  isRepeatCandidate: boolean;
  notes?: string;
  createdAt: Date;
}

export default function ProductSourcingN3Page() {
  const { toasts, removeToast, toast: showToast } = useToast();

  // デモデータ
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Amazonで人気のアウトドアチェア',
      status: 'pending',
      createdAt: new Date(),
    },
  ]);

  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      companyName: 'サンプル問屋',
      websiteUrl: 'https://example.com',
      isRepeatCandidate: true,
      createdAt: new Date(),
    },
  ]);

  // フォーム状態
  const [newProductName, setNewProductName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [newIsRepeatCandidate, setNewIsRepeatCandidate] = useState(false);

  // メール生成状態
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [requestType, setRequestType] = useState<'wholesale' | 'oem'>('wholesale');
  const [userEmail, setUserEmail] = useState('your.email@example.com');
  const [additionalNotes, setAdditionalNotes] = useState(
    'Amazonでの安定した販売チャネルを持ち、貴社製品の拡販に貢献できると確信しております。'
  );
  const [generatedEmail, setGeneratedEmail] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    showToast('商品を追加しました（デモモード）', 'info');
    setNewProductName('');
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    showToast('仕入れ先を追加しました（デモモード）', 'info');
    setNewCompanyName('');
    setNewWebsiteUrl('');
    setNewIsRepeatCandidate(false);
  };

  const handleGenerateEmail = () => {
    if (!selectedProductId || !selectedSupplierId || !userEmail) {
      showToast('商品、仕入れ先、メールアドレスを選択してください', 'error');
      return;
    }

    const selectedProduct = products.find((p) => p.id === selectedProductId);
    const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);

    const requestDetails =
      requestType === 'wholesale'
        ? '新規取引による商品の卸販売（仕入れ）の相談'
        : '独占契約または共同開発を視野に入れたOEM（受託製造）の相談';

    const emailTemplate = `件名: ${requestDetails}のご相談

${selectedSupplier?.companyName} ご担当者様

お世話になっております。
[貴社の会社名/屋号]の[貴社の氏名]と申します。

この度、貴社の「${selectedProduct?.name}」に関しまして、${requestDetails}をさせていただきたく、ご連絡いたしました。

【弊社について】
${additionalNotes}

お忙しいところ恐縮ですが、一度お打ち合わせのお時間をいただけますと幸いです。

何卒よろしくお願い申し上げます。

━━━━━━━━━━━━━━━━━━━━━━
[貴社の会社名/屋号]
[貴社の氏名]
Email: ${userEmail}
━━━━━━━━━━━━━━━━━━━━━━`;

    setGeneratedEmail(emailTemplate);
    showToast('メールを生成しました', 'success');
  };

  const handleCopyEmail = () => {
    if (!generatedEmail) return;
    navigator.clipboard.writeText(generatedEmail);
    showToast('メール本文をクリップボードにコピーしました', 'success');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 24 }}>
      <N3ToastContainer toasts={toasts} onClose={removeToast} />

      <N3Tabs
        tabs={[
          { id: 'products', label: '仕入対象商品リスト', icon: <Package size={16} /> },
          { id: 'suppliers', label: '仕入れ先コンタクト管理', icon: <Building size={16} /> },
          { id: 'email', label: 'AI交渉メール作成', icon: <Mail size={16} /> },
        ]}
        activeTab="products"
        onChange={(tab) => console.log('Tab changed:', tab)}
      />

      {/* タブコンテンツは簡略化（デモモード） */}
      <div style={{ marginTop: 24 }}>
        <N3Panel title="仕入れたい商品リスト" icon={<Package size={20} />}>
          <form onSubmit={handleAddProduct}>
            <N3FilterGrid>
              <N3FilterRow>
                <N3FilterField label="商品名" span={5}>
                  <N3Input
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="例: Amazonで人気のアウトドアチェア (SKU名)"
                  />
                </N3FilterField>
                <N3FilterField label="" span={1}>
                  <N3Button
                    type="submit"
                    variant="primary"
                    style={{ width: '100%', marginTop: 20 }}
                  >
                    商品を追加
                  </N3Button>
                </N3FilterField>
              </N3FilterRow>
            </N3FilterGrid>
          </form>

          <div style={{ marginTop: 24 }}>
            {products.length === 0 ? (
              <N3EmptyState
                icon={<Package size={32} />}
                title="まだ商品が登録されていません"
                description="上のフォームから登録を始めましょう"
              />
            ) : (
              <N3Table>
                <N3TableHeader>
                  <N3TableCell>商品名</N3TableCell>
                  <N3TableCell align="center">ステータス</N3TableCell>
                  <N3TableCell align="center">追加日</N3TableCell>
                  <N3TableCell align="center">アクション</N3TableCell>
                </N3TableHeader>
                {products.map((product) => (
                  <N3TableRow key={product.id}>
                    <N3TableCell>{product.name}</N3TableCell>
                    <N3TableCell align="center">
                      <N3Badge variant="neutral">{product.status}</N3Badge>
                    </N3TableCell>
                    <N3TableCell align="center">
                      {product.createdAt.toLocaleDateString('ja-JP')}
                    </N3TableCell>
                    <N3TableCell align="center">
                      <N3Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => showToast('削除（デモモード）', 'info')}
                      />
                    </N3TableCell>
                  </N3TableRow>
                ))}
              </N3Table>
            )}
          </div>
        </N3Panel>

        <div style={{ marginTop: 24 }}>
          <N3Panel title="仕入れ先コンタクト管理" icon={<Building size={20} />}>
            <form onSubmit={handleAddSupplier}>
              <N3FilterGrid>
                <N3FilterRow>
                  <N3FilterField label="企業名 *" span={2}>
                    <N3Input
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="企業名/問屋名"
                    />
                  </N3FilterField>
                  <N3FilterField label="ウェブサイトURL" span={2}>
                    <N3Input
                      type="url"
                      value={newWebsiteUrl}
                      onChange={(e) => setNewWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </N3FilterField>
                  <N3FilterField label="" span={1}>
                    <N3Checkbox
                      checked={newIsRepeatCandidate}
                      onChange={(e) => setNewIsRepeatCandidate(e.target.checked)}
                      label="リピート候補"
                      style={{ marginTop: 20 }}
                    />
                  </N3FilterField>
                  <N3FilterField label="" span={1}>
                    <N3Button
                      type="submit"
                      variant="primary"
                      style={{ width: '100%', marginTop: 20 }}
                    >
                      追加
                    </N3Button>
                  </N3FilterField>
                </N3FilterRow>
              </N3FilterGrid>
            </form>

            <div style={{ marginTop: 24 }}>
              {suppliers.length === 0 ? (
                <N3EmptyState
                  icon={<Building size={32} />}
                  title="まだ仕入れ先が登録されていません"
                />
              ) : (
                <N3Table>
                  <N3TableHeader>
                    <N3TableCell>企業名</N3TableCell>
                    <N3TableCell>ウェブサイト</N3TableCell>
                    <N3TableCell align="center">リピート候補</N3TableCell>
                    <N3TableCell align="center">アクション</N3TableCell>
                  </N3TableHeader>
                  {suppliers.map((supplier) => (
                    <N3TableRow key={supplier.id}>
                      <N3TableCell>{supplier.companyName}</N3TableCell>
                      <N3TableCell>
                        {supplier.websiteUrl ? (
                          <a
                            href={supplier.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--accent)' }}
                          >
                            {supplier.websiteUrl}
                          </a>
                        ) : (
                          '---'
                        )}
                      </N3TableCell>
                      <N3TableCell align="center">
                        <N3Badge
                          variant={supplier.isRepeatCandidate ? 'success' : 'neutral'}
                        >
                          {supplier.isRepeatCandidate ? 'はい' : 'いいえ'}
                        </N3Badge>
                      </N3TableCell>
                      <N3TableCell align="center">
                        <N3Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          onClick={() => showToast('削除（デモモード）', 'info')}
                        />
                      </N3TableCell>
                    </N3TableRow>
                  ))}
                </N3Table>
              )}
            </div>
          </N3Panel>
        </div>

        <div style={{ marginTop: 24 }}>
          <N3Panel title="AI交渉メール作成アシスタント" icon={<Mail size={20} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* 左側: 設定 */}
              <div>
                <N3FilterGrid>
                  <N3FilterRow>
                    <N3FilterField label="対象商品を選択 *" span={6}>
                      <N3Select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                      >
                        <option value="">--- 商品を選択 ---</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </N3Select>
                    </N3FilterField>
                  </N3FilterRow>

                  <N3FilterRow>
                    <N3FilterField label="仕入れ先を選択 *" span={6}>
                      <N3Select
                        value={selectedSupplierId}
                        onChange={(e) => setSelectedSupplierId(e.target.value)}
                      >
                        <option value="">--- 仕入れ先を選択 ---</option>
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.companyName}
                            {s.isRepeatCandidate && ' (リピート候補)'}
                          </option>
                        ))}
                      </N3Select>
                    </N3FilterField>
                  </N3FilterRow>

                  <N3FilterRow>
                    <N3FilterField label="依頼目的" span={6}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <N3Button
                          onClick={() => setRequestType('wholesale')}
                          variant={requestType === 'wholesale' ? 'primary' : 'secondary'}
                          style={{ flex: 1 }}
                        >
                          卸販売 (仕入れ) 依頼
                        </N3Button>
                        <N3Button
                          onClick={() => setRequestType('oem')}
                          variant={requestType === 'oem' ? 'primary' : 'secondary'}
                          style={{ flex: 1 }}
                        >
                          OEM / 共同開発 相談
                        </N3Button>
                      </div>
                    </N3FilterField>
                  </N3FilterRow>

                  <N3FilterRow>
                    <N3FilterField label="連絡先メールアドレス *" span={6}>
                      <N3Input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </N3FilterField>
                  </N3FilterRow>

                  <N3FilterRow>
                    <N3FilterField label="自社の強み・補足事項" span={6}>
                      <N3TextArea
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="例: 楽天市場/Yahoo!にも販路あり、SNSフォロワー数5万、など"
                        rows={4}
                      />
                    </N3FilterField>
                  </N3FilterRow>

                  <N3FilterRow>
                    <N3FilterField label="" span={6}>
                      <N3Button
                        onClick={handleGenerateEmail}
                        variant="primary"
                        style={{ width: '100%' }}
                      >
                        交渉メールを自動生成する
                      </N3Button>
                    </N3FilterField>
                  </N3FilterRow>
                </N3FilterGrid>
              </div>

              {/* 右側: 結果 */}
              <div>
                <div
                  style={{
                    padding: 16,
                    background: 'var(--panel)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 8,
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 16,
                      color: 'var(--text)',
                    }}
                  >
                    生成結果
                  </div>

                  {generatedEmail ? (
                    <>
                      <div
                        style={{
                          flex: 1,
                          padding: 16,
                          background: 'var(--highlight)',
                          borderRadius: 4,
                          fontSize: 13,
                          lineHeight: 1.8,
                          whiteSpace: 'pre-wrap',
                          overflow: 'auto',
                          marginBottom: 16,
                        }}
                      >
                        {generatedEmail}
                      </div>
                      <N3Button
                        onClick={handleCopyEmail}
                        variant="secondary"
                        icon={<Copy size={16} />}
                        style={{ width: '100%' }}
                      >
                        メール本文をコピー
                      </N3Button>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          marginTop: 12,
                        }}
                      >
                        注意: プレースホルダー（`[貴社の会社名/屋号]`など）は、必ずご自身の情報に置き換えてから送信してください。
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        textAlign: 'center',
                        padding: 24,
                      }}
                    >
                      <div>
                        <Mail size={48} style={{ marginBottom: 16 }} />
                        <p>左側の設定を行い、「交渉メールを自動生成する」ボタンを押してください。</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </N3Panel>
        </div>
      </div>
    </div>
  );
}
