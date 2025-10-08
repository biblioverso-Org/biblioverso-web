"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Book, Star, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [availableOnly, setAvailableOnly] = useState(false)

    // 🔸 Debounce (400ms)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(query), 400)
        return () => clearTimeout(handler)
    }, [query])

    // 🔹 Obtener categorías
    const { data: categorias = [] } = useSWR(open ? "/api/categorias" : null, fetcher)

    // 🔹 Obtener libros dinámicamente
    const { data: libros = [], isLoading } = useSWR(
        () => {
            const params = new URLSearchParams()
            if (debouncedQuery) params.set("q", debouncedQuery)
            if (selectedCategory) params.set("categoria", selectedCategory)
            if (availableOnly) params.set("disponibilidad", "available")
            return open ? `/api/libros?${params.toString()}` : null
        },
        fetcher,
        { revalidateOnFocus: false }
    )

    const clearFilters = useCallback(() => {
        setSelectedCategory(null)
        setAvailableOnly(false)
    }, [])

    const hasActiveFilters = selectedCategory || availableOnly

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] p-0 gap-0 overflow-y-auto rounded-2xl border border-border/50 bg-background shadow-xl scrollbar-thin scrollbar-thumb-muted/30">
                {/* Accesibilidad */}
                <DialogTitle className="sr-only">Buscador de libros</DialogTitle>
                <DialogDescription className="sr-only">
                    Encuentra libros por título, autor o categoría
                </DialogDescription>

                <div className="flex flex-col h-full">
                    {/* 🔎 Header fijo */}
                    <div className="p-5 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Buscar libros, autores..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 h-12 text-lg border-2 rounded-xl focus-visible:ring-primary/20 w-full"
                                autoFocus
                            />

                            {/* 🔹 Autocompletado */}
                            <AnimatePresence>
                                {debouncedQuery && libros.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 mt-2 w-full bg-card border rounded-xl shadow-lg z-50 overflow-hidden"
                                    >
                                        {libros.slice(0, 5).map((libro: any) => (
                                            <Link
                                                key={libro.id}
                                                href={`/libro/${libro.id}`}
                                                onClick={() => onOpenChange(false)}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-accent/60 transition-colors"
                                            >
                                                <div className="relative w-8 h-12 flex-shrink-0 rounded overflow-hidden">
                                                    <Image
                                                        src={libro.cover || "/placeholder.svg"}
                                                        alt={`Portada de ${libro.title}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium line-clamp-1">
                                                        {libro.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {libro.author}
                                                    </p>
                                                </div>
                                                {libro.available ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs border-green-500 text-green-600"
                                                    >
                                                        Disponible
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs border-red-500 text-red-600"
                                                    >
                                                        No disponible
                                                    </Badge>
                                                )}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* 🧭 Filtros */}
                    <div className="px-6 py-4 border-b bg-muted/40">
                        <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                Filtros:
              </span>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="h-7 text-xs"
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Limpiar
                                </Button>
                            )}
                        </div>

                        {/* Categorías dinámicas */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {categorias.map((cat: any) => (
                                <Badge
                                    key={cat.id}
                                    variant={
                                        selectedCategory === cat.nombre ? "default" : "outline"
                                    }
                                    className="cursor-pointer transition-all hover:scale-105"
                                    onClick={() =>
                                        setSelectedCategory(
                                            selectedCategory === cat.nombre ? null : cat.nombre
                                        )
                                    }
                                >
                                    {cat.nombre}
                                </Badge>
                            ))}
                        </div>

                        {/* Solo disponibles */}
                        <Button
                            variant={availableOnly ? "default" : "outline"}
                            size="sm"
                            onClick={() => setAvailableOnly(!availableOnly)}
                            className="h-8"
                        >
                            Solo disponibles
                        </Button>
                    </div>

                    {/* 📚 Resultados */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-muted/20">
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Cargando resultados...
                            </div>
                        ) : !debouncedQuery && !hasActiveFilters ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Book className="h-16 w-16 text-muted-foreground/40 mb-4" />
                                <p className="text-lg font-medium text-muted-foreground">
                                    Busca libros por título o autor
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Usa los filtros para refinar tu búsqueda
                                </p>
                            </div>
                        ) : libros.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Book className="h-16 w-16 text-muted-foreground/40 mb-4" />
                                <p className="text-lg font-medium text-muted-foreground">
                                    No se encontraron resultados
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Intenta con otros términos o filtros
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {libros.map((book: any) => (
                                    <Link
                                        key={book.id}
                                        href={`/libro/${book.id}`}
                                        onClick={() => onOpenChange(false)}
                                        className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/40 transition-all hover:shadow-md group"
                                    >
                                        <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden">
                                            <Image
                                                src={book.cover || "/placeholder.svg"}
                                                alt={`Portada de ${book.title}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {book.author}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                    <span className="text-xs font-medium">
                            {book.rating}
                          </span>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {book.category}
                                                </Badge>
                                                {book.available ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs border-green-500 text-green-600"
                                                    >
                                                        Disponible
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs border-red-500 text-red-600"
                                                    >
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
