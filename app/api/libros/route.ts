import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const q = searchParams.get("q")?.toLowerCase() || ""
        const categoria = searchParams.get("categoria") || ""
        const disponibilidad = searchParams.get("disponibilidad") || "all"
        const sort = searchParams.get("sort") || "title"

        let libros = await prisma.libro.findMany({
            where: {
                eliminado: false,
                ...(q && {
                    OR: [
                        { titulo: { contains: q, mode: "insensitive" } },
                        { sinopsis: { contains: q, mode: "insensitive" } },
                        { editorial: { contains: q, mode: "insensitive" } },
                    ],
                }),
                ...(categoria && {
                    categoria: { nombre: { equals: categoria, mode: "insensitive" } },
                }),
            },
            include: {
                categoria: { select: { nombre: true } },
                libro_autor: { include: { autor: { select: { nombre: true } } } },
                opiniones: { select: { calificacion: true } },
                stock: { select: { situacion: true } },
            },
        })

        const result = libros.map((libro) => {
            const promedio =
                libro.opiniones.length > 0
                    ? libro.opiniones.reduce((s, o) => s + (o.calificacion ?? 0), 0) /
                    libro.opiniones.length
                    : 0

            const disponible =
                libro.stock.length > 0 &&
                libro.stock.some((s) => s.situacion === "Disponible")

            return {
                id: Number(libro.id_libro),
                title: libro.titulo,
                author:
                    libro.libro_autor.map((a) => a.autor.nombre).join(", ") ||
                    "Autor desconocido",
                category: libro.categoria?.nombre ?? "Sin categoría",
                description: libro.sinopsis ?? "",
                cover: libro.portada,
                available: disponible,
                stock: libro.stock.length,
                rating: Number(promedio.toFixed(1)),
                publishYear: libro.fecha_publicacion
                    ? new Date(libro.fecha_publicacion).getFullYear()
                    : null,
            }
        })

        // Filtrado por disponibilidad
        let filtered = result
        if (disponibilidad === "available")
            filtered = filtered.filter((b) => b.available)
        else if (disponibilidad === "unavailable")
            filtered = filtered.filter((b) => !b.available)

        // Ordenamiento
        filtered.sort((a, b) => {
            if (sort === "title") return a.title.localeCompare(b.title)
            if (sort === "rating") return b.rating - a.rating
            if (sort === "year") return (b.publishYear ?? 0) - (a.publishYear ?? 0)
            return 0
        })

        return NextResponse.json(filtered)
    } catch (error) {
        console.error("❌ Error en /api/libros:", error)
        return NextResponse.json(
            { error: "Error al obtener libros" },
            { status: 500 },
        )
    }
}
