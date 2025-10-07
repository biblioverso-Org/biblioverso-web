"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Star, TrendingUp, Sparkles, ArrowRight, Users, BookMarked, Award, Quote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function HomePage() {
  const featuredBooks = [
    {
      id: 1,
      title: "Cien años de soledad",
      author: "Gabriel García Márquez",
      cover: "/cien-a-os-de-soledad-book-cover.jpg",
      rating: 4.8,
      category: "Ficción",
      available: true,
    },
    {
      id: 2,
      title: "El nombre del viento",
      author: "Patrick Rothfuss",
      cover: "/el-nombre-del-viento-book-cover.jpg",
      rating: 4.9,
      category: "Fantasía",
      available: true,
    },
    {
      id: 3,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      cover: "/sapiens-book-cover.png",
      rating: 4.7,
      category: "Historia",
      available: false,
    },
    {
      id: 4,
      title: "1984",
      author: "George Orwell",
      cover: "/1984-book-cover.png",
      rating: 4.6,
      category: "Ficción",
      available: true,
    },
  ]

  const categories = [
    { name: "Ficción", count: 245, icon: BookOpen, color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    { name: "Fantasía", count: 189, icon: Sparkles, color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
    { name: "Historia", count: 156, icon: TrendingUp, color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    { name: "Tecnología", count: 98, icon: Star, color: "bg-green-500/10 text-green-700 dark:text-green-400" },
  ]

  const testimonials = [
    {
      name: "María González",
      comment: "Una plataforma increíble. He descubierto libros maravillosos y el sistema de reservas es muy fácil.",
      rating: 5,
      role: "Lectora frecuente",
    },
    {
      name: "Carlos Ruiz",
      comment: "La mejor biblioteca digital que he usado. El catálogo es extenso y siempre encuentro lo que busco.",
      rating: 5,
      role: "Estudiante",
    },
    {
      name: "Ana Martínez",
      comment: "Me encanta poder reservar libros desde casa y recogerlos cuando me viene bien. Muy recomendable.",
      rating: 5,
      role: "Profesora",
    },
  ]

  const stats = [
    { icon: BookOpen, value: "10,000+", label: "Libros disponibles" },
    { icon: Users, value: "5,000+", label: "Lectores activos" },
    { icon: BookMarked, value: "25,000+", label: "Reservas realizadas" },
    { icon: Award, value: "4.9", label: "Valoración promedio" },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('/library-books-pattern.jpg')] opacity-5 bg-cover bg-center" />

        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />

        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="scale">
              <Badge className="mb-6 text-sm px-4 py-2 glass-effect" variant="secondary">
                <Sparkles className="w-3 h-3 mr-2 inline" />
                Más de 10,000 libros disponibles
              </Badge>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance leading-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Explora el universo de los libros
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-2xl mx-auto">
                Descubre, reserva y disfruta de miles de títulos. Tu próxima gran lectura te está esperando.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8 group shadow-lg hover:shadow-xl transition-all">
                  <Link href="/catalogo">
                    Explorar Catálogo
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg px-8 glass-effect hover:bg-primary/5 bg-transparent"
                >
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-foreground/40 rounded-full mt-2 animate-bounce-subtle" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <ScrollReveal key={stat.label} delay={index * 100} direction="scale">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3 transition-transform hover:scale-110">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Libros Destacados
              </h2>
              <p className="text-lg text-muted-foreground">Los más populares de este mes</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex group">
              <Link href="/catalogo">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredBooks.map((book, index) => (
            <ScrollReveal key={book.id} delay={index * 100} direction="up">
              <Link href={`/libro/${book.id}`} className="group block">
                <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-2 hover:border-primary/20 h-full">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <img
                      src={book.cover || "/placeholder.svg"}
                      alt={book.title}
                      className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                    {!book.available && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <Badge variant="secondary" className="glass-effect">
                          Sin stock
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="glass-effect backdrop-blur-md shadow-lg">{book.category}</Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{book.author}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{book.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">/ 5.0</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Explora por Categoría
              </h2>
              <p className="text-lg text-muted-foreground">Encuentra tu género favorito</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <ScrollReveal key={category.name} delay={index * 100} direction="scale">
                  <Link href={`/catalogo?categoria=${category.name.toLowerCase()}`}>
                    <Card className="transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-primary/20 group h-full">
                      <CardContent className="p-8">
                        <div
                          className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                        >
                          <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="font-semibold text-2xl mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground">{category.count} libros disponibles</p>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Lo que dicen nuestros lectores
            </h2>
            <p className="text-lg text-muted-foreground">Experiencias reales de nuestra comunidad</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 150} direction="up">
              <Card className="border-2 hover:border-primary/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group h-full">
                <CardContent className="p-8">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-amber-400 text-amber-400 transition-transform group-hover:scale-110"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-lg italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent">
        <div className="absolute inset-0 bg-[url('/library-books-pattern.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="container relative mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h2
                className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Comienza tu aventura literaria hoy
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 text-pretty leading-relaxed">
                Únete a miles de lectores que ya disfrutan de nuestra biblioteca digital
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-lg px-10 py-6 shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
              >
                <Link href="/login">Crear cuenta gratis</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
