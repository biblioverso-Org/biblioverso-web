// app/api/categorias/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
    try {
        // 🔹 Obtenemos las categorías y contamos los libros relacionados
        const categorias = await prisma.categoria.findMany({
            include: {
                _count: { select: { libros: true } },
            },
        })

        // 🔹 Formato limpio para frontend
        const data = categorias.map((cat) => ({
            id: cat.id_categoria,
            nombre: cat.nombre,
            count: cat._count.libros,
        }))

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error al obtener categorías:", error)
        return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
