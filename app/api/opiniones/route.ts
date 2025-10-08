import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 🔹 Obtener todas las opiniones (solo para debug o dashboard)
export async function GET() {
    try {
        const opiniones = await prisma.opiniones.findMany({
            include: {
                usuario: { select: { nombre: true, apellido: true } },
                libro: { select: { titulo: true } },
            },
            orderBy: { fecha_creacion: "desc" },
        })

        // Evita error BigInt → JSON
        const safeOpiniones = opiniones.map((op) => ({
            ...op,
            id_opinion: Number(op.id_opinion),
            id_libro: Number(op.id_libro),
        }))

        return NextResponse.json(safeOpiniones)
    } catch (error) {
        console.error("Error al obtener opiniones:", error)
        return NextResponse.json({ error: "Error al obtener opiniones" }, { status: 500 })
    }
}

// 🔹 Crear nueva opinión
export async function POST(req: Request) {
    try {
        const { id_libro, id_usuario, comentario, calificacion } = await req.json()

        if (!id_libro || !id_usuario || !comentario || !calificacion) {
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
        }

        const opinion = await prisma.opiniones.create({
            data: {
                id_libro: BigInt(id_libro),
                id_usuario,
                comentario,
                calificacion,
            },
        })

        return NextResponse.json({
            ...opinion,
            id_opinion: Number(opinion.id_opinion),
            id_libro: Number(opinion.id_libro),
        })
    } catch (error) {
        console.error("Error al crear opinión:", error)
        return NextResponse.json({ error: "Error al crear la opinión" }, { status: 500 })
    }
}
