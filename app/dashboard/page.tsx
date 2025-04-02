"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/hooks/use-store"

export default function DashboardPage() {
  const { toast } = useToast()
  const { tasks, setTasks, exams, setExams, courses, overallProgress } = useStore()

  const [activeTab, setActiveTab] = useState("overview")
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [isViewExamDialogOpen, setIsViewExamDialogOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState(null)

  const [newTask, setNewTask] = useState({
    title: "",
    course: "",
    dueDate: "",
    priority: "Media",
    description: "",
  })

  const pendingTasks = tasks.filter((task) => !task.completed)

  const handleAddTask = () => {
    if (newTask.title && newTask.course && newTask.dueDate) {
      const newTaskObj = {
        id: tasks.length + 1,
        ...newTask,
        completed: false,
      }

      setTasks([...tasks, newTaskObj])
      setNewTask({
        title: "",
        course: "",
        dueDate: "",
        priority: "Media",
        description: "",
      })

      setIsAddTaskDialogOpen(false)

      toast({
        title: "Tarea añadida",
        description: "La tarea ha sido añadida correctamente",
        variant: "success",
      })
    }
  }

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))

    toast({
      title: "Tarea completada",
      description: "La tarea ha sido marcada como completada",
      variant: "success",
    })
  }

  const handleViewExam = (exam) => {
    setSelectedExam(exam)
    setIsViewExamDialogOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Inicio</h2>
        <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
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
              Añadir tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Añadir nueva tarea</DialogTitle>
              <DialogDescription>Completa los detalles para añadir una nueva tarea a tu lista.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Título de la tarea"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="course">Curso</Label>
                  <Select value={newTask.course} onValueChange={(value) => setNewTask({ ...newTask, course: value })}>
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Selecciona un curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.name}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Selecciona la prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Fecha de entrega</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe los detalles de la tarea"
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTask}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto flex flex-wrap justify-start">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">
            Resumen
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex-1 sm:flex-none">
            Tareas
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex-1 sm:flex-none">
            Exámenes
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex-1 sm:flex-none">
            Cursos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tareas pendientes</CardTitle>
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
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks.length}</div>
                <p className="text-xs text-muted-foreground">+2 desde la semana pasada</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exámenes próximos</CardTitle>
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
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{exams.length}</div>
                <p className="text-xs text-muted-foreground">Próximo: {exams[0]?.date}</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cursos activos</CardTitle>
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
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
                <p className="text-xs text-muted-foreground">Semestre en curso</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progreso general</CardTitle>
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
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                  <path d="M6 12h12" />
                  <path d="M12 6v12" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <Progress value={overallProgress} className="mt-2" />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Tareas próximas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTasks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No tienes tareas pendientes.</p>
                  ) : (
                    pendingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.course} - Vence: {task.dueDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${task.priority === "Alta" ? "bg-red-500" : task.priority === "Media" ? "bg-yellow-500" : "bg-green-500"}`}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            Completar
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Exámenes próximos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exams.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No tienes exámenes próximos.</p>
                  ) : (
                    exams.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{exam.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {exam.course} - Fecha: {exam.date}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleViewExam(exam)}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Todas las tareas</CardTitle>
              <CardDescription>Gestiona todas tus tareas pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">No tienes tareas pendientes</p>
                    <Button onClick={() => setIsAddTaskDialogOpen(true)}>
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
                      Añadir tarea
                    </Button>
                  </div>
                ) : (
                  pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 group hover:bg-muted/30 p-2 rounded-md transition-colors"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <p className="text-sm font-medium leading-none">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {task.course} - Vence: {task.dueDate}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 max-w-md">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            task.priority === "Alta"
                              ? "bg-red-500"
                              : task.priority === "Media"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompleteTask(task.id)}
                          className="transition-all hover:bg-green-500 hover:text-white"
                        >
                          Completar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exams" className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Todos los exámenes</CardTitle>
              <CardDescription>Visualiza todos tus exámenes programados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">No tienes exámenes programados</p>
                    <Link href="/calendar">
                      <Button>
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
                        Añadir examen
                      </Button>
                    </Link>
                  </div>
                ) : (
                  exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 group hover:bg-muted/30 p-2 rounded-md transition-colors"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <p className="text-sm font-medium leading-none">{exam.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {exam.course} - Fecha: {exam.date}
                        </p>
                        {exam.description && (
                          <p className="text-xs text-muted-foreground mt-1 max-w-md">{exam.description}</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="self-end sm:self-auto transition-all hover:bg-primary hover:text-white"
                        onClick={() => handleViewExam(exam)}
                      >
                        Ver detalles
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="courses" className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Todos los cursos</CardTitle>
              <CardDescription>Visualiza el progreso de todos tus cursos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-2 group hover:bg-muted/30 p-3 rounded-md transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{course.name}</p>
                      <p className="text-sm text-muted-foreground">{course.progress}%</p>
                    </div>
                    <Progress value={course.progress} className={course.color} />
                    <div className="pt-1 text-right">
                      <Link href={`/courses?id=${course.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para ver detalles de examen */}
      <Dialog open={isViewExamDialogOpen} onOpenChange={setIsViewExamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalles del examen</DialogTitle>
            <DialogDescription>Información detallada del examen seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedExam && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Título</Label>
                <p className="text-sm">{selectedExam.title}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Curso</Label>
                <p className="text-sm">{selectedExam.course}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Fecha</Label>
                <p className="text-sm">{selectedExam.date}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Descripción</Label>
                <p className="text-sm">{selectedExam.description || "Sin descripción"}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewExamDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

