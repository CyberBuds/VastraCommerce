'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { CmsPageEditorView } from '@/features/cms/components/CmsPageEditorView';

export default function CmsEditPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <CmsPageEditorView pageId={id} />;
}
