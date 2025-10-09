import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// PATCH /api/reservas/[id]
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const { estado } = await req.json()

    try {
        const updated = await prisma.reserva.update({
            where: { id_reserva: BigInt(id) },
            data: { estado },
        })
        return NextResponse.json({ ok: true, updated })
    } catch (error) {
        console.error("Error al actualizar reserva:", error)
        return NextResponse.json({ error: "Error al actualizar reserva" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
