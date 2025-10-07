"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on home page
  if (pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return { label, href }
    }),
  ]

  return (
    <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index === 0 && <Home className="h-4 w-4" />}
              {isLast ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-foreground transition-colors hover:underline">
                    {item.label}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
