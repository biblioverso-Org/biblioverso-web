import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 🔹 Obtener notificaciones del usuario
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id_usuario = Number(searchParams.get("id_usuario"))
        if (!id_usuario)
            return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })

        const notificaciones = await prisma.notificacion.findMany({
            where: { id_usuario },
            orderBy: { fecha: "desc" },
        })

        const safe = notificaciones.map((n) => ({
            ...n,
            id_notificacion: Number(n.id_notificacion),
        }))

        return NextResponse.json(safe)
    } catch (error) {
        console.error("Error al obtener notificaciones:", error)
        return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

// 🔹 Marcar como leída
export async function PATCH(req: Request) {
    try {
        const { id_notificacion, leida } = await req.json()

        if (!id_notificacion)
            return NextResponse.json({ error: "ID requerido" }, { status: 400 })

        const updated = await prisma.notificacion.update({
            where: { id_notificacion: BigInt(id_notificacion) },
            data: { leida: Boolean(leida) },
        })

        return NextResponse.json({
            ...updated,
            id_notificacion: Number(updated.id_notificacion),
        })
    } catch (error) {
        console.error("Error al marcar notificación:", error)
        return NextResponse.json({ error: "Error al marcar notificación" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
