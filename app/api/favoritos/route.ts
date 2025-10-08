import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 🔹 Obtener favoritos del usuario
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id_usuario = Number(searchParams.get("id_usuario"))
        if (!id_usuario) {
            return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
        }

        const favoritos = await prisma.favoritos.findMany({
            where: { id_usuario },
            include: { libro: true },
        })

        const safe = favoritos.map((fav) => ({
            ...fav,
            id_favorito: Number(fav.id_favorito),
            id_libro: Number(fav.id_libro),
        }))

        return NextResponse.json(safe)
    } catch (error) {
        console.error("Error al obtener favoritos:", error)
        return NextResponse.json({ error: "Error al obtener favoritos" }, { status: 500 })
    }
}

// 🔹 Añadir o actualizar favorito
export async function POST(req: Request) {
    try {
        const { id_usuario, id_libro } = await req.json()
        if (!id_usuario || !id_libro)
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

        const fav = await prisma.favoritos.upsert({
            where: {
                id_usuario_id_libro: {
                    id_usuario,
                    id_libro: BigInt(id_libro),
                },
            },
            update: {},
            create: {
                id_usuario,
                id_libro: BigInt(id_libro),
            },
        })

        return NextResponse.json({
            ...fav,
            id_libro: Number(fav.id_libro),
            id_favorito: Number(fav.id_favorito),
        })
    } catch (error) {
        console.error("Error al guardar favorito:", error)
        return NextResponse.json({ error: "Error al guardar favorito" }, { status: 500 })
    }
}

// 🔹 Eliminar favorito
export async function DELETE(req: Request) {
    try {
        const { id_usuario, id_libro } = await req.json()
        if (!id_usuario || !id_libro)
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

        await prisma.favoritos.delete({
            where: {
                id_usuario_id_libro: {
                    id_usuario,
                    id_libro: BigInt(id_libro),
                },
            },
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("Error al eliminar favorito:", error)
        return NextResponse.json({ error: "Error al eliminar favorito" }, { status: 500 })
    }
}
