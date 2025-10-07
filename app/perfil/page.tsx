"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Star, LogOut, Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  // Editable fields
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [address, setAddress] = useState(user?.address || "")

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Inicia sesión para ver tu perfil</h2>
            <p className="text-muted-foreground mb-6">Necesitas una cuenta para acceder a tu perfil</p>
            <Button onClick={() => router.push("/login")} size="lg">
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSave = () => {
    // Mock save - in real app would update user data
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-4 border-background bg-muted overflow-hidden">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left sm:mb-4">
                  <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>

                <div className="flex gap-2 sm:mb-4">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar perfil
                    </Button>
                  ) : (
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar cambios
                    </Button>
                  )}
                  <Button onClick={handleLogout} variant="outline">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold mb-1">{user.booksRead}</p>
                <p className="text-sm text-muted-foreground">Libros leídos</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold mb-1">{user.reservationsCount}</p>
                <p className="text-sm text-muted-foreground">Reservas totales</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold mb-1">{user.reviewsCount}</p>
                <p className="text-sm text-muted-foreground">Reseñas escritas</p>
              </CardContent>
            </Card>
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" value={user.email} disabled className="pl-10 bg-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-since">Miembro desde</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="member-since"
                      value={new Date(user.memberSince).toLocaleDateString("es-ES")}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <a href="/reservas">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver mis reservas
                </a>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <a href="/favoritos">
                  <Star className="h-4 w-4 mr-2" />
                  Ver mis favoritos
                </a>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <a href="/catalogo">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explorar catálogo
                </a>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent">
                <Edit2 className="h-4 w-4 mr-2" />
                Cambiar contraseña
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
