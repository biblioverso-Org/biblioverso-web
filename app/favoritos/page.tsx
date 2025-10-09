"use client"

import useSWR from "swr"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function FavoritesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const isAuthenticated = status === "authenticated"
    const id_usuario = Number(session?.user?.id)

    // 🧩 Cargar favoritos del usuario logueado
    const { data: favoritos = [], mutate, isLoading } = useSWR(
        isAuthenticated && id_usuario ? `/api/favoritos?id_usuario=${id_usuario}` : null,
        fetcher
    )

    // 🗑️ Eliminar favorito
    const handleRemoveFavorite = async (id_libro: number) => {
        if (!id_usuario) return
        await fetch("/api/favoritos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario, id_libro }),
        })
        mutate()
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">Inicia sesión para ver tus favoritos</h2>
                        <p className="text-muted-foreground mb-6">
                            Guarda tus libros favoritos para acceder a ellos fácilmente
                        </p>
                        <Button onClick={() => router.push("/login")} size="lg">
                            Iniciar Sesión
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                Cargando tus favoritos...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1
                        className="text-4xl font-bold mb-2"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Mis Favoritos
                    </h1>
                    <p className="text-muted-foreground">
                        {favoritos.length}{" "}
                        {favoritos.length === 1 ? "libro guardado" : "libros guardados"}
                    </p>
                </div>

                {favoritos.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favoritos.map((fav: any) => {
                            const libro = fav.libro
                            return (
                                <Card
                                    key={fav.id_favorito}
                                    className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    <CardContent className="p-0">
                                        <Link
                                            href={`/libro/${libro.id}`}
                                            className="block relative aspect-[2/3] overflow-hidden"
                                        >
                                            <Image
                                                src={libro.portada || "/placeholder.svg"}
                                                alt={libro.titulo}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </Link>

                                        <div className="p-4 space-y-3">
                                            <div>
                                                <Link href={`/libro/${libro.id}`}>
                                                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                                        {libro.titulo}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {libro.autores}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                    <span className="text-sm font-medium">
                            {libro.rating}
                          </span>
                                                </div>
                                                <Badge
                                                    variant={libro.disponible ? "default" : "secondary"}
                                                    className="text-xs"
                                                >
                                                    {libro.disponible
                                                        ? `${libro.availableStock}/${libro.totalStock} disponibles`
                                                        : "Agotado"}
                                                </Badge>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1"
                                                    disabled={!libro.disponible}
                                                    asChild={libro.disponible}
                                                >
                                                    {libro.disponible ? (
                                                        <Link href={`/libro/${libro.id}`}>
                                                            <ShoppingCart className="h-4 w-4 mr-1" />
                                                            Reservar
                                                        </Link>
                                                    ) : (
                                                        <>No disponible</>
                                                    )}
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRemoveFavorite(libro.id)}
                                                    className="group/btn"
                                                >
                                                    <Trash2 className="h-4 w-4 transition-colors group-hover/btn:text-destructive" />
                                                </Button>
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                Añadido el{" "}
                                                {new Date(fav.fecha_agregado).toLocaleDateString("es-ES")}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">
                                No tienes libros favoritos
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Explora nuestro catálogo y guarda tus libros favoritos
                            </p>
                            <Button asChild size="lg">
                                <Link href="/catalogo">Explorar catálogo</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
