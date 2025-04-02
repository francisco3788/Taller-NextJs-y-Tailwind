"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">UniTrack</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm",
            pathname === "/dashboard" ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Inicio
        </Link>
        <Link
          href="/calendar"
          className={cn(
            "transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm",
            pathname?.startsWith("/calendar") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Calendario
        </Link>
        <Link
          href="/tasks"
          className={cn(
            "transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm",
            pathname?.startsWith("/tasks") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Tareas
        </Link>
        <Link
          href="/courses"
          className={cn(
            "transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm",
            pathname?.startsWith("/courses") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Cursos
        </Link>
      </nav>
    </div>
  )
}

