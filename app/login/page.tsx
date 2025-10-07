"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { BookOpen, Mail, Lock, UserIcon, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Login form
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Register form
    const [registerFirstName, setRegisterFirstName] = useState("")
    const [registerLastName, setRegisterLastName] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerPhone, setRegisterPhone] = useState("")

    // 🔐 LOGIN
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const res = await signIn("credentials", {
            redirect: false,
            email: loginEmail,
            password: loginPassword,
        })

        if (res?.ok) {
            router.push("/perfil")
        } else {
            setError("Credenciales incorrectas o usuario no encontrado.")
        }

        setIsLoading(false)
    }

    // 🧾 REGISTER
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
                // Limpia los campos del formulario
                setRegisterFirstName("")
                setRegisterLastName("")
                setRegisterEmail("")
                setRegisterPassword("")
                setRegisterPhone("")
            } else {
                setError(data.error || "Error al registrar usuario.")
            }
        } catch (err) {
            console.error(err)
            setError("Error inesperado en el registro.")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 animate-fade-in">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                        <BookOpen className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                        <span className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
              Biblioverso
            </span>
                    </Link>
                    <p className="text-muted-foreground">Tu biblioteca digital favorita</p>
                </div>

                <Card className="animate-slide-up shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Bienvenido</CardTitle>
                        <CardDescription className="text-center">
                            Inicia sesión o crea una cuenta para comenzar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                                <TabsTrigger value="register">Registrarse</TabsTrigger>
                            </TabsList>

                            {/* 🔑 LOGIN TAB */}
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Correo electrónico</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="tu@email.com"
                                                className="pl-10"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Contraseña</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
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

                                    <div className="text-center">
                                        <Button variant="link" className="text-sm">
                                            ¿Olvidaste tu contraseña?
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>

                            {/* 📝 REGISTER TAB */}
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
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
