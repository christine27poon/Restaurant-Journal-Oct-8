import type { ReactNode } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  /** Tab title when it should differ from the on-page heading. */
  documentTitle?: string
}

export function PageHeader({ title, subtitle, action, documentTitle }: PageHeaderProps) {
  useDocumentTitle(documentTitle ?? title)
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-h1 md:text-display">{title}</h1>
        {subtitle && <p className="mt-1 text-body text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
