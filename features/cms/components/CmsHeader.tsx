'use client';

import * as React from 'react';
import Link from 'next/link';
import { RefreshCw, Plus, ChevronRight, FileText, Globe, Search, Layers } from 'lucide-react';
import { Button } from '@/components/enterprise/BaseInputs';

interface CmsHeaderProps {
  title: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
  actionButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  onRefresh?: () => void;
}

export function CmsHeader({
  title,
  description,
  breadcrumbs = [],
  actionButton,
  secondaryButton,
  onRefresh,
}: CmsHeaderProps) {
  return (
    <div className="flex flex-col gap-3 pb-6 border-b border-slate-200/80 dark:border-zinc-850 mb-6">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
        <Link href="/cms/dashboard" className="hover:text-slate-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors">
          <Globe className="w-3.5 h-3.5" />
          <span>CMS Center</span>
        </Link>
        {breadcrumbs.map((b, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {b.href ? (
              <Link href={b.href} className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                {b.label}
              </Link>
            ) : (
              <span className="text-slate-900 dark:text-zinc-100 font-semibold">{b.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              title="Refresh Data"
              className="h-9 px-2.5"
            >
              <RefreshCw className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
            </Button>
          )}

          {secondaryButton && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={secondaryButton.onClick}
              className="h-9 text-xs font-semibold gap-1.5"
            >
              {secondaryButton.icon}
              {secondaryButton.label}
            </Button>
          )}

          {actionButton && (
            actionButton.href ? (
              <Link href={actionButton.href}>
                <Button variant="default" size="sm" className="h-9 text-xs font-semibold gap-1.5 shadow-sm">
                  {actionButton.icon || <Plus className="w-4 h-4" />}
                  {actionButton.label}
                </Button>
              </Link>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={actionButton.onClick}
                className="h-9 text-xs font-semibold gap-1.5 shadow-sm"
              >
                {actionButton.icon || <Plus className="w-4 h-4" />}
                {actionButton.label}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
