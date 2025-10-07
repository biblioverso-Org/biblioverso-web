"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import {
    BookOpen,
    Mail,
    Lock,
    UserIcon,
    Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoginDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Campos de formulario (login)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Campos de formulario (registro)
    const [registerFirstName, setRegisterFirstName] = useState("")
    const [registerLastName, setRegisterLastName] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerPhone, setRegisterPhone] = useState("")

    // 🔐 LOGIN REAL con NextAuth
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        })

        if (res?.error) {
            setError("Credenciales incorrectas o usuario no encontrado.")
        } else {
            onOpenChange(false)
            router.push("/perfil")
        }

        setIsLoading(false)
    }

    // 🧾 REGISTRO REAL (API /api/auth/register)
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: registerFirstName,
                    apellido: registerLastName,
                    email: registerEmail,
                    password: registerPassword,
                    telefono: registerPhone,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setError("✅ Registro exitoso. Ahora puedes iniciar sesión.")
                // Limpiar los campos del registro
                setRegisterFirstName("")
                setRegisterLastName("")
                setRegisterEmail("")
                setRegisterPassword("")
                setRegisterPhone("")
            } else {
                setError(data.error || "Error al registrar el usuario.")
            }
        } catch {
            setError("Error al conectar con el servidor.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span
                            className="text-xl font-bold text-primary"
                            style={{ fontFamily: "var(--font-playfair)" }}
                        >
              Biblioverso
            </span>
                    </div>
                    <DialogTitle className="text-center">Bienvenido</DialogTitle>
                    <DialogDescription className="text-center">
                        Inicia sesión o crea una cuenta para comenzar
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="register">Registrarse</TabsTrigger>
                    </TabsList>

                    {/* LOGIN */}
                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>
                        </form>
                    </TabsContent>

                    {/* REGISTRO */}
                    <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="register-firstname">Nombre</Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="register-firstname"
                                            type="text"
                                            placeholder="Juan"
                                            className="pl-10"
                                            value={registerFirstName}
                                            onChange={(e) => setRegisterFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="register-lastname">Apellido</Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="register-lastname"
                                            type="text"
                                            placeholder="Pérez"
                                            className="pl-10"
                                            value={registerLastName}
                                            onChange={(e) => setRegisterLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="register-email">Correo electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        className="pl-10"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="register-password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="register-password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="register-phone">Teléfono</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="register-phone"
                                        type="tel"
                                        placeholder="+34 600 123 456"
                                        className="pl-10"
                                        value={registerPhone}
                                        onChange={(e) => setRegisterPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-muted border border-border rounded-md">
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
