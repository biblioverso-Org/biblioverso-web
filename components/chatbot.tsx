"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy el asistente virtual de Biblioverso. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue)
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const getBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("reserva") || lowerQuery.includes("reservar")) {
      return "Para reservar un libro, busca el libro que te interesa en nuestro catálogo y haz clic en 'Reservar'. Podrás recogerlo en la biblioteca en 2-3 días hábiles."
    }
    if (lowerQuery.includes("horario") || lowerQuery.includes("hora")) {
      return "Nuestro horario de atención es de lunes a viernes de 9:00 a 20:00 y sábados de 10:00 a 14:00."
    }
    if (lowerQuery.includes("cuenta") || lowerQuery.includes("registro")) {
      return "Puedes crear una cuenta haciendo clic en 'Iniciar Sesión' y luego en 'Registrarse'. Solo necesitas tu email y una contraseña."
    }
    if (lowerQuery.includes("disponible") || lowerQuery.includes("stock")) {
      return "Puedes ver la disponibilidad de cada libro en su página de detalles. Si un libro no está disponible, puedes unirte a la lista de espera."
    }
    if (lowerQuery.includes("categoría") || lowerQuery.includes("género")) {
      return "Tenemos libros de Ficción, Fantasía, Historia, Ciencia Ficción, Misterio, Romance, Filosofía y Ciencia. Usa los filtros en el catálogo para explorar."
    }

    return "Gracias por tu pregunta. Para más información específica, te recomiendo explorar nuestro catálogo o contactar con nuestro equipo. ¿Hay algo más en lo que pueda ayudarte?"
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-background border rounded-lg shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Asistente Biblioverso</h3>
              <p className="text-xs opacity-90">Siempre disponible para ayudarte</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback
                    className={message.sender === "bot" ? "bg-primary text-primary-foreground" : "bg-muted"}
                  >
                    {message.sender === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex-1 rounded-lg p-3 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "opacity-80" : "text-muted-foreground"}`}>
                    {message.timestamp.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-muted/30">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
