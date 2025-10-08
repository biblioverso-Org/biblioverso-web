import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"

const prisma = new PrismaClient()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const data = await req.json()
    const userId = Number(session.user.id)
    try {
        let fotoUrl = data.fotoUrl || null

        if (data.foto && data.foto.startsWith("data:image")) {
            const uploaded = await cloudinary.uploader.upload(data.foto, {
                folder: "biblioverso/perfiles",
                public_id: `usuario_${userId}`,
                overwrite: true,
                transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
            })
            fotoUrl = uploaded.secure_url
        }

        const updated = await prisma.usuario.update({
            where: { id_usuario: userId },
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                telefono: data.telefono,
                direccion: data.direccion,
                genero: data.genero,
                fecha_nac: data.fecha_nac ? new Date(data.fecha_nac) : null,
                nacionalidad: data.nacionalidad,
                biografia: data.biografia,
                foto: fotoUrl ?? undefined,
            },
        })

        return NextResponse.json({ success: true, user: updated })
    } catch (error) {
        console.error("Error al actualizar usuario:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
