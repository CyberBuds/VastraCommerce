'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { CmsBlogEditorView } from '@/features/cms/components/CmsBlogEditorView';

export default function CmsEditBlogPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <CmsBlogEditorView blogId={id} />;
}
