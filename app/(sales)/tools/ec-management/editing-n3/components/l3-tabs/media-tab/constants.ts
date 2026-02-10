// app/tools/editing-n3/components/l3-tabs/MediaTab/constants.ts
import { Code, Image, Eye } from 'lucide-react';

export type MediaL3TabId = 'html-templates' | 'image-management' | 'preview';

export const MEDIA_L3_TABS: { id: MediaL3TabId; label: string; labelEn: string; icon: any }[] = [
  { id: 'html-templates', label: 'HTMLテンプレート', labelEn: 'HTML', icon: Code },
  { id: 'image-management', label: '画像管理', labelEn: 'Images', icon: Image },
  { id: 'preview', label: 'プレビュー', labelEn: 'Preview', icon: Eye },
];
