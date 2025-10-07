export interface Book {
  id: number
  title: string
  author: string
  description: string
  category: string
  cover: string
  rating: number
  pages: number
  language: string
  isbn: string
  publishYear: number
  stock: number
  available: boolean
  reviews: Review[]
}

export interface Review {
  id: number
  userId: number
  userName: string
  rating: number
  comment: string
  date: string
}

export interface User {
  id: number
  name: string
  email: string
  password: string
  avatar: string
  address: string
  phone: string
  memberSince: string
  booksRead: number
  reservationsCount: number
  reviewsCount: number
}

export interface Reservation {
  id: number
  userId: number
  bookId: number
  status: "active" | "ready" | "completed" | "cancelled"
  reservationDate: string
  pickupDate?: string
  expiryDate: string
}

export interface Favorite {
  id: number
  userId: number
  bookId: number
  addedDate: string
}

export const mockBooks: Book[] = [
  {
    id: 1,
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    description:
      "Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo. Una exploración profunda de la soledad, el amor, la guerra y el destino.",
    category: "Ficción",
    cover: "/cien-a-os-de-soledad-book-cover.jpg",
    rating: 4.8,
    pages: 417,
    language: "Español",
    isbn: "978-0307474728",
    publishYear: 1967,
    stock: 5,
    available: true,
    reviews: [
      {
        id: 1,
        userId: 1,
        userName: "María González",
        rating: 5,
        comment: "Una obra maestra absoluta. La narrativa de García Márquez es hipnotizante.",
        date: "2024-01-15",
      },
      {
        id: 2,
        userId: 2,
        userName: "Carlos Ruiz",
        rating: 5,
        comment: "Increíble viaje literario. Cada página es una joya.",
        date: "2024-01-20",
      },
    ],
  },
  {
    id: 2,
    title: "El nombre del viento",
    author: "Patrick Rothfuss",
    description:
      "La historia de Kvothe, un legendario héroe caído en desgracia que narra su propia historia. Una épica fantasía llena de magia, música y misterio que ha cautivado a millones de lectores.",
    category: "Fantasía",
    cover: "/el-nombre-del-viento-book-cover.jpg",
    rating: 4.9,
    pages: 662,
    language: "Español",
    isbn: "978-8401352836",
    publishYear: 2007,
    stock: 3,
    available: true,
    reviews: [
      {
        id: 3,
        userId: 3,
        userName: "Ana Martínez",
        rating: 5,
        comment: "La mejor fantasía que he leído en años. Rothfuss es un genio.",
        date: "2024-02-01",
      },
    ],
  },
  {
    id: 3,
    title: "Sapiens: De animales a dioses",
    author: "Yuval Noah Harari",
    description:
      "Una breve historia de la humanidad que explora cómo el Homo sapiens llegó a dominar el mundo. Harari examina la revolución cognitiva, agrícola y científica con una perspectiva única.",
    category: "Historia",
    cover: "/sapiens-book-cover.png",
    rating: 4.7,
    pages: 498,
    language: "Español",
    isbn: "978-8499926223",
    publishYear: 2011,
    stock: 0,
    available: false,
    reviews: [
      {
        id: 4,
        userId: 1,
        userName: "María González",
        rating: 5,
        comment: "Fascinante y revelador. Cambia tu perspectiva sobre la humanidad.",
        date: "2024-01-25",
      },
    ],
  },
  {
    id: 4,
    title: "1984",
    author: "George Orwell",
    description:
      "Una distopía clásica que presenta un futuro totalitario donde el Gran Hermano lo vigila todo. Una advertencia atemporal sobre el poder, la vigilancia y la manipulación de la verdad.",
    category: "Ficción",
    cover: "/1984-book-cover.png",
    rating: 4.6,
    pages: 328,
    language: "Español",
    isbn: "978-8499890944",
    publishYear: 1949,
    stock: 7,
    available: true,
    reviews: [
      {
        id: 5,
        userId: 2,
        userName: "Carlos Ruiz",
        rating: 5,
        comment: "Más relevante que nunca. Una lectura obligatoria.",
        date: "2024-02-05",
      },
    ],
  },
  {
    id: 5,
    title: "El Hobbit",
    author: "J.R.R. Tolkien",
    description:
      "La aventura de Bilbo Bolsón, un hobbit que se embarca en una épica búsqueda del tesoro con un grupo de enanos. El preludio perfecto a El Señor de los Anillos.",
    category: "Fantasía",
    cover: "/el-hobbit-book-cover.jpg",
    rating: 4.8,
    pages: 310,
    language: "Español",
    isbn: "978-8445077528",
    publishYear: 1937,
    stock: 4,
    available: true,
    reviews: [],
  },
  {
    id: 6,
    title: "Dune",
    author: "Frank Herbert",
    description:
      "Una épica de ciencia ficción ambientada en el desértico planeta Arrakis, donde la especia melange es el recurso más valioso del universo. Política, religión y ecología se entrelazan magistralmente.",
    category: "Ciencia Ficción",
    cover: "/dune-book-cover.png",
    rating: 4.7,
    pages: 604,
    language: "Español",
    isbn: "978-8497593762",
    publishYear: 1965,
    stock: 2,
    available: true,
    reviews: [],
  },
  {
    id: 7,
    title: "El código Da Vinci",
    author: "Dan Brown",
    description:
      "Un thriller de misterio que sigue al profesor Robert Langdon mientras investiga un asesinato en el Louvre. Una trama llena de símbolos, conspiraciones y secretos históricos.",
    category: "Misterio",
    cover: "/el-codigo-da-vinci-book-cover.jpg",
    rating: 4.3,
    pages: 489,
    language: "Español",
    isbn: "978-8408163268",
    publishYear: 2003,
    stock: 6,
    available: true,
    reviews: [],
  },
  {
    id: 8,
    title: "Orgullo y prejuicio",
    author: "Jane Austen",
    description:
      "Una novela romántica clásica que explora temas de amor, clase social y moralidad en la Inglaterra del siglo XIX. La historia de Elizabeth Bennet y Mr. Darcy es atemporal.",
    category: "Romance",
    cover: "/orgullo-y-prejuicio-book-cover.jpg",
    rating: 4.6,
    pages: 432,
    language: "Español",
    isbn: "978-8491050407",
    publishYear: 1813,
    stock: 5,
    available: true,
    reviews: [],
  },
  {
    id: 9,
    title: "El principito",
    author: "Antoine de Saint-Exupéry",
    description:
      "Una fábula poética sobre un pequeño príncipe que viaja de planeta en planeta. Una reflexión profunda sobre la amistad, el amor y el sentido de la vida.",
    category: "Ficción",
    cover: "/el-principito-book-cover.jpg",
    rating: 4.9,
    pages: 96,
    language: "Español",
    isbn: "978-8478887194",
    publishYear: 1943,
    stock: 8,
    available: true,
    reviews: [],
  },
  {
    id: 10,
    title: "Harry Potter y la piedra filosofal",
    author: "J.K. Rowling",
    description:
      "El inicio de la saga mágica más famosa del mundo. Harry descubre que es un mago y comienza su educación en Hogwarts, donde le esperan aventuras extraordinarias.",
    category: "Fantasía",
    cover: "/harry-potter-piedra-filosofal-book-cover.jpg",
    rating: 4.8,
    pages: 254,
    language: "Español",
    isbn: "978-8498383447",
    publishYear: 1997,
    stock: 10,
    available: true,
    reviews: [],
  },
  {
    id: 11,
    title: "Crónica de una muerte anunciada",
    author: "Gabriel García Márquez",
    description:
      "Una novela corta que reconstruye el asesinato de Santiago Nasar. García Márquez explora temas de honor, destino y la naturaleza de la verdad.",
    category: "Ficción",
    cover: "/cronica-muerte-anunciada-book-cover.jpg",
    rating: 4.5,
    pages: 120,
    language: "Español",
    isbn: "978-8497592437",
    publishYear: 1981,
    stock: 3,
    available: true,
    reviews: [],
  },
  {
    id: 12,
    title: "La sombra del viento",
    author: "Carlos Ruiz Zafón",
    description:
      "Un joven descubre un libro misterioso en el Cementerio de los Libros Olvidados de Barcelona. Una historia gótica de amor, misterio y libros que te atrapará desde la primera página.",
    category: "Misterio",
    cover: "/la-sombra-del-viento-book-cover.jpg",
    rating: 4.7,
    pages: 565,
    language: "Español",
    isbn: "978-8408163275",
    publishYear: 2001,
    stock: 4,
    available: true,
    reviews: [],
  },
  {
    id: 13,
    title: "El alquimista",
    author: "Paulo Coelho",
    description:
      "La historia de Santiago, un pastor andaluz que viaja desde España hasta Egipto en busca de un tesoro. Una fábula sobre seguir tus sueños y escuchar tu corazón.",
    category: "Ficción",
    cover: "/el-alquimista-book-cover.jpg",
    rating: 4.4,
    pages: 192,
    language: "Español",
    isbn: "978-8408043638",
    publishYear: 1988,
    stock: 6,
    available: true,
    reviews: [],
  },
  {
    id: 14,
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    description:
      "Una distopía donde los libros están prohibidos y los bomberos los queman. Guy Montag, un bombero, comienza a cuestionar su papel en esta sociedad.",
    category: "Ciencia Ficción",
    cover: "/fahrenheit-451-cover.png",
    rating: 4.6,
    pages: 249,
    language: "Español",
    isbn: "978-8497593069",
    publishYear: 1953,
    stock: 5,
    available: true,
    reviews: [],
  },
  {
    id: 15,
    title: "Los pilares de la Tierra",
    author: "Ken Follett",
    description:
      "Una épica novela histórica ambientada en la Inglaterra del siglo XII. La construcción de una catedral sirve como telón de fondo para una historia de ambición, amor y traición.",
    category: "Historia",
    cover: "/los-pilares-de-la-tierra-book-cover.jpg",
    rating: 4.8,
    pages: 1008,
    language: "Español",
    isbn: "978-8497593663",
    publishYear: 1989,
    stock: 2,
    available: true,
    reviews: [],
  },
  {
    id: 16,
    title: "El señor de los anillos: La comunidad del anillo",
    author: "J.R.R. Tolkien",
    description:
      "El inicio de la épica trilogía. Frodo Bolsón hereda un anillo mágico y debe emprender un peligroso viaje para destruirlo en Mordor.",
    category: "Fantasía",
    cover: "/comunidad-del-anillo-book-cover.jpg",
    rating: 4.9,
    pages: 576,
    language: "Español",
    isbn: "978-8445077535",
    publishYear: 1954,
    stock: 0,
    available: false,
    reviews: [],
  },
  {
    id: 17,
    title: "Matar a un ruiseñor",
    author: "Harper Lee",
    description:
      "Una novela sobre la injusticia racial en el sur de Estados Unidos durante la Gran Depresión. Narrada por Scout Finch, es una historia conmovedora sobre la moralidad y la empatía.",
    category: "Ficción",
    cover: "/matar-ruisenor-book-cover.jpg",
    rating: 4.7,
    pages: 376,
    language: "Español",
    isbn: "978-8490628614",
    publishYear: 1960,
    stock: 4,
    available: true,
    reviews: [],
  },
  {
    id: 18,
    title: "El arte de la guerra",
    author: "Sun Tzu",
    description:
      "Un tratado militar chino antiguo que ofrece estrategias y tácticas de guerra. Sus enseñanzas se aplican hoy en día a los negocios, el deporte y la vida cotidiana.",
    category: "Filosofía",
    cover: "/el-arte-de-la-guerra-book-cover.jpg",
    rating: 4.5,
    pages: 112,
    language: "Español",
    isbn: "978-8441421196",
    publishYear: -500,
    stock: 7,
    available: true,
    reviews: [],
  },
  {
    id: 19,
    title: "Breve historia del tiempo",
    author: "Stephen Hawking",
    description:
      "Una exploración accesible de los conceptos más complejos del universo: el Big Bang, los agujeros negros y la naturaleza del tiempo. Ciencia fascinante para todos.",
    category: "Ciencia",
    cover: "/breve-historia-del-tiempo-book-cover.jpg",
    rating: 4.6,
    pages: 256,
    language: "Español",
    isbn: "978-8498929089",
    publishYear: 1988,
    stock: 3,
    available: true,
    reviews: [],
  },
  {
    id: 20,
    title: "El retrato de Dorian Gray",
    author: "Oscar Wilde",
    description:
      "Una novela filosófica sobre un joven cuyo retrato envejece mientras él permanece joven. Una exploración de la vanidad, la moralidad y las consecuencias de una vida hedonista.",
    category: "Ficción",
    cover: "/dorian-gray-book-cover.jpg",
    rating: 4.5,
    pages: 254,
    language: "Español",
    isbn: "978-8491050414",
    publishYear: 1890,
    stock: 5,
    available: true,
    reviews: [],
  },
]

export const mockUsers: User[] = [
  {
    id: 1,
    name: "María González",
    email: "maria@example.com",
    password: "password123",
    avatar: "/diverse-woman-avatar.png",
    address: "Calle Mayor 15, Madrid",
    phone: "+34 600 123 456",
    memberSince: "2023-01-15",
    booksRead: 45,
    reservationsCount: 12,
    reviewsCount: 8,
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    password: "password123",
    avatar: "/man-avatar.png",
    address: "Avenida Diagonal 234, Barcelona",
    phone: "+34 610 234 567",
    memberSince: "2023-03-20",
    booksRead: 32,
    reservationsCount: 8,
    reviewsCount: 5,
  },
  {
    id: 3,
    name: "Ana Martínez",
    email: "ana@example.com",
    password: "password123",
    avatar: "/woman-avatar-2.png",
    address: "Plaza España 8, Valencia",
    phone: "+34 620 345 678",
    memberSince: "2023-06-10",
    booksRead: 28,
    reservationsCount: 6,
    reviewsCount: 4,
  },
  {
    id: 4,
    name: "David López",
    email: "david@example.com",
    password: "password123",
    avatar: "/man-avatar-2.png",
    address: "Calle Alcalá 50, Madrid",
    phone: "+34 630 456 789",
    memberSince: "2023-08-05",
    booksRead: 19,
    reservationsCount: 4,
    reviewsCount: 2,
  },
  {
    id: 5,
    name: "Laura Sánchez",
    email: "laura@example.com",
    password: "password123",
    avatar: "/woman-avatar-3.png",
    address: "Gran Vía 120, Sevilla",
    phone: "+34 640 567 890",
    memberSince: "2023-09-12",
    booksRead: 15,
    reservationsCount: 3,
    reviewsCount: 1,
  },
]

export const mockReservations: Reservation[] = [
  {
    id: 1,
    userId: 1,
    bookId: 1,
    status: "ready",
    reservationDate: "2024-02-01",
    expiryDate: "2024-02-15",
  },
  {
    id: 2,
    userId: 1,
    bookId: 5,
    status: "active",
    reservationDate: "2024-02-10",
    expiryDate: "2024-02-24",
  },
  {
    id: 3,
    userId: 2,
    bookId: 2,
    status: "active",
    reservationDate: "2024-02-08",
    expiryDate: "2024-02-22",
  },
  {
    id: 4,
    userId: 2,
    bookId: 4,
    status: "completed",
    reservationDate: "2024-01-15",
    pickupDate: "2024-01-18",
    expiryDate: "2024-01-29",
  },
  {
    id: 5,
    userId: 3,
    bookId: 7,
    status: "active",
    reservationDate: "2024-02-12",
    expiryDate: "2024-02-26",
  },
]

export const mockFavorites: Favorite[] = [
  { id: 1, userId: 1, bookId: 1, addedDate: "2023-12-01" },
  { id: 2, userId: 1, bookId: 2, addedDate: "2023-12-15" },
  { id: 3, userId: 1, bookId: 5, addedDate: "2024-01-05" },
  { id: 4, userId: 2, bookId: 4, addedDate: "2023-11-20" },
  { id: 5, userId: 2, bookId: 6, addedDate: "2024-01-10" },
  { id: 6, userId: 3, bookId: 2, addedDate: "2024-01-20" },
  { id: 7, userId: 3, bookId: 9, addedDate: "2024-02-01" },
]

// Helper functions
export function getBookById(id: number): Book | undefined {
  return mockBooks.find((book) => book.id === id)
}

export function getUserById(id: number): User | undefined {
  return mockUsers.find((user) => user.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email)
}

export function getReservationsByUserId(userId: number): Reservation[] {
  return mockReservations.filter((res) => res.userId === userId)
}

export function getFavoritesByUserId(userId: number): Favorite[] {
  return mockFavorites.filter((fav) => fav.userId === userId)
}

export function getBooksByCategory(category: string): Book[] {
  return mockBooks.filter((book) => book.category.toLowerCase() === category.toLowerCase())
}

export function searchBooks(query: string): Book[] {
  const lowerQuery = query.toLowerCase()
  return mockBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.description.toLowerCase().includes(lowerQuery),
  )
}

export const categories = [
  "Ficción",
  "Fantasía",
  "Historia",
  "Ciencia Ficción",
  "Misterio",
  "Romance",
  "Filosofía",
  "Ciencia",
]
