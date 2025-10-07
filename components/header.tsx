"use client"

import Link from "next/link"
import { BookOpen, Search, User, Heart, Calendar, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
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

export function Header() {
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const { data: session, status } = useSession()

    const isAuthenticated = status === "authenticated"

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                            <BookOpen className="h-7 w-7 text-primary" />
                            <span className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                Biblioverso
              </span>
                        </Link>

                        <Button
                            variant="outline"
                            className="hidden md:flex flex-1 max-w-md mx-8 justify-start text-muted-foreground hover:text-foreground bg-transparent"
                            onClick={() => setSearchDialogOpen(true)}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Buscar libros, autores...
                        </Button>

                        <nav className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchDialogOpen(true)}>
                                <Search className="h-5 w-5" />
                            </Button>

                            <ThemeToggle />

                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={session.user?.image || "/placeholder.svg"} alt={session.user?.name ?? "U"} />
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {session.user?.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <div className="flex items-center justify-start gap-2 p-2">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                <p className="font-medium text-sm">{session.user?.name}</p>
                                                <p className="text-xs text-muted-foreground">{session.user?.email}</p>
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

            <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
            <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
        </>
    )
}
