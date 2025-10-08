import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"


declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name: string
            email: string
            image?: string | null
            telefono?: string | null
            direccion?: string | null
            genero?: string | null
            fecha_nac?: string | null
            nacionalidad?: string | null
            biografia?: string | null
            rol?: string | null
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        telefono?: string | null
        direccion?: string | null
        genero?: string | null
        fecha_nac?: string | null
        nacionalidad?: string | null
        biografia?: string | null
        rol?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        name: string
        email: string
        image?: string | null
        telefono?: string | null
        direccion?: string | null
        genero?: string | null
        fecha_nac?: string | null
        nacionalidad?: string | null
        biografia?: string | null
        rol?: string | null
    }
}
