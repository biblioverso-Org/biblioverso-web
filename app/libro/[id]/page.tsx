"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, Calendar, BookOpen, Clock, Globe, Hash, ChevronLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { getBookById, mockReservations, mockFavorites } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const bookId = Number(params.id)
  const book = getBookById(bookId)

  const [isFavorite, setIsFavorite] = useState(
    mockFavorites.some((fav) => fav.bookId === bookId && fav.userId === user?.id),
  )
  const [isReserved, setIsReserved] = useState(
    mockReservations.some((res) => res.bookId === bookId && res.userId === user?.id && res.status === "active"),
  )
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Libro no encontrado</h1>
        <Button asChild>
          <Link href="/catalogo">Volver al catálogo</Link>
        </Button>
      </div>
    )
  }

  const handleReserve = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    setIsReserved(true)
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    setIsFavorite(!isFavorite)
  }

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    // Mock review submission
    setNewReview("")
    setNewRating(5)
  }

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
          {/* Book Cover */}
          <div className="space-y-4">
            <Card className="overflow-hidden group">
              <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                  src={book.cover || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Card>

            <div className="space-y-2">
              <Button onClick={handleReserve} disabled={!book.available || isReserved} className="w-full" size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                {isReserved ? "Ya reservado" : book.available ? "Reservar libro" : "No disponible"}
              </Button>

              <Button
                onClick={handleToggleFavorite}
                variant={isFavorite ? "default" : "outline"}
                className="w-full"
                size="lg"
              >
                <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "En favoritos" : "Añadir a favoritos"}
              </Button>
            </div>

            {!book.available && (
              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Este libro está agotado. Únete a la lista de espera para ser notificado cuando esté disponible.
                  </p>
                  <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm">
                    Unirse a lista de espera
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-balance" style={{ fontFamily: "var(--font-playfair)" }}>
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">por {book.author}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(book.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-semibold">{book.rating}</span>
                </div>
                <Badge variant={book.available ? "default" : "secondary"}>
                  {book.available ? `${book.stock} disponibles` : "Agotado"}
                </Badge>
                <Badge variant="outline">{book.category}</Badge>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-3">Sinopsis</h2>
                <p className="text-muted-foreground leading-relaxed">{book.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Detalles del libro</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Páginas</p>
                      <p className="font-medium">{book.pages}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Idioma</p>
                      <p className="font-medium">{book.language}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Año de publicación</p>
                      <p className="font-medium">{book.publishYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">ISBN</p>
                      <p className="font-medium text-sm">{book.isbn}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
              Reseñas y valoraciones
            </h2>

            {/* Add Review */}
            <div className="mb-8 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-3">Escribe tu reseña</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">Tu valoración:</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 cursor-pointer transition-colors ${
                      i < newRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                    }`}
                    onClick={() => setNewRating(i + 1)}
                  />
                ))}
              </div>
              <Textarea
                placeholder="Comparte tu opinión sobre este libro..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="mb-3"
                rows={4}
              />
              <Button onClick={handleSubmitReview}>Publicar reseña</Button>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-4">
              {book.reviews.length > 0 ? (
                book.reviews.map((review) => (
                  <Card key={review.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">{review.userName}</p>
                              <p className="text-sm text-muted-foreground">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "fill-muted text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Aún no hay reseñas. ¡Sé el primero en compartir tu opinión!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
