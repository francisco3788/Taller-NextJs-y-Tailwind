"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/hooks/use-store"

export default function TasksPage() {
  const { toast } = useToast()
  const { tasks, setTasks, courses } = useStore()

  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    course: "",
    priority: "Media",
    description: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isViewMode, setIsViewMode] = useState(false)

  const handleAddTask = () => {
    if (newTask.title && newTask.dueDate && newTask.course) {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          ...newTask,
          completed: false,
        },
      ])
      setNewTask({
        title: "",
        dueDate: "",
        course: "",
        priority: "Media",
        description: "",
      })
      setIsDialogOpen(false)

      toast({
        title: "Tarea añadida",
        description: "La tarea ha sido añadida correctamente",
        variant: "success",
      })
    }
  }

  const handleToggleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))

    const task = tasks.find((t) => t.id === id)

    toast({
      title: task.completed ? "Tarea pendiente" : "Tarea completada",
      description: `"${task.title}" ha sido marcada como ${task.completed ? "pendiente" : "completada"}`,
      variant: task.completed ? "default" : "success",
    })
  }

  const handleViewTask = (task) => {
    setSelectedTask(task)
    setIsViewMode(true)
    setIsDialogOpen(true)
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Tareas</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setSelectedTask(null)
              setIsViewMode(false)
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
              Añadir tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isViewMode ? `Detalles de la tarea: ${selectedTask?.title}` : "Añadir nueva tarea"}
              </DialogTitle>
              <DialogDescription>
                {isViewMode
                  ? "Información detallada de la tarea seleccionada."
                  : "Completa los detalles para añadir una nueva tarea a tu lista."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {isViewMode ? (
                <>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Título</Label>
                    <p className="text-sm">{selectedTask?.title}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium">Curso</Label>
                      <p className="text-sm">{selectedTask?.course}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium">Prioridad</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            selectedTask?.priority === "Alta"
                              ? "bg-red-500"
                              : selectedTask?.priority === "Media"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <p className="text-sm">{selectedTask?.priority}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Fecha de entrega</Label>
                    <p className="text-sm">{selectedTask?.dueDate}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Descripción</Label>
                    <p className="text-sm">{selectedTask?.description || "Sin descripción"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Estado</Label>
                    <p className="text-sm">{selectedTask?.completed ? "Completada" : "Pendiente"}</p>
                  </div>
                </>
              ) : (
                <>
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
                      <Select
                        value={newTask.course}
                        onValueChange={(value) => setNewTask({ ...newTask, course: value })}
                      >
                        <SelectTrigger>
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
                        <SelectTrigger>
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
                </>
              )}
            </div>
            <DialogFooter>
              {isViewMode ? (
                <Button onClick={() => setIsDialogOpen(false)}>Cerrar</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddTask}>Guardar</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex">
          <TabsTrigger value="pending" className="flex-1 sm:flex-none">
            Pendientes ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 sm:flex-none">
            Completadas ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Tareas pendientes</CardTitle>
              <CardDescription>Gestiona tus tareas pendientes y marca las que hayas completado.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">No tienes tareas pendientes</p>
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
                      Añadir tarea
                    </Button>
                  </div>
                ) : (
                  pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-4 rounded-lg border p-4 group hover:bg-muted/30 transition-colors"
                    >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                        className="transition-all data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <div className="flex-1 space-y-1 cursor-pointer" onClick={() => handleViewTask(task)}>
                        <p className="font-medium leading-none">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {task.course} - Vence: {task.dueDate}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
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
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleViewTask(task)}
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Tareas completadas</CardTitle>
              <CardDescription>
                Revisa tus tareas completadas o marca alguna como pendiente si es necesario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No tienes tareas completadas.</p>
                ) : (
                  completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-4 rounded-lg border p-4 opacity-70 hover:opacity-100 group hover:bg-muted/30 transition-all"
                    >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                        className="transition-all data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <div className="flex-1 space-y-1 cursor-pointer" onClick={() => handleViewTask(task)}>
                        <p className="font-medium leading-none line-through">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {task.course} - Vence: {task.dueDate}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleViewTask(task)}
                      >
                        Ver
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

