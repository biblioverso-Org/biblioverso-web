import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ✅ Ahora se usa `context.params` como Promise y se hace await
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const id_libro = Number(id)

        if (isNaN(id_libro)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 })
        }

        const libro = await prisma.libro.findUnique({
            where: { id_libro },
            include: {
                categoria: true,
                libro_autor: { include: { autor: true } },
                stock: true,
                opiniones: {
                    include: {
                        usuario: {
                            select: { id_usuario: true, nombre: true, apellido: true },
                        },
                    },
                    orderBy: { fecha_creacion: "desc" },
                },
            },
        })

        if (!libro) {
            return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
        }

        // 🔹 Calcular stock disponible
        const totalStock = libro.stock?.filter((s) => s.disponibilidad).length ?? 0
        const disponible = totalStock > 0

        // 🔹 Promedio de calificaciones
        const promedio =
            libro.opiniones.length > 0
                ? libro.opiniones.reduce((acc, op) => acc + (op.calificacion || 0), 0) /
                libro.opiniones.length
                : 0

        const data = {
            id: Number(libro.id_libro),
            titulo: libro.titulo ?? "Sin título",
            sinopsis: libro.sinopsis ?? "Sin descripción disponible.",
            portada: libro.portada ?? null,
            editorial: libro.editorial ?? "Desconocida",
            fecha_publicacion: libro.fecha_publicacion,
            categoria: libro.categoria?.nombre ?? "Sin categoría",
            autores:
                libro.libro_autor?.map((a) => a.autor?.nombre ?? "Autor desconocido") ??
                [],
            disponible,
            stock: totalStock,
            rating: promedio.toFixed(1),
            opiniones:
                libro.opiniones?.map((o) => ({
                    id: o.id_opinion,
                    comentario: o.comentario ?? "",
                    calificacion: o.calificacion ?? 0,
                    fecha: o.fecha_creacion,
                    usuario: o.usuario
                        ? `${o.usuario.nombre} ${o.usuario.apellido}`
                        : "Usuario anónimo",
                })) ?? [],
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error al obtener libro:", error)
        return NextResponse.json(
            { error: "Error al obtener libro" },
            { status: 500 }
        )
    }
}
