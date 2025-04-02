"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/hooks/use-store"

export default function CoursesPage() {
  const { toast } = useToast()
  const { courses, setCourses, calculateOverallProgress } = useStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [newCourse, setNewCourse] = useState({
    name: "",
    professor: "",
    schedule: "",
    description: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isViewMode, setIsViewMode] = useState(false)

  // Verificar si hay un ID de curso en la URL para mostrar sus detalles
  useEffect(() => {
    const courseId = searchParams.get("id")
    if (courseId && !isDialogOpen) {
      const course = courses.find((c) => c.id === Number.parseInt(courseId))
      if (course) {
        setSelectedCourse(course)
        setIsViewMode(true)
        setIsDialogOpen(true)
      }
    }
  }, [searchParams, courses, isDialogOpen])

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.professor && newCourse.schedule) {
      const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500"]
      setCourses([
        ...courses,
        {
          id: courses.length + 1,
          ...newCourse,
          progress: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ])
      setNewCourse({
        name: "",
        professor: "",
        schedule: "",
        description: "",
      })

      setIsDialogOpen(false)

      toast({
        title: "Curso añadido",
        description: "El curso ha sido añadido correctamente",
        variant: "success",
      })
    }
  }

  const viewCourseDetails = (course) => {
    setSelectedCourse(course)
    setIsViewMode(true)
    setIsDialogOpen(true)

    // Actualizar la URL para reflejar el curso seleccionado
    router.push(`/courses?id=${course.id}`, { scroll: false })
  }

  const closeDialog = () => {
    // Primero limpiar la URL
    router.push("/courses", { scroll: false })

    // Luego cerrar el diálogo y limpiar el estado
    setIsDialogOpen(false)
    setSelectedCourse(null)
    setIsViewMode(false)
  }

  const updateCourseProgress = (course, newProgress) => {
    setCourses(courses.map((c) => (c.id === course.id ? { ...c, progress: newProgress } : c)))

    // Actualizar el progreso general
    calculateOverallProgress()

    toast({
      title: "Progreso actualizado",
      description: `El progreso de ${course.name} ha sido actualizado a ${newProgress}%`,
      variant: "success",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Cursos</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeDialog()
            } else {
              setIsDialogOpen(open)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto transition-all hover:shadow-md">
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
                className="mr-2 h-4 w-4"
              >
                <path d="M12 4v16m-8-8h16" />
              </svg>
              Añadir curso
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[500px]"
            onInteractOutside={(e) => {
              e.preventDefault() // Prevenir cierre al hacer clic fuera
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault() // Prevenir cierre con tecla Escape
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {isViewMode ? `Detalles del curso: ${selectedCourse?.name}` : "Añadir nuevo curso"}
              </DialogTitle>
              <DialogDescription>
                {isViewMode
                  ? "Información detallada del curso seleccionado."
                  : "Completa los detalles para añadir un nuevo curso a tu lista."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {isViewMode ? (
                <>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Nombre del curso</Label>
                    <p className="text-sm">{selectedCourse?.name}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Profesor</Label>
                    <p className="text-sm">{selectedCourse?.professor}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Horario</Label>
                    <p className="text-sm">{selectedCourse?.schedule}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Descripción</Label>
                    <p className="text-sm">{selectedCourse?.description || "Sin descripción"}</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Progreso</Label>
                      <p className="text-sm font-medium">{selectedCourse?.progress}%</p>
                    </div>
                    <Progress value={selectedCourse?.progress} className={selectedCourse?.color} />
                    <div className="flex justify-between gap-2 mt-2">
                      {[25, 50, 75, 100].map((progress) => (
                        <Button
                          key={progress}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateCourseProgress(selectedCourse, progress)
                            setSelectedCourse({ ...selectedCourse, progress })
                          }}
                          className={`${selectedCourse?.progress >= progress ? selectedCourse?.color + " text-white" : ""} transition-colors`}
                        >
                          {progress}%
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del curso</Label>
                    <Input
                      id="name"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      placeholder="Nombre del curso"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="professor">Profesor</Label>
                    <Input
                      id="professor"
                      value={newCourse.professor}
                      onChange={(e) => setNewCourse({ ...newCourse, professor: e.target.value })}
                      placeholder="Nombre del profesor"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="schedule">Horario</Label>
                    <Input
                      id="schedule"
                      value={newCourse.schedule}
                      onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
                      placeholder="Ej: Lunes y Miércoles 10:00 - 12:00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      placeholder="Describe el contenido del curso"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              {isViewMode ? (
                <Button onClick={closeDialog}>Cerrar</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCourse}>Guardar</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden transition-all hover:shadow-lg group">
            <CardHeader className={`${course.color} text-white`}>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription className="text-white text-opacity-90">{course.professor}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Horario:</p>
                  <p className="text-sm text-muted-foreground">{course.schedule}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Progreso:</p>
                    <p className="text-sm font-medium">{course.progress}%</p>
                  </div>
                  <Progress value={course.progress} className={course.color} />
                </div>
                <Button
                  variant="outline"
                  className="w-full transition-all hover:bg-muted group-hover:shadow-sm"
                  onClick={() => viewCourseDetails(course)}
                >
                  Ver detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">No tienes cursos registrados</p>
          <Button onClick={() => setIsDialogOpen(true)}>
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
              className="mr-2 h-4 w-4"
            >
              <path d="M12 4v16m-8-8h16" />
            </svg>
            Añadir curso
          </Button>
        </div>
      )}
    </div>
  )
}

