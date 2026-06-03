import type { ReactNode } from 'react'
import { EditableNavbar } from '@/editable/shell/EditableNavbar'
import { EditableFooter } from '@/editable/shell/EditableFooter'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function EditableSiteShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`${dc.shell.page} relative flex min-h-screen flex-col overflow-x-clip bg-[radial-gradient(circle_at_top,rgba(227,219,187,0.85),transparent_55%)] bg-[length:100%_34rem] bg-no-repeat ${className}`}
    >
      <EditableNavbar />
      <div className="relative z-[1] min-h-0 flex-1">{children}</div>
      <EditableFooter />
    </div>
  )
}
