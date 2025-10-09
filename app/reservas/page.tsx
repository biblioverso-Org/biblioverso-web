"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    Package,
    ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import useSWR, { mutate } from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ReservationsPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const id_usuario = Number(session?.user?.id)
    const [activeTab, setActiveTab] = useState("active")

    // 🔹 Obtener reservas reales
    const { data: reservas = [], isLoading } = useSWR(
        id_usuario ? `/api/reservas?id_usuario=${id_usuario}` : null,
        fetcher
    )

    // 🔐 Si no está logueado
    if (status === "loading") return <div className="p-10 text-center">Cargando...</div>

    if (!id_usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">Inicia sesión para ver tus reservas</h2>
                        <p className="text-muted-foreground mb-6">
                            Necesitas una cuenta para gestionar tus reservas de libros
                        </p>
                        <Button onClick={() => router.push("/login")} size="lg">
                            Iniciar Sesión
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isLoading)
        return <div className="p-10 text-center">Cargando reservas...</div>

    // 🔹 Clasificar reservas según estado
    const activeReservations = reservas.filter(
        (r: any) => r.estado === "pendiente" || r.estado === "espera"
    )
    const completedReservations = reservas.filter((r: any) => r.estado === "completado")
    const cancelledReservations = reservas.filter((r: any) => r.estado === "cancelado")

    // 🔹 Etiquetas visuales por estado
    const getStatusBadge = (estado: string) => {
        switch (estado) {
            case "pendiente":
                return <Badge variant="default">En proceso</Badge>
            case "espera":
                return <Badge className="bg-amber-500 text-white">En lista de espera</Badge>
            case "completado":
                return <Badge variant="secondary">Completado</Badge>
            case "cancelado":
                return <Badge variant="destructive">Cancelado</Badge>
        }
    }

    const getStatusIcon = (estado: string) => {
        switch (estado) {
            case "pendiente":
                return <Clock className="h-5 w-5 text-blue-500" />
            case "espera":
                return <Package className="h-5 w-5 text-amber-500" />
            case "completado":
                return <CheckCircle2 className="h-5 w-5 text-gray-500" />
            case "cancelado":
                return <XCircle className="h-5 w-5 text-red-500" />
        }
    }

    // ❌ Cancelar reserva
    const handleCancel = async (id_reserva: number) => {
        const confirmCancel = confirm("¿Seguro que deseas cancelar esta reserva?")
        if (!confirmCancel) return

        const res = await fetch(`/api/reservas/${id_reserva}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "cancelado" }),
        })

        if (res.ok) {
            mutate(`/api/reservas?id_usuario=${id_usuario}`)
        }
    }

    // 🧩 Componente de reserva individual
    const ReservationCard = ({ reserva }: { reserva: any }) => {
        const libro = reserva.libro
        if (!libro) return null

        return (
            <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <Link href={`/libro/${libro.id_libro}`} className="flex-shrink-0">
                            <div className="relative w-24 h-36 rounded-md overflow-hidden">
                                <Image
                                    src={libro.portada || "/placeholder.svg"}
                                    alt={libro.titulo}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1">
                                    <Link href={`/libro/${libro.id_libro}`}>
                                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                            {libro.titulo}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                        {libro.libro_autor?.map((a: any) => a.autor.nombre).join(", ") || "Autor desconocido"}
                                    </p>
                                </div>
                                {getStatusBadge(reserva.estado)}
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    {getStatusIcon(reserva.estado)}
                                    <span>
                    {reserva.estado === "pendiente" && "Preparando tu reserva"}
                                        {reserva.estado === "espera" && "En lista de espera"}
                                        {reserva.estado === "completado" && "Reserva completada"}
                                        {reserva.estado === "cancelado" && "Reserva cancelada"}
                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                    Reservado el{" "}
                                        {new Date(reserva.fecha_reserva).toLocaleDateString("es-ES")}
                  </span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                {reserva.estado === "pendiente" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCancel(Number(reserva.id_reserva))}
                                    >
                                        Cancelar reserva
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/libro/${libro.id_libro}`}>Ver libro</Link>
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
                    <h1
                        className="text-4xl font-bold mb-2"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
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
                            activeReservations.map((reserva: any) => (
                                <ReservationCard key={reserva.id_reserva} reserva={reserva} />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        No tienes reservas activas
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Explora nuestro catálogo y reserva tu próximo libro
                                    </p>
                                    <Button asChild>
                                        <Link href="/catalogo">Explorar catálogo</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4">
                        {completedReservations.length > 0 ? (
                            completedReservations.map((reserva: any) => (
                                <ReservationCard key={reserva.id_reserva} reserva={reserva} />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        No hay reservas completadas
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Tus reservas completadas aparecerán aquí
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled" className="space-y-4">
                        {cancelledReservations.length > 0 ? (
                            cancelledReservations.map((reserva: any) => (
                                <ReservationCard key={reserva.id_reserva} reserva={reserva} />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <XCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        No hay reservas canceladas
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Tus reservas canceladas aparecerán aquí
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
