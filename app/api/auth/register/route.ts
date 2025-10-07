import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { nombre, apellido, email, password, telefono } = body

        // Validar datos mínimos
        if (!nombre || !email || !password) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
        }

        // Verificar si el correo ya existe
        const existingUser = await prisma.usuario.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 })
        }

        // Encriptar contraseña
        const hashedPassword = await hash(password, 10)

        // Crear usuario con rol fijo = 2 (cliente)
        const user = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                email,
                password: hashedPassword,
                telefono,
                id_rol: 2, // cliente
            },
            select: {
                id_usuario: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
            },
        })

        return NextResponse.json({ message: "Usuario creado correctamente", user }, { status: 201 })
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error)
        return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
    }
}
