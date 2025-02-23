// src/components/documentation/CodeExample.tsx
'use client'

import { useState } from 'react'

import { Check, Copy, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeExampleProps {
  title: string
  code: string
  language?: string
  description?: string
}

export function CodeExample({
  title,
  code,
  language = 'typescript',
  description
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      {description && (
        <div className="px-4 py-2 border-b bg-gray-50">
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}
      <pre className="p-4 overflow-x-auto bg-gray-900 text-gray-100">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}
