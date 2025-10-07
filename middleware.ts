import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login", // Redirige al login si no hay sesión
    },
})

// Protege estas rutas
export const config = {
    matcher: ["/perfil/:path*", "/reservas/:path*", "/favoritos/:path*"],
}
