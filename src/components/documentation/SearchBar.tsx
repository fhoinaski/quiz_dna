// src/components/documentation/SearchBar.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface SearchBarProps {
  onSearch: (term: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar na documentação...",
  className
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, onSearch])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}