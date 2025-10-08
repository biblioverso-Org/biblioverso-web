
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
    try {
        const libros = await prisma.libro.findMany({
            where: { eliminado: false },
            include: {
                categoria: { select: { nombre: true } },
                libro_autor: { include: { autor: { select: { nombre: true } } } },
                opiniones: { select: { calificacion: true } },
                stock: { select: { situacion: true } },
            },
            orderBy: { fecha_creacion: "desc" },
            take: 4,
        })

        const result = libros.map((libro) => {
            const promedio =
                libro.opiniones.length > 0
                    ? libro.opiniones.reduce((s, o) => s + (o.calificacion ?? 0), 0) /
                    libro.opiniones.length
                    : null

            const disponible =
                libro.stock.length > 0 &&
                libro.stock.some((s) => s.situacion === "Disponible")

            return {
                id: Number(libro.id_libro), // 👈 conversión clave
                titulo: libro.titulo,
                portada: libro.portada,
                categoria: libro.categoria?.nombre ?? "Sin categoría",
                autor:
                    libro.libro_autor.map((a) => a.autor.nombre).join(", ") ||
                    "Autor desconocido",
                rating: promedio ? promedio.toFixed(1) : null,
                disponible,
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error("❌ Error en /api/libros/destacados:", error)
        return NextResponse.json(
            { error: "Error al obtener libros destacados desde la BD" },
            { status: 500 }
        )
    }
}
