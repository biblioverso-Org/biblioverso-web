import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 🔹 Crear una reserva o lista de espera
export async function POST(req: Request) {
    try {
        const { id_usuario, id_libro } = await req.json()

        if (!id_usuario || !id_libro)
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

        // Buscar disponibilidad
        const stock = await prisma.stock.findFirst({
            where: { id_libro: BigInt(id_libro) },
        })

        const disponible = stock?.disponibilidad ?? false

        const reserva = await prisma.reserva.create({
            data: {
                id_usuario,
                id_libro: BigInt(id_libro),
                estado: disponible ? "pendiente" : "espera",
                cantidad: 1,
            },
        })

        return NextResponse.json({
            ...reserva,
            id_reserva: Number(reserva.id_reserva),
            id_libro: Number(reserva.id_libro),
        })
    } catch (error) {
        console.error("Error al crear reserva:", error)
        return NextResponse.json({ error: "Error al crear la reserva" }, { status: 500 })
    }
}

// (Opcional) 🔹 GET para dashboard o historial
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id_usuario = Number(searchParams.get("id_usuario"))

        if (!id_usuario)
            return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })

        const reservas = await prisma.reserva.findMany({
            where: { id_usuario },
            include: { libro: true },
            orderBy: { fecha_reserva: "desc" },
        })

        const safe = reservas.map((r) => ({
            ...r,
            id_reserva: Number(r.id_reserva),
            id_libro: Number(r.id_libro),
        }))

        return NextResponse.json(safe)
    } catch (error) {
        console.error("Error al obtener reservas:", error)
        return NextResponse.json({ error: "Error al obtener reservas" }, { status: 500 })
    }
}
