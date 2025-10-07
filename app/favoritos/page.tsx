"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { getFavoritesByUserId, getBookById } from "@/lib/mock-data"

export default function FavoritesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState(isAuthenticated ? getFavoritesByUserId(user!.id) : [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Inicia sesión para ver tus favoritos</h2>
            <p className="text-muted-foreground mb-6">Guarda tus libros favoritos para acceder a ellos fácilmente</p>
            <Button onClick={() => router.push("/login")} size="lg">
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleRemoveFavorite = (favoriteId: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== favoriteId))
  }

  const favoriteBooks = favorites
    .map((fav) => ({
      favorite: fav,
      book: getBookById(fav.bookId),
    }))
    .filter((item) => item.book !== undefined)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Mis Favoritos
          </h1>
          <p className="text-muted-foreground">
            {favoriteBooks.length} {favoriteBooks.length === 1 ? "libro guardado" : "libros guardados"}
          </p>
        </div>

        {favoriteBooks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteBooks.map(({ favorite, book }) => (
              <Card key={favorite.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/libro/${book!.id}`} className="block relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={book!.cover || "/placeholder.svg"}
                      alt={book!.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  <div className="p-4 space-y-3">
                    <div>
                      <Link href={`/libro/${book!.id}`}>
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {book!.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-1">{book!.author}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{book!.rating}</span>
                      </div>
                      <Badge variant={book!.available ? "default" : "secondary"} className="text-xs">
                        {book!.available ? "Disponible" : "Agotado"}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" disabled={!book!.available} asChild={book!.available}>
                        {book!.available ? (
                          <Link href={`/libro/${book!.id}`}>
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
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        className="group/btn"
                      >
                        <Trash2 className="h-4 w-4 transition-colors group-hover/btn:text-destructive" />
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Añadido el {new Date(favorite.addedDate).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No tienes libros favoritos</h3>
              <p className="text-muted-foreground mb-6">Explora nuestro catálogo y guarda tus libros favoritos</p>
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
