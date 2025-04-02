"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
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
            className="h-5 w-5"
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">UniTrack</span>
          </Link>
        </div>
        <div className="flex flex-col gap-3 px-2 py-4">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center px-5 py-2 text-base font-medium transition-colors hover:text-foreground/80 hover:bg-muted/50 rounded-md",
              pathname === "/dashboard" ? "text-foreground bg-muted/50" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/calendar"
            className={cn(
              "flex items-center px-5 py-2 text-base font-medium transition-colors hover:text-foreground/80 hover:bg-muted/50 rounded-md",
              pathname?.startsWith("/calendar") ? "text-foreground bg-muted/50" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            Calendario
          </Link>
          <Link
            href="/tasks"
            className={cn(
              "flex items-center px-5 py-2 text-base font-medium transition-colors hover:text-foreground/80 hover:bg-muted/50 rounded-md",
              pathname?.startsWith("/tasks") ? "text-foreground bg-muted/50" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            Tareas
          </Link>
          <Link
            href="/courses"
            className={cn(
              "flex items-center px-5 py-2 text-base font-medium transition-colors hover:text-foreground/80 hover:bg-muted/50 rounded-md",
              pathname?.startsWith("/courses") ? "text-foreground bg-muted/50" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            Cursos
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

