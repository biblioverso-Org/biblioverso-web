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
            include: {
                libro: {
                    include: {
                        categoria: { select: { nombre: true } },
                        libro_autor: { include: { autor: { select: { nombre: true } } } },
                        stock: { select: { disponibilidad: true } },
                        opiniones: { select: { calificacion: true } },
                    },
                },
            },
            orderBy: { fecha_agregado: "desc" },
        })

        const data = favoritos.map((fav) => {
            const libro = fav.libro
            const availableStock = libro.stock.filter((s) => s.disponibilidad).length
            const totalStock = libro.stock.length
            const disponible = availableStock > 0

            const rating =
                libro.opiniones.length > 0
                    ? libro.opiniones.reduce((acc, op) => acc + (op.calificacion ?? 0), 0) /
                    libro.opiniones.length
                    : 0

            return {
                id_favorito: Number(fav.id_favorito),
                id_libro: Number(fav.id_libro),
                fecha_agregado: fav.fecha_agregado,
                libro: {
                    id: Number(libro.id_libro),
                    titulo: libro.titulo,
                    portada: libro.portada,
                    sinopsis: libro.sinopsis,
                    editorial: libro.editorial,
                    categoria: libro.categoria?.nombre ?? "Sin categoría",
                    autores:
                        libro.libro_autor.map((a) => a.autor.nombre).join(", ") ||
                        "Autor desconocido",
                    disponible,
                    availableStock,
                    totalStock,
                    rating: Number(rating.toFixed(1)),
                },
            }
        })

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error al obtener favoritos:", error)
        return NextResponse.json({ error: "Error al obtener favoritos" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(req: Request) {
    try {
        const { id_usuario, id_libro } = await req.json()
        if (!id_usuario || !id_libro)
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

        const fav = await prisma.favoritos.upsert({
            where: {
                id_usuario_id_libro: {
                    id_usuario: Number(id_usuario), // ✅ Conversión explícita
                    id_libro: BigInt(id_libro),
                },
            },
            update: {},
            create: {
                id_usuario: Number(id_usuario), // ✅ Conversión explícita
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
    } finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(req: Request) {
    try {
        const { id_usuario, id_libro } = await req.json()
        if (!id_usuario || !id_libro)
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

        await prisma.favoritos.delete({
            where: {
                id_usuario_id_libro: {
                    id_usuario: Number(id_usuario), // ✅ Conversión aquí también
                    id_libro: BigInt(id_libro),
                },
            },
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("Error al eliminar favorito:", error)
        return NextResponse.json({ error: "Error al eliminar favorito" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
