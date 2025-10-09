"use client"

import Link from "next/link"
import {
    BookOpen,
    Search,
    User,
    Heart,
    Calendar,
    LogOut,
    Bell,
    CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { LoginDialog } from "@/components/login-dialog"
import { SearchDialog } from "@/components/search-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Header() {
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const { data: session, status } = useSession()

    const isAuthenticated = status === "authenticated"
    const id_usuario = session?.user?.id

    // 🔔 Obtener notificaciones con SWR
    const { data: notificaciones = [], mutate } = useSWR(
        isAuthenticated ? `/api/notificaciones?id_usuario=${id_usuario}` : null,
        fetcher,
        { refreshInterval: 10000 } // 🔄 refresca cada 10s
    )

    // 📬 Cantidad de no leídas
    const unreadCount = notificaciones.filter((n: any) => !n.leida).length

    // ✅ Marcar todas como leídas al abrir el menú
    const markAllAsRead = async () => {
        const unread = notificaciones.filter((n: any) => !n.leida)
        if (unread.length === 0) return

        await Promise.all(
            unread.map((n: any) =>
                fetch("/api/notificaciones", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_notificacion: n.id_notificacion, leida: true }),
                })
            )
        )
        mutate()
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* 🔹 Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                            <BookOpen className="h-7 w-7 text-primary" />
                            <span
                                className="text-2xl font-bold text-primary"
                                style={{ fontFamily: "var(--font-playfair)" }}
                            >
                Biblioverso
              </span>
                        </Link>

                        {/* 🔍 Buscador */}
                        <Button
                            variant="outline"
                            className="hidden md:flex flex-1 max-w-md mx-8 justify-start text-muted-foreground hover:text-foreground bg-transparent"
                            onClick={() => setSearchDialogOpen(true)}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Buscar libros, autores...
                        </Button>

                        {/* 🔧 Navegación derecha */}
                        <nav className="flex items-center gap-2">
                            {/* 🔍 Buscador móvil */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setSearchDialogOpen(true)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            <ThemeToggle />

                            {/* 🔔 Notificaciones */}
                            {isAuthenticated && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="relative hover:text-primary transition-colors"
                                            onClick={markAllAsRead}
                                        >
                                            <Bell className="h-5 w-5" />
                                            {unreadCount > 0 && (
                                                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        className="w-80 p-2"
                                        align="end"
                                        forceMount
                                    >
                                        <h3 className="text-sm font-semibold px-2 pb-2 border-b">
                                            Notificaciones
                                        </h3>

                                        <div className="max-h-80 overflow-y-auto">
                                            {notificaciones.length > 0 ? (
                                                notificaciones.slice(0, 8).map((n: any) => (
                                                    <div
                                                        key={n.id_notificacion}
                                                        className={`px-3 py-2 rounded-md transition-all cursor-pointer ${
                                                            n.leida
                                                                ? "hover:bg-muted/50"
                                                                : "bg-accent/30 hover:bg-accent/50"
                                                        }`}
                                                        onClick={() =>
                                                            fetch("/api/notificaciones", {
                                                                method: "PATCH",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({
                                                                    id_notificacion: n.id_notificacion,
                                                                    leida: true,
                                                                }),
                                                            }).then(() => mutate())
                                                        }
                                                    >
                                                        <p className="text-sm font-medium">{n.titulo}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {n.mensaje}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground mt-1">
                                                            {formatDistanceToNow(new Date(n.fecha), {
                                                                addSuffix: true,
                                                                locale: es,
                                                            })}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-6 text-center text-sm text-muted-foreground">
                                                    <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-muted-foreground/60" />
                                                    No tienes notificaciones
                                                </div>
                                            )}
                                        </div>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {/* 👤 Menú de usuario */}
                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-10 w-10 rounded-full"
                                        >
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={session.user?.image || "/placeholder.svg"}
                                                    alt={session.user?.name ?? "U"}
                                                />
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {session.user?.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                        forceMount
                                    >
                                        <div className="flex items-center justify-start gap-2 p-2">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                <p className="font-medium text-sm">
                                                    {session.user?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem asChild>
                                            <Link href="/perfil" className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Mi Perfil</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                            <Link href="/reservas" className="cursor-pointer">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                <span>Mis Reservas</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                            <Link href="/favoritos" className="cursor-pointer">
                                                <Heart className="mr-2 h-4 w-4" />
                                                <span>Favoritos</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="cursor-pointer text-destructive focus:text-destructive"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Cerrar Sesión</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button onClick={() => setLoginDialogOpen(true)} className="ml-2">
                                    Iniciar Sesión
                                </Button>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* 🔸 Diálogos */}
            <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
            <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
        </>
    )
}
