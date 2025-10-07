import Link from "next/link"
import { BookOpen, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                Biblioverso
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu universo de libros. Explora, reserva y disfruta de miles de títulos.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/reservas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mis Reservas
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/catalogo?categoria=ficcion"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ficción
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?categoria=fantasia"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fantasía
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?categoria=historia"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Historia
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?categoria=tecnologia"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tecnología
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@biblioverso.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+34 900 123 456</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Madrid, España</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Biblioverso. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
