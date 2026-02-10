/**
 * N3CollapsibleHeader - 折りたたみヘッダーコンポーネント
 * 
 * スクロールダウンで非表示、スクロールアップで再表示
 * 
 * 動作:
 * - position: sticky + top プロパティでスムーズなアニメーション
 * - スクロールダウンで上にスライドアウト
 * - スクロールアップで戻ってくる
 */

'use client';

import React, { memo, useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

export interface N3CollapsibleHeaderProps {
  /** 子要素（ヘッダーコンテンツ） */
  children: ReactNode;
  /** スクロール対象のコンテナRef（指定なしでwindowを使用） */
  scrollContainerRef?: React.RefObject<HTMLElement>;
  /** スクロールコンテナのID（Refが無い場合に使用） */
  scrollContainerId?: string;
  /** スクロール方向判定の閾値（px） */
  threshold?: number;
  /** トランジション時間（ms） */
  transitionDuration?: number;
  /** カスタムスタイル */
  style?: CSSProperties;
  /** カスタムクラス */
  className?: string;
  /** 常に表示（折りたたみ無効化） */
  alwaysVisible?: boolean;
  /** zIndex */
  zIndex?: number;
}

export const N3CollapsibleHeader = memo(function N3CollapsibleHeader({
  children,
  scrollContainerRef,
  scrollContainerId,
  threshold = 10,
  transitionDuration = 300,
  style,
  className = '',
  alwaysVisible = false,
  zIndex = 40,
}: N3CollapsibleHeaderProps) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // ヘッダーの高さを測定
  useEffect(() => {
    if (!headerRef.current) return;
    
    const updateHeight = () => {
      const height = headerRef.current?.offsetHeight || 0;
      setHeaderHeight(height);
    };
    
    updateHeight();
    
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(headerRef.current);
    
    return () => resizeObserver.disconnect();
  }, [children]);

  // スクロール監視
  useEffect(() => {
    if (alwaysVisible) return;

    // スクロールコンテナを取得
    let scrollContainer: HTMLElement | null = null;
    
    if (scrollContainerRef?.current) {
      scrollContainer = scrollContainerRef.current;
    } else if (scrollContainerId) {
      scrollContainer = document.getElementById(scrollContainerId);
    }
    
    // コンテナが見つからない場合はwindowを使用
    const useWindow = !scrollContainer;
    
    const getScrollY = () => {
      if (useWindow) {
        return window.scrollY;
      }
      return scrollContainer?.scrollTop || 0;
    };
    
    const handleScroll = () => {
      const currentScrollY = getScrollY();
      const delta = currentScrollY - lastScrollY.current;
      
      // 閾値を超えた場合のみ方向を更新
      if (Math.abs(delta) >= threshold) {
        const direction = delta > 0 ? 'down' : 'up';
        setScrollDirection(direction);
        lastScrollY.current = currentScrollY;
      }
      
      // トップに戻った場合は常に表示
      if (currentScrollY <= 0) {
        setScrollDirection('up');
        lastScrollY.current = 0;
      }
    };

    const target = useWindow ? window : scrollContainer;
    target?.addEventListener('scroll', handleScroll, { passive: true });
    
    // 初期位置を設定
    lastScrollY.current = getScrollY();
    
    return () => {
      target?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef, scrollContainerId, threshold, alwaysVisible]);

  // スクロール方向に基づいてtop位置を計算
  const topPosition = scrollDirection === 'down' ? -headerHeight : 0;

  return (
    <div
      ref={headerRef}
      className={`n3-collapsible-header ${className}`}
      style={{
        position: 'sticky',
        top: topPosition,
        zIndex,
        transition: `top ${transitionDuration}ms ease-in-out`,
        willChange: 'top',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
});

export default N3CollapsibleHeader;
