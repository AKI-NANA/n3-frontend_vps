// app/tools/editing-n3/components/l3-tabs/LogisticsTab/constants.ts
import { Calculator, FileText, Grid3X3, Database } from 'lucide-react';

export type LogisticsL3TabId = 'shipping-calculator' | 'shipping-policies' | 'shipping-matrix' | 'shipping-master';

export const LOGISTICS_L3_TABS: { id: LogisticsL3TabId; label: string; labelEn: string; icon: any }[] = [
  { id: 'shipping-calculator', label: '送料計算', labelEn: 'Calculator', icon: Calculator },
  { id: 'shipping-policies', label: '配送ポリシー', labelEn: 'Policies', icon: FileText },
  { id: 'shipping-matrix', label: '送料マトリクス', labelEn: 'Matrix', icon: Grid3X3 },
  { id: 'shipping-master', label: 'マスターデータ', labelEn: 'Master', icon: Database },
];
