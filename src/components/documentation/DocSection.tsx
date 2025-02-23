// src/components/documentation/DocSection.tsx
'use client'


import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface DocSectionProps {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
  children: React.ReactNode
}

export function DocSection({
  title,
  description,
  icon: Icon,
  className,
  children
}: DocSectionProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="border-b p-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-6 h-6 text-white" />}
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        {description && (
          <p className="mt-2 text-blue-50 text-sm">{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </Card>
  )
}


