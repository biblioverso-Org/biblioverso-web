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

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id_usuario = Number(searchParams.get("id_usuario"))

        if (!id_usuario)
            return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })

        const reservas = await prisma.reserva.findMany({
            where: { id_usuario },
            include: {
                libro: {
                    include: {
                        categoria: { select: { nombre: true } },
                        libro_autor: {
                            include: {
                                autor: { select: { nombre: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { fecha_reserva: "desc" },
        })

        // 🔧 Serializar BigInt a Number
        const safe = reservas.map((r) => ({
            id_reserva: Number(r.id_reserva),
            id_libro: Number(r.id_libro),
            id_usuario: r.id_usuario,
            estado: r.estado,
            cantidad: r.cantidad,
            fecha_reserva: r.fecha_reserva,
            libro: {
                id_libro: Number(r.libro.id_libro),
                titulo: r.libro.titulo,
                portada: r.libro.portada,
                sinopsis: r.libro.sinopsis,
                editorial: r.libro.editorial,
                categoria: r.libro.categoria?.nombre ?? "Sin categoría",
                autores:
                    r.libro.libro_autor?.map((a) => a.autor.nombre).join(", ") ??
                    "Autor desconocido",
            },
        }))

        return NextResponse.json(safe)
    } catch (error) {
        console.error("Error al obtener reservas:", error)
        return NextResponse.json({ error: "Error al obtener reservas" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}