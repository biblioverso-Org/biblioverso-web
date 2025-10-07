import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Star, LogOut, Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const user = session.user

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Encabezado de perfil */}
                    <Card className="overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
                        <CardContent className="relative pt-0 pb-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12">
                                <div className="relative">
                                    <div className="h-32 w-32 rounded-full border-4 border-background bg-muted overflow-hidden">
                                        <Image
                                            src={user?.image || "/placeholder.svg"}
                                            alt={user?.name || "Usuario"}
                                            width={128}
                                            height={128}
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 text-center sm:text-left sm:mb-4">
                                    <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                                        {user?.name}
                                    </h1>
                                    <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                                        <Mail className="h-4 w-4" />
                                        {user?.email}
                                    </p>
                                </div>

                                <div className="flex gap-2 sm:mb-4">
                                    <Button variant="outline" asChild>
                                        <Link href="/api/auth/signout">
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Cerrar sesión
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información personal */}
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
                                        <Input id="name" value={user?.name || ""} disabled className="pl-10 bg-muted" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" value={user?.email || ""} disabled className="pl-10 bg-muted" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="address" value={"—"} disabled className="pl-10 bg-muted" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Acciones rápidas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-3">
                            <Button variant="outline" className="justify-start bg-transparent" asChild>
                                <Link href="/reservas">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Ver mis reservas
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start bg-transparent" asChild>
                                <Link href="/favoritos">
                                    <Star className="h-4 w-4 mr-2" />
                                    Ver mis favoritos
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start bg-transparent" asChild>
                                <Link href="/catalogo">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Explorar catálogo
                                </Link>
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
