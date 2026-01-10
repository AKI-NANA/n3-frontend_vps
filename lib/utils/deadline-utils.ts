/**
 * 出荷期限関連のユーティリティ関数
 */

export interface DeadlineStatus {
  text: string;
  color: string;
  isUrgent: boolean;
  isCritical: boolean;
  remainingHours: number;
  remainingDays: number;
}

/**
 * 出荷期限までの残り時間を計算し、表示用のステータスを返す
 */
export function getDeadlineStatus(shippingDeadline: string): DeadlineStatus {
  const now = new Date();
  const deadline = new Date(shippingDeadline);
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;

  // 期限切れ
  if (diffMs < 0) {
    return {
      text: '期限切れ',
      color: 'bg-red-700 text-white',
      isUrgent: true,
      isCritical: true,
      remainingHours: diffHours,
      remainingDays: diffDays,
    };
  }

  // 24時間以内（最優先）
  if (diffHours < 24) {
    return {
      text: `残り ${diffHours}時間`,
      color: 'bg-red-600 text-white animate-pulse',
      isUrgent: true,
      isCritical: true,
      remainingHours: diffHours,
      remainingDays: 0,
    };
  }

  // 48時間以内（警告）
  if (diffHours < 48) {
    return {
      text: `残り ${diffDays}日 ${remainingHours}時間`,
      color: 'bg-orange-500 text-white',
      isUrgent: true,
      isCritical: false,
      remainingHours: diffHours,
      remainingDays: diffDays,
    };
  }

  // 3日以内（注意）
  if (diffDays < 3) {
    return {
      text: `残り ${diffDays}日`,
      color: 'bg-yellow-500 text-gray-900',
      isUrgent: false,
      isCritical: false,
      remainingHours: diffHours,
      remainingDays: diffDays,
    };
  }

  // それ以上（通常）
  return {
    text: `残り ${diffDays}日`,
    color: 'bg-green-500 text-white',
    isUrgent: false,
    isCritical: false,
    remainingHours: diffHours,
    remainingDays: diffDays,
  };
}

/**
 * カウントダウン表示用のコンポーネント
 */
export function formatDeadlineCountdown(shippingDeadline: string): {
  display: string;
  colorClass: string;
  iconType: 'critical' | 'urgent' | 'normal';
} {
  const status = getDeadlineStatus(shippingDeadline);

  let iconType: 'critical' | 'urgent' | 'normal' = 'normal';
  if (status.isCritical) {
    iconType = 'critical';
  } else if (status.isUrgent) {
    iconType = 'urgent';
  }

  return {
    display: status.text,
    colorClass: status.color,
    iconType,
  };
}

/**
 * 日付をローカライズして表示
 */
export function formatLocalDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 出荷期限が近い注文を抽出
 */
export function filterUrgentOrders<T extends { shipping_deadline: string }>(
  orders: T[],
  hoursThreshold: number = 48
): T[] {
  return orders.filter((order) => {
    const status = getDeadlineStatus(order.shipping_deadline);
    return status.remainingHours <= hoursThreshold && status.remainingHours >= 0;
  });
}

/**
 * 出荷期限切れの注文を抽出
 */
export function filterOverdueOrders<T extends { shipping_deadline: string }>(
  orders: T[]
): T[] {
  return orders.filter((order) => {
    const status = getDeadlineStatus(order.shipping_deadline);
    return status.remainingHours < 0;
  });
}
