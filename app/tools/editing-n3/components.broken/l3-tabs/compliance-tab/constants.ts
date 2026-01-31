// app/tools/editing-n3/components/l3-tabs/ComplianceTab/constants.ts
import { Layers, Filter, Calculator, Shield } from 'lucide-react';

export type ComplianceL3TabId = 'hts-hierarchy' | 'filter-management' | 'tariff-calculator' | 'vero-management';

export const COMPLIANCE_L3_TABS: { id: ComplianceL3TabId; label: string; labelEn: string; icon: any }[] = [
  { id: 'hts-hierarchy', label: 'HTS管理', labelEn: 'HTS', icon: Layers },
  { id: 'filter-management', label: 'フィルター管理', labelEn: 'Filters', icon: Filter },
  { id: 'tariff-calculator', label: '関税計算', labelEn: 'Tariff', icon: Calculator },
  { id: 'vero-management', label: 'VERO管理', labelEn: 'VERO', icon: Shield },
];
