"use client"

import { useParams, useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    Star,
    Heart,
    Calendar,
    ChevronLeft,
    User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BookDetailPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const params = useParams()
    const id_libro = Number(params.id)
    const id_usuario = Number(session?.user?.id)

    const { data: book, isLoading, error } = useSWR(`/api/libros/${id_libro}`, fetcher)
    const { data: favoritos = [] } = useSWR(
        id_usuario ? `/api/favoritos?id_usuario=${id_usuario}` : null,
        fetcher
    )

    const [newReview, setNewReview] = useState("")
    const [newRating, setNewRating] = useState(5)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isReserved, setIsReserved] = useState(false)
    const [selectedQty, setSelectedQty] = useState(1)

    // 🔹 Verifica si el libro ya está en favoritos
    useEffect(() => {
        if (favoritos && id_libro) {
            const fav = favoritos.some((f: any) => f.id_libro === id_libro)
            setIsFavorite(fav)
        }
    }, [favoritos, id_libro])

    // 🔐 Requiere login
    const requireAuth = () => {
        if (!id_usuario) {
            router.push("/login")
            return false
        }
        return true
    }

    // ❤️ Favoritos
    const handleFavorite = async () => {
        if (!requireAuth()) return
        const method = isFavorite ? "DELETE" : "POST"
        const res = await fetch("/api/favoritos", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario, id_libro }),
        })
        if (res.ok) {
            setIsFavorite(!isFavorite)
            mutate(`/api/favoritos?id_usuario=${id_usuario}`)
        }
    }

    // 📚 Reservas
    const handleReserve = async () => {
        if (!requireAuth()) return
        const res = await fetch("/api/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario, id_libro, cantidad: selectedQty }),
        })
        if (res.ok) setIsReserved(true)
    }

    // ⭐ Reseñas
    const handleSubmitReview = async () => {
        if (!requireAuth()) return
        if (!newReview.trim()) return alert("Por favor escribe un comentario.")

        const res = await fetch("/api/opiniones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_usuario,
                id_libro,
                comentario: newReview,
                calificacion: newRating,
            }),
        })

        if (res.ok) {
            setNewReview("")
            setNewRating(5)
            mutate(`/api/libros/${id_libro}`)
        }
    }

    if (isLoading)
        return <div className="p-10 text-center">Cargando libro...</div>
    if (error || !book)
        return <div className="p-10 text-center text-red-500">Error al cargar libro</div>

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" asChild className="mb-6 group">
                    <Link href="/catalogo">
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Volver al catálogo
                    </Link>
                </Button>

                <div className="grid md:grid-cols-[350px_1fr] gap-8 mb-12">
                    {/* 📘 Portada + acciones */}
                    <div className="space-y-4">
                        <Card className="overflow-hidden group">
                            <div className="relative aspect-[2/3] overflow-hidden">
                                <Image
                                    src={book.portada || "/placeholder.svg"}
                                    alt={`Portada de ${book.titulo}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </Card>

                        {/* 🔢 Selector de cantidad */}
                        {book.disponible && (
                            <div className="flex items-center justify-between bg-muted/40 rounded-lg px-4 py-2 mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Copias disponibles: <strong>{book.stock}</strong>
                </span>
                                <select
                                    className="border rounded-md px-2 py-1 text-sm"
                                    value={selectedQty}
                                    onChange={(e) => setSelectedQty(Number(e.target.value))}
                                >
                                    {Array.from({ length: book.stock }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* 🔘 Acciones */}
                        <div className="space-y-2">
                            <Button
                                onClick={handleReserve}
                                disabled={isReserved}
                                className="w-full"
                                size="lg"
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                {isReserved
                                    ? "Reserva realizada"
                                    : book.disponible
                                        ? "Reservar libro"
                                        : "Unirse a lista de espera"}
                            </Button>

                            <Button
                                onClick={handleFavorite}
                                variant={isFavorite ? "default" : "outline"}
                                className="w-full"
                                size="lg"
                            >
                                <Heart
                                    className={`mr-2 h-4 w-4 ${
                                        isFavorite ? "fill-current text-red-500" : ""
                                    }`}
                                />
                                {isFavorite ? "En favoritos" : "Añadir a favoritos"}
                            </Button>
                        </div>
                    </div>

                    {/* 📖 Detalle del libro */}
                    <div className="space-y-6">
                        <div>
                            <h1
                                className="text-4xl font-bold mb-2"
                                style={{ fontFamily: "var(--font-playfair)" }}
                            >
                                {book.titulo}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-4">
                                {book.autores?.length
                                    ? `por ${book.autores.join(", ")}`
                                    : "Autor desconocido"}
                            </p>

                            <div className="flex items-center gap-4 mb-4">
                                <Badge variant={book.disponible ? "default" : "secondary"}>
                                    {book.disponible ? "Disponible" : "Agotado"}
                                </Badge>
                                <Badge variant="outline">{book.categoria}</Badge>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-3">Sinopsis</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {book.sinopsis}
                                </p>
                            </CardContent>
                        </Card>

                        {/* ⭐ Reseñas */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Reseñas</h2>

                                {status === "authenticated" && (
                                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                                        <h3 className="font-semibold mb-3">Escribe tu reseña</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 cursor-pointer ${
                                                        i < newRating
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-muted-foreground"
                                                    }`}
                                                    onClick={() => setNewRating(i + 1)}
                                                />
                                            ))}
                                        </div>
                                        <Textarea
                                            placeholder="Comparte tu opinión..."
                                            value={newReview}
                                            onChange={(e) => setNewReview(e.target.value)}
                                            className="mb-3"
                                            rows={4}
                                        />
                                        <Button onClick={handleSubmitReview}>Publicar reseña</Button>
                                    </div>
                                )}

                                {book.opiniones?.length > 0 ? (
                                    book.opiniones.map((op: any) => (
                                        <Card key={op.id} className="mb-4">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{op.usuario}</p>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {new Date(op.fecha).toLocaleDateString()}
                                                        </p>
                                                        <p>{op.comentario}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-6">
                                        Aún no hay reseñas
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
