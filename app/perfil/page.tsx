"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Star,
    LogOut,
    Globe,
    FileText,
    Heart,
    UserCircle,
    CalendarDays,
    Edit2,
    Save,
    Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
    const { data: session } = useSession()
    if (!session) redirect("/login")
    const user = session.user

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(user?.image || "/placeholder.svg")

    const [formData, setFormData] = useState({
        nombre: user?.name?.split(" ")[0] || "",
        apellido: user?.name?.split(" ")[1] || "",
        telefono: user?.telefono || "",
        direccion: user?.direccion || "",
        genero: user?.genero || "",
        fecha_nac: user?.fecha_nac || "",
        nacionalidad: user?.nacionalidad || "",
        biografia: user?.biografia || "",
        foto: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result as string
            setPreview(base64)
            setFormData((prev) => ({ ...prev, foto: base64 }))
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                toast({ title: "✅ Perfil actualizado correctamente" })
                setOpen(false)
            } else {
                toast({ title: "⚠️ Error al actualizar perfil", variant: "destructive" })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "❌ Error de conexión", variant: "destructive" })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* =======================
               ENCABEZADO DE PERFIL
          ======================= */}
                    <Card className="overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
                        <CardContent className="relative pt-0 pb-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12">
                                <div className="relative">
                                    <div className="h-32 w-32 rounded-full border-4 border-background bg-muted overflow-hidden">
                                        <Image
                                            src={preview}
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
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Editar perfil
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent
                                            className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto rounded-2xl p-6 bg-background shadow-xl"
                                        >
                                            <DialogHeader className="space-y-2">
                                                <DialogTitle className="text-xl font-semibold text-center">
                                                    Editar perfil
                                                </DialogTitle>
                                                <DialogDescription className="text-center text-muted-foreground">
                                                    Modifica tu información personal o actualiza tu foto de perfil.
                                                </DialogDescription>
                                            </DialogHeader>

                                            {/* Imagen */}
                                            <div className="flex flex-col items-center gap-3 mt-4">
                                                <Image
                                                    src={preview}
                                                    alt="Previsualización"
                                                    width={90}
                                                    height={90}
                                                    className="rounded-full object-cover border shadow-sm"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="text-sm w-[220px]"
                                                    />
                                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>

                                            {/* Formulario */}
                                            <div className="space-y-4 mt-4">
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    {["nombre", "apellido", "telefono", "direccion", "genero", "fecha_nac", "nacionalidad"].map(
                                                        (field) => (
                                                            <div key={field} className="space-y-1">
                                                                <Label htmlFor={field} className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                    {field.replace("_", " ")}
                                                                </Label>
                                                                <Input
                                                                    id={field}
                                                                    type={field === "fecha_nac" ? "date" : "text"}
                                                                    value={(formData as any)[field]}
                                                                    onChange={handleChange}
                                                                    className="h-9 text-sm"
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor="biografia" className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Biografía
                                                    </Label>
                                                    <Textarea
                                                        id="biografia"
                                                        value={formData.biografia}
                                                        onChange={handleChange}
                                                        className="min-h-[80px] text-sm"
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-2 pt-3">
                                                    <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                                                        Cancelar
                                                    </Button>
                                                    <Button onClick={handleSave} disabled={loading} size="sm">
                                                        {loading ? "Guardando..." : <><Save className="h-4 w-4 mr-1" /> Guardar</>}
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>

                                    </Dialog>

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

                    {/* =======================
               INFORMACIÓN PERSONAL
          ======================= */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información personal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Info label="Nombre" value={formData.nombre} icon={User} />
                                <Info label="Apellido" value={formData.apellido} icon={UserCircle} />
                                <Info label="Teléfono" value={formData.telefono} icon={Phone} />
                                <Info label="Dirección" value={formData.direccion} icon={MapPin} />
                                <Info label="Género" value={formData.genero} icon={Heart} />
                                <Info
                                    label="Fecha de nacimiento"
                                    value={
                                        formData.fecha_nac
                                            ? new Date(formData.fecha_nac).toLocaleDateString()
                                            : "—"
                                    }
                                    icon={CalendarDays}
                                />
                                <Info label="Nacionalidad" value={formData.nacionalidad} icon={Globe} />
                                <Info label="Rol" value={"Cliente"} icon={UserCircle} />
                            </div>

                            <div className="space-y-2">
                                <Label>Biografía</Label>
                                <div className="flex items-start gap-2 bg-muted rounded-md p-3 text-sm">
                                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <p>{formData.biografia || "—"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* =======================
               ACCIONES RÁPIDAS
          ======================= */}
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 text-sm">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{value || "—"}</span>
            </div>
        </div>
    )
}
