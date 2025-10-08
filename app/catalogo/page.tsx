"use client"

import { useState, useMemo, Suspense } from "react"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, SlidersHorizontal, Star, X } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function CatalogContent() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q") || ""
    const initialCategory = searchParams.get("categoria") || "all"

    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [selectedCategory, setSelectedCategory] = useState(initialCategory)
    const [availabilityFilter, setAvailabilityFilter] = useState<
        "all" | "available" | "unavailable"
    >("all")
    const [sortBy, setSortBy] = useState<"title" | "rating" | "year">("title")

    // Construir URL dinámica
    const apiUrl = useMemo(() => {
        const params = new URLSearchParams()
        if (searchQuery) params.set("q", searchQuery)
        if (selectedCategory !== "all") params.set("categoria", selectedCategory)
        if (availabilityFilter !== "all")
            params.set("disponibilidad", availabilityFilter)
        if (sortBy) params.set("sort", sortBy)
        return `/api/libros?${params.toString()}`
    }, [searchQuery, selectedCategory, availabilityFilter, sortBy])

    // Fetch con SWR
    const { data: books = [], isLoading, error } = useSWR(apiUrl, fetcher, {
        revalidateOnFocus: true,
    })

    // Fetch de categorías dinámicas
    const {
        data: categorias = [],
        isLoading: loadingCategorias,
        error: categoriasError,
    } = useSWR("/api/categorias", fetcher)

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedCategory("all")
        setAvailabilityFilter("all")
        setSortBy("title")
    }

    const hasActiveFilters =
        searchQuery || selectedCategory !== "all" || availabilityFilter !== "all"

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1
                    className="text-4xl md:text-5xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    Catálogo de Libros
                </h1>
                <p className="text-muted-foreground text-lg">
                    Explora nuestra colección de libros
                </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por título, autor o descripción..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Mobile Filters */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="md:hidden bg-transparent">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filtros
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filtros</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                                {/* Categoría */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Categoría
                                    </label>
                                    <Select
                                        value={selectedCategory}
                                        onValueChange={setSelectedCategory}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todas las categorías" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas</SelectItem>
                                            {!loadingCategorias &&
                                                !categoriasError &&
                                                categorias.map((cat: any) => (
                                                    <SelectItem
                                                        key={cat.id}
                                                        value={cat.nombre.toLowerCase()}
                                                    >
                                                        {cat.nombre}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Disponibilidad */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Disponibilidad
                                    </label>
                                    <Select
                                        value={availabilityFilter}
                                        onValueChange={(value: any) => setAvailabilityFilter(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="available">Disponibles</SelectItem>
                                            <SelectItem value="unavailable">Sin stock</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Orden */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Ordenar por
                                    </label>
                                    <Select
                                        value={sortBy}
                                        onValueChange={(value: any) => setSortBy(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="title">Título</SelectItem>
                                            <SelectItem value="rating">Valoración</SelectItem>
                                            <SelectItem value="year">Año</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Desktop Filters */}
                    <div className="hidden md:flex gap-2">
                        {/* Categoría */}
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                {!loadingCategorias &&
                                    !categoriasError &&
                                    categorias.map((cat: any) => (
                                        <SelectItem key={cat.id} value={cat.nombre.toLowerCase()}>
                                            {cat.nombre}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>

                        {/* Disponibilidad */}
                        <Select
                            value={availabilityFilter}
                            onValueChange={(value: any) => setAvailabilityFilter(value)}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="available">Disponibles</SelectItem>
                                <SelectItem value="unavailable">Sin stock</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Ordenar */}
                        <Select
                            value={sortBy}
                            onValueChange={(value: any) => setSortBy(value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="title">Título</SelectItem>
                                <SelectItem value="rating">Valoración</SelectItem>
                                <SelectItem value="year">Año</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              Filtros activos:
            </span>
                        {searchQuery && (
                            <Badge variant="secondary" className="gap-1">
                                Búsqueda: {searchQuery}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => setSearchQuery("")}
                                />
                            </Badge>
                        )}
                        {selectedCategory !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                {selectedCategory}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => setSelectedCategory("all")}
                                />
                            </Badge>
                        )}
                        {availabilityFilter !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                {availabilityFilter === "available"
                                    ? "Disponibles"
                                    : "Sin stock"}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => setAvailabilityFilter("all")}
                                />
                            </Badge>
                        )}
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Limpiar todo
                        </Button>
                    </div>
                )}
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-[320px] bg-muted/40 rounded-xl" />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center text-red-500 py-10">
                    Error al cargar libros 😞
                </div>
            )}

            {/* Books Grid */}
            {!isLoading && !error && books.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book: any, index: number) => (
                        <Link
                            key={book.id}
                            href={`/libro/${book.id}`}
                            className="group"
                            style={{ animationDelay: `${(index % 12) * 50}ms` }}
                        >
                            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-scale-in h-full">
                                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                    <img
                                        src={book.cover || "/placeholder.svg"}
                                        alt={book.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {!book.available && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Badge variant="secondary">Sin stock</Badge>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-background/90 backdrop-blur">
                                            {book.category}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                        {book.author}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-medium">
                        {book.rating}
                      </span>
                                        </div>
                                        {book.available && (
                                            <Badge variant="outline" className="text-xs">
                                                {book.stock} disponibles
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && books.length === 0 && (
                <div className="text-center py-16">
                    <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                        No se encontraron libros
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Intenta ajustar tus filtros o realizar una búsqueda diferente
                    </p>
                    <Button onClick={clearFilters}>Limpiar filtros</Button>
                </div>
            )}
        </div>
    )
}

export default function CatalogoPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Cargando...</div>}>
            <CatalogContent />
        </Suspense>
    )
}
