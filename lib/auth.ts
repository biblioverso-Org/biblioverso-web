import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcrypt"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Correo electrónico", type: "text" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciales incompletas")
                }

                const user = await prisma.usuario.findUnique({
                    where: { email: credentials.email },
                })

                if (!user) throw new Error("Usuario no encontrado")

                const isValid = await compare(credentials.password, user.password)
                if (!isValid) throw new Error("Contraseña incorrecta")

                return {
                    id: String(user.id_usuario),
                    name: `${user.nombre} ${user.apellido || ""}`.trim(),
                    email: user.email,
                    image: user.foto ?? null,
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
