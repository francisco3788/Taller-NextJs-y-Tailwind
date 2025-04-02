"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/hooks/use-store"

export default function CalendarPage() {
  const { toast } = useToast()
  const { events, setEvents, tasks, setTasks, exams, setExams, courses } = useStore()

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const [currentMonthIndex, setCurrentMonthIndex] = useState(3) // Abril (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [currentMonth, setCurrentMonth] = useState("Abril 2025")
  const [currentView, setCurrentView] = useState("month")
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false)
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [calendarDays, setCalendarDays] = useState([])

  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "task",
    course: "",
    description: "",
    date: "",
  })

  // Función para generar los días del calendario
  const generateCalendarDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  // Actualizar el calendario cuando cambia el mes o el año
  useEffect(() => {
    setCurrentMonth(`${months[currentMonthIndex]} ${currentYear}`)
    setCalendarDays(generateCalendarDays(currentYear, currentMonthIndex))
  }, [currentMonthIndex, currentYear])

  // Inicializar el calendario
  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentYear, currentMonthIndex))
  }, [])

  // Función para obtener eventos de un día específico
  const getEventsForDay = (day) => {
    if (day === null) return []
    return events.filter((event) => event.date === day)
  }

  const handleDayClick = (day) => {
    if (day !== null) {
      setSelectedDay(day)
      setNewEvent({
        title: "",
        type: "task",
        course: "",
        description: "",
        date: "",
      })
      setIsAddEventDialogOpen(true)
    }
  }

  const handleEventClick = (event, e) => {
    e.stopPropagation() // Evitar que se abra el diálogo de añadir evento
    setSelectedEvent(event)
    setIsViewEventDialogOpen(true)
  }

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.course && (selectedDay !== null || newEvent.date)) {
      let day

      // Si hay un día seleccionado, usarlo directamente
      if (selectedDay !== null) {
        day = selectedDay
      }
      // Si no hay día seleccionado pero hay una fecha en el input
      else if (newEvent.date) {
        const selectedDate = new Date(newEvent.date)
        // Asegurarse de que la fecha esté en la zona horaria local
        selectedDate.setHours(12, 0, 0, 0) // Establecer a mediodía para evitar problemas de zona horaria
        day = selectedDate.getDate()

        // Verificar si la fecha seleccionada corresponde al mes actual
        const selectedMonth = selectedDate.getMonth()
        const selectedYear = selectedDate.getFullYear()

        if (selectedMonth !== currentMonthIndex || selectedYear !== currentYear) {
          // Cambiar al mes y año de la fecha seleccionada
          setCurrentMonthIndex(selectedMonth)
          setCurrentYear(selectedYear)
        }
      } else {
        toast({
          title: "Error",
          description: "Por favor selecciona un día o ingresa una fecha",
          variant: "destructive",
        })
        return
      }

      // Crear el nuevo evento con el día correcto
      const newEventObj = {
        id: Date.now(), // Usar timestamp para evitar colisiones de ID
        date: day,
        title: newEvent.title,
        type: newEvent.type,
        course: newEvent.course,
        description: newEvent.description,
      }

      // Añadir a la lista de eventos
      setEvents([...events, newEventObj])

      // También añadir a la lista correspondiente (tareas o exámenes)
      if (newEvent.type === "task") {
        // Crear fecha con el día exacto seleccionado
        const date = new Date(currentYear, currentMonthIndex, day, 12, 0, 0, 0)
        const formattedDate = date.toISOString().split("T")[0]

        const newTask = {
          id: Date.now() + 1, // Usar timestamp + 1 para evitar colisiones
          title: newEvent.title,
          dueDate: formattedDate,
          course: newEvent.course,
          priority: "Media",
          completed: false,
          description: newEvent.description,
        }

        setTasks([...tasks, newTask])
      } else {
        // Crear fecha con el día exacto seleccionado
        const date = new Date(currentYear, currentMonthIndex, day, 12, 0, 0, 0)
        const formattedDate = date.toISOString().split("T")[0]

        const newExam = {
          id: Date.now() + 2, // Usar timestamp + 2 para evitar colisiones
          title: newEvent.title,
          date: formattedDate,
          course: newEvent.course,
          description: newEvent.description,
        }

        setExams([...exams, newExam])
      }

      // Limpiar el formulario
      setNewEvent({
        title: "",
        type: "task",
        course: "",
        description: "",
        date: "",
      })

      setIsAddEventDialogOpen(false)
      setSelectedDay(null)

      toast({
        title: "Evento añadido",
        description: `${newEvent.type === "task" ? "Tarea" : "Examen"} añadido para el día ${day}`,
        variant: "success",
      })
    } else {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      // Eliminar de la lista de eventos
      setEvents(events.filter((event) => event.id !== selectedEvent.id))

      // También eliminar de la lista correspondiente (tareas o exámenes)
      if (selectedEvent.type === "task") {
        setTasks(
          tasks.filter(
            (task) => !(task.title === selectedEvent.title && new Date(task.dueDate).getDate() === selectedEvent.date),
          ),
        )
      } else {
        setExams(
          exams.filter(
            (exam) => !(exam.title === selectedEvent.title && new Date(exam.date).getDate() === selectedEvent.date),
          ),
        )
      }

      setIsViewEventDialogOpen(false)

      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado correctamente",
        variant: "success",
      })
    }
  }

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1)
    }

    toast({
      title: "Cambio de mes",
      description: "Navegando al mes anterior",
    })
  }

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1)
    }

    toast({
      title: "Cambio de mes",
      description: "Navegando al mes siguiente",
    })
  }

  const handleViewChange = (view) => {
    setCurrentView(view)

    toast({
      title: "Cambio de vista",
      description: `Vista cambiada a ${view === "month" ? "mes" : view === "week" ? "semana" : "día"}`,
    })
  }

  // Renderizar la vista según el tipo seleccionado
  const renderCalendarView = () => {
    switch (currentView) {
      case "week":
        return (
          <div className="grid grid-cols-7 gap-1 text-center">
            <div className="p-2 font-medium">Dom</div>
            <div className="p-2 font-medium">Lun</div>
            <div className="p-2 font-medium">Mar</div>
            <div className="p-2 font-medium">Mié</div>
            <div className="p-2 font-medium">Jue</div>
            <div className="p-2 font-medium">Vie</div>
            <div className="p-2 font-medium">Sáb</div>

            {/* Mostrar solo una semana */}
            {calendarDays.slice(0, 7).map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] border p-1 ${
                  day === null ? "bg-muted/50" : "hover:bg-muted/50 cursor-pointer transition-colors"
                }`}
                onClick={() => handleDayClick(day)}
              >
                {day !== null && (
                  <>
                    <div className="text-right text-sm">{day}</div>
                    <div className="mt-1 space-y-1">
                      {getEventsForDay(day).map((event) => (
                        <div
                          key={event.id}
                          className={`rounded-sm p-1 text-xs ${
                            event.type === "task"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          } hover:opacity-80 transition-opacity cursor-pointer`}
                          title={event.description}
                          onClick={(e) => handleEventClick(event, e)}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )
      case "day":
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Día {new Date().getDate()}</h3>
            <div className="space-y-2">
              {getEventsForDay(new Date().getDate()).map((event) => (
                <div
                  key={event.id}
                  className={`rounded-md p-3 ${
                    event.type === "task"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  } hover:opacity-90 transition-opacity cursor-pointer`}
                  onClick={(e) => handleEventClick(event, e)}
                >
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm">{event.course}</p>
                  {event.description && <p className="text-xs mt-1">{event.description}</p>}
                </div>
              ))}
              {getEventsForDay(new Date().getDate()).length === 0 && (
                <p className="text-center text-muted-foreground py-4">No hay eventos para este día.</p>
              )}
            </div>
          </div>
        )
      default: // month
        return (
          <div className="grid grid-cols-7 gap-1 text-center">
            <div className="p-2 font-medium">Dom</div>
            <div className="p-2 font-medium">Lun</div>
            <div className="p-2 font-medium">Mar</div>
            <div className="p-2 font-medium">Mié</div>
            <div className="p-2 font-medium">Jue</div>
            <div className="p-2 font-medium">Vie</div>
            <div className="p-2 font-medium">Sáb</div>

            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] border p-1 ${
                  day === null ? "bg-muted/50" : "hover:bg-muted/50 cursor-pointer transition-colors"
                }`}
                onClick={() => handleDayClick(day)}
              >
                {day !== null && (
                  <>
                    <div className="text-right text-sm">{day}</div>
                    <div className="mt-1 space-y-1">
                      {getEventsForDay(day).map((event) => (
                        <div
                          key={event.id}
                          className={`rounded-sm p-1 text-xs ${
                            event.type === "task"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          } hover:opacity-80 transition-opacity cursor-pointer`}
                          title={event.description}
                          onClick={(e) => handleEventClick(event, e)}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Calendario</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Select value={currentView} onValueChange={handleViewChange} className="w-full sm:w-[180px]">
            <SelectTrigger>
              <SelectValue placeholder="Vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Día</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="w-full sm:w-auto transition-all hover:shadow-md"
            onClick={() => {
              setSelectedDay(null)
              setNewEvent({
                title: "",
                type: "task",
                course: "",
                description: "",
                date: "",
              })
              setIsAddEventDialogOpen(true)
            }}
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
              className="mr-2 h-4 w-4"
            >
              <path d="M12 4v16m-8-8h16" />
            </svg>
            Añadir evento
          </Button>
        </div>
      </div>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonth}
                className="transition-transform hover:scale-105"
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
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="sr-only">Mes anterior</span>
              </Button>
              <span>{currentMonth}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                className="transition-transform hover:scale-105"
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
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <span className="sr-only">Mes siguiente</span>
              </Button>
            </div>
          </CardTitle>
          <Button
            variant="outline"
            className="transition-all hover:bg-primary hover:text-white"
            onClick={() => {
              const today = new Date()
              setCurrentMonthIndex(today.getMonth())
              setCurrentYear(today.getFullYear())
            }}
          >
            Hoy
          </Button>
        </CardHeader>
        <CardContent>{renderCalendarView()}</CardContent>
      </Card>

      {/* Diálogo para añadir evento */}
      <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDay ? `Añadir evento para el día ${selectedDay}` : "Añadir nuevo evento"}
            </DialogTitle>
            <DialogDescription>Completa los detalles para añadir un nuevo evento a tu calendario.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Título del evento"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Tarea</SelectItem>
                    <SelectItem value="exam">Examen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course">Curso</Label>
                <Select value={newEvent.course} onValueChange={(value) => setNewEvent({ ...newEvent, course: value })}>
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
            </div>
            {!selectedDay && (
              <div className="grid gap-2">
                <Label htmlFor="eventDate">Fecha</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Describe los detalles del evento"
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEvent}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para ver evento */}
      <Dialog open={isViewEventDialogOpen} onOpenChange={setIsViewEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalles del evento</DialogTitle>
            <DialogDescription>Información detallada del evento seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Título</Label>
                <p className="text-sm">{selectedEvent.title}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p className="text-sm">{selectedEvent.type === "task" ? "Tarea" : "Examen"}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Curso</Label>
                  <p className="text-sm">{selectedEvent.course}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Fecha</Label>
                <p className="text-sm">{`Día ${selectedEvent.date} de ${currentMonth}`}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Descripción</Label>
                <p className="text-sm">{selectedEvent.description || "Sin descripción"}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Eliminar
            </Button>
            <Button onClick={() => setIsViewEventDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

