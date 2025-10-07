"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, CheckCircle2, XCircle, Package, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getReservationsByUserId, getBookById, type Reservation } from "@/lib/mock-data"

export default function ReservationsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("active")

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Inicia sesión para ver tus reservas</h2>
            <p className="text-muted-foreground mb-6">Necesitas una cuenta para gestionar tus reservas de libros</p>
            <Button onClick={() => router.push("/login")} size="lg">
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userReservations = getReservationsByUserId(user.id)
  const activeReservations = userReservations.filter((r) => r.status === "active" || r.status === "ready")
  const completedReservations = userReservations.filter((r) => r.status === "completed")
  const cancelledReservations = userReservations.filter((r) => r.status === "cancelled")

  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default">En proceso</Badge>
      case "ready":
        return <Badge className="bg-green-500">Listo para recoger</Badge>
      case "completed":
        return <Badge variant="secondary">Completado</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>
    }
  }

  const getStatusIcon = (status: Reservation["status"]) => {
    switch (status) {
      case "active":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "ready":
        return <Package className="h-5 w-5 text-green-500" />
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-gray-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
    const book = getBookById(reservation.bookId)
    if (!book) return null

    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Link href={`/libro/${book.id}`} className="flex-shrink-0">
              <div className="relative w-24 h-36 rounded-md overflow-hidden">
                <Image
                  src={book.cover || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <Link href={`/libro/${book.id}`}>
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
                {getStatusBadge(reservation.status)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getStatusIcon(reservation.status)}
                  <span>
                    {reservation.status === "active" && "Preparando tu reserva"}
                    {reservation.status === "ready" && "Listo para recoger en biblioteca"}
                    {reservation.status === "completed" && `Recogido el ${reservation.pickupDate}`}
                    {reservation.status === "cancelled" && "Reserva cancelada"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Reservado: {reservation.reservationDate}</span>
                </div>

                {reservation.status !== "cancelled" && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expira: {reservation.expiryDate}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {reservation.status === "active" && (
                  <Button variant="outline" size="sm">
                    Cancelar reserva
                  </Button>
                )}
                {reservation.status === "ready" && (
                  <Button size="sm" className="group/btn">
                    Ver detalles de recogida
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/libro/${book.id}`}>Ver libro</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Mis Reservas
          </h1>
          <p className="text-muted-foreground">Gestiona tus reservas de libros</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="active">
              Activas
              {activeReservations.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeReservations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completadas</TabsTrigger>
            <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeReservations.length > 0 ? (
              activeReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No tienes reservas activas</h3>
                  <p className="text-muted-foreground mb-6">Explora nuestro catálogo y reserva tu próximo libro</p>
                  <Button asChild>
                    <Link href="/catalogo">Explorar catálogo</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedReservations.length > 0 ? (
              completedReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No hay reservas completadas</h3>
                  <p className="text-muted-foreground">Tus reservas completadas aparecerán aquí</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledReservations.length > 0 ? (
              cancelledReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <XCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No hay reservas canceladas</h3>
                  <p className="text-muted-foreground">Tus reservas canceladas aparecerán aquí</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
