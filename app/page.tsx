import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">UniTrack</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="transition-all hover:bg-muted">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="transition-all hover:shadow-md">
                  Registrarse
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Organiza tu vida universitaria
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Nunca más olvides fechas de entrega o pierdas el control de tus tareas. UniTrack te ayuda a mantener
                    todo organizado.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full transition-all hover:shadow-md">
                      Comenzar ahora
                    </Button>
                  </Link>
                  <Link href="#features" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full transition-all hover:bg-muted">
                      Ver características
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 shadow-lg transition-all hover:shadow-xl overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <div className="w-full rounded-lg bg-white dark:bg-gray-800 shadow-md p-4 mb-4">
                      <div className="h-6 w-24 bg-blue-200 dark:bg-blue-700 rounded mb-2"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="w-full rounded-lg bg-white dark:bg-gray-800 shadow-md p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-6 w-32 bg-green-200 dark:bg-green-700 rounded"></div>
                        <div className="h-6 w-16 bg-blue-200 dark:bg-blue-700 rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="w-full rounded-lg bg-white dark:bg-gray-800 shadow-md p-4">
                      <div className="h-6 w-28 bg-purple-200 dark:bg-purple-700 rounded mb-2"></div>
                      <div className="grid grid-cols-7 gap-1">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Características principales
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Todo lo que necesitas para tener éxito en tu vida universitaria
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Calendario Intuitivo</h3>
                <p className="text-center text-muted-foreground">
                  Visualiza todas tus clases, exámenes y tareas en un calendario fácil de usar.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Gestión de Tareas</h3>
                <p className="text-center text-muted-foreground">
                  Organiza tus tareas por asignatura, prioridad y fecha de entrega.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Recordatorios</h3>
                <p className="text-center text-muted-foreground">
                  Recibe notificaciones personalizadas para nunca olvidar una fecha importante.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">¿Listo para empezar?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Únete a miles de estudiantes que ya están mejorando su organización académica
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="transition-all hover:shadow-md">
                    Registrarse gratis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 UniTrack. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

