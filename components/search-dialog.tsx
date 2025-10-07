"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Book, Star, X } from "lucide-react"
import { mockBooks, categories } from "@/lib/mock-data"
import Link from "next/link"
import Image from "next/image"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [availableOnly, setAvailableOnly] = useState(false)

  const filteredBooks = useMemo(() => {
    let results = mockBooks

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery) ||
          book.description.toLowerCase().includes(lowerQuery),
      )
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter((book) => book.category === selectedCategory)
    }

    // Filter by availability
    if (availableOnly) {
      results = results.filter((book) => book.available)
    }

    return results.slice(0, 8) // Limit to 8 results
  }, [query, selectedCategory, availableOnly])

  const clearFilters = () => {
    setSelectedCategory(null)
    setAvailableOnly(false)
  }

  const hasActiveFilters = selectedCategory || availableOnly

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0 gap-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="p-6 pb-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar libros, autores..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-lg border-2 focus-visible:ring-primary/20"
                autoFocus
              />
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-muted-foreground">Filtros:</span>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Availability Filter */}
            <div className="flex items-center gap-2">
              <Button
                variant={availableOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailableOnly(!availableOnly)}
                className="h-8"
              >
                Solo disponibles
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            {query.trim() === "" && !hasActiveFilters ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Book className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Busca libros por título o autor</p>
                <p className="text-sm text-muted-foreground mt-2">Usa los filtros para refinar tu búsqueda</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Book className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No se encontraron resultados</p>
                <p className="text-sm text-muted-foreground mt-2">Intenta con otros términos o filtros</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/libro/${book.id}`}
                    onClick={() => onOpenChange(false)}
                    className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent transition-all hover:shadow-md group"
                  >
                    <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{book.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {book.category}
                        </Badge>
                        {book.available ? (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                            Disponible
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs border-red-500 text-red-600">
                            No disponible
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
