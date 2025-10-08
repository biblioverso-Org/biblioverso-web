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

            // 🔐 Autenticación con Prisma y bcrypt
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciales incompletas")
                }

                const user = await prisma.usuario.findUnique({
                    where: { email: credentials.email },
                    include: {
                        rol: true, // opcional, si tienes una tabla `rol` relacionada
                    },
                })

                if (!user) throw new Error("Usuario no encontrado")

                const isValid = await compare(credentials.password, user.password)
                if (!isValid) throw new Error("Contraseña incorrecta")

                return {
                    id: String(user.id_usuario),
                    name: `${user.nombre} ${user.apellido || ""}`.trim(),
                    email: user.email,
                    image: user.foto ?? null,
                    telefono: user.telefono ?? null,
                    direccion: user.direccion ?? null,
                    genero: user.genero ?? null,
                    fecha_nac: user.fecha_nac ? user.fecha_nac.toISOString() : null,
                    nacionalidad: user.nacionalidad ?? null,
                    biografia: user.biografia ?? null,
                    rol: user.rol?.nombre ?? "Cliente",
                }
            },
        }),
    ],

    // 🧠 JWT personalizado para guardar los datos del usuario
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = <string>user.name
                token.email = <string>user.email
                token.image = user.image
                token.telefono = (user as any).telefono
                token.direccion = (user as any).direccion
                token.genero = (user as any).genero
                token.fecha_nac = (user as any).fecha_nac
                token.nacionalidad = (user as any).nacionalidad
                token.biografia = (user as any).biografia
                token.rol = (user as any).rol
            }
            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image
                session.user.telefono = token.telefono as string | null
                session.user.direccion = token.direccion as string | null
                session.user.genero = token.genero as string | null
                session.user.fecha_nac = token.fecha_nac as string | null
                session.user.nacionalidad = token.nacionalidad as string | null
                session.user.biografia = token.biografia as string | null
                session.user.rol = token.rol as string | null
            }
            return session
        },
    },

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
}
