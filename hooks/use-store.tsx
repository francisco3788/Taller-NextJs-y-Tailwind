"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// Tipos para nuestros datos
export type Task = {
  id: number
  title: string
  dueDate: string
  course: string
  priority: string
  completed: boolean
  description?: string
}

export type Exam = {
  id: number
  title: string
  date: string
  course: string
  description?: string
}

export type Course = {
  id: number
  name: string
  professor: string
  schedule: string
  progress: number
  color: string
  description?: string
}

export type Event = {
  id: number
  date: number
  title: string
  type: "task" | "exam"
  course: string
  description?: string
}

// Tipo para nuestro contexto
type StoreContextType = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  exams: Exam[]
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>
  courses: Course[]
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
  overallProgress: number
  calculateOverallProgress: () => void
}

// Datos iniciales
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Ensayo de Literatura",
    dueDate: "2025-04-05",
    course: "Literatura",
    priority: "Alta",
    completed: false,
    description: "Análisis de la obra 'Cien años de soledad'",
  },
  {
    id: 2,
    title: "Proyecto de Programación",
    dueDate: "2025-04-10",
    course: "Programación",
    priority: "Media",
    completed: false,
    description: "Desarrollo de una aplicación web con React",
  },
  {
    id: 3,
    title: "Presentación de Marketing",
    dueDate: "2025-04-15",
    course: "Marketing",
    priority: "Alta",
    completed: false,
    description: "Estrategia de marketing digital para una startup",
  },
  {
    id: 4,
    title: "Ejercicios de Matemáticas",
    dueDate: "2025-04-03",
    course: "Matemáticas",
    priority: "Baja",
    completed: true,
    description: "Ejercicios de cálculo diferencial",
  },
  {
    id: 5,
    title: "Resumen de Historia",
    dueDate: "2025-04-01",
    course: "Historia",
    priority: "Media",
    completed: true,
    description: "Resumen del capítulo sobre la Segunda Guerra Mundial",
  },
]

const initialExams: Exam[] = [
  {
    id: 1,
    title: "Parcial de Matemáticas",
    date: "2025-04-08",
    course: "Matemáticas",
    description: "Temas: Cálculo diferencial e integral",
  },
  {
    id: 2,
    title: "Examen de Historia",
    date: "2025-04-12",
    course: "Historia",
    description: "Temas: Historia contemporánea",
  },
]

const initialCourses: Course[] = [
  {
    id: 1,
    name: "Matemáticas",
    professor: "Dr. García",
    schedule: "Lunes y Miércoles 10:00 - 12:00",
    progress: 65,
    color: "bg-blue-500",
    description: "Curso de cálculo diferencial e integral para estudiantes de ingeniería.",
  },
  {
    id: 2,
    name: "Literatura",
    professor: "Dra. Martínez",
    schedule: "Martes y Jueves 8:00 - 10:00",
    progress: 40,
    color: "bg-green-500",
    description: "Análisis de obras literarias clásicas y contemporáneas.",
  },
  {
    id: 3,
    name: "Programación",
    professor: "Ing. Rodríguez",
    schedule: "Lunes y Viernes 14:00 - 16:00",
    progress: 80,
    color: "bg-purple-500",
    description: "Fundamentos de programación y desarrollo de aplicaciones web.",
  },
  {
    id: 4,
    name: "Historia",
    professor: "Dr. López",
    schedule: "Miércoles y Viernes 12:00 - 14:00",
    progress: 30,
    color: "bg-yellow-500",
    description: "Historia contemporánea con enfoque en eventos del siglo XX.",
  },
  {
    id: 5,
    name: "Marketing",
    professor: "Lic. Sánchez",
    schedule: "Martes y Jueves 16:00 - 18:00",
    progress: 55,
    color: "bg-pink-500",
    description: "Estrategias de marketing digital y tradicional para empresas.",
  },
]

const initialEvents: Event[] = [
  {
    id: 1,
    date: 5,
    title: "Entrega de ensayo",
    type: "task",
    course: "Literatura",
    description: "Análisis de la obra 'Cien años de soledad'",
  },
  {
    id: 2,
    date: 8,
    title: "Parcial de Matemáticas",
    type: "exam",
    course: "Matemáticas",
    description: "Temas: Cálculo diferencial e integral",
  },
  {
    id: 3,
    date: 10,
    title: "Proyecto de Programación",
    type: "task",
    course: "Programación",
    description: "Desarrollo de una aplicación web con React",
  },
  {
    id: 4,
    date: 12,
    title: "Examen de Historia",
    type: "exam",
    course: "Historia",
    description: "Temas: Historia contemporánea",
  },
  {
    id: 5,
    date: 15,
    title: "Presentación de Marketing",
    type: "task",
    course: "Marketing",
    description: "Estrategia de marketing digital para una startup",
  },
]

// Crear el contexto
const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Proveedor del contexto
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [overallProgress, setOverallProgress] = useState<number>(54)

  // Calcular el progreso general basado en el progreso de los cursos
  const calculateOverallProgress = () => {
    if (courses.length === 0) return 0
    const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0)
    const newOverallProgress = Math.round(totalProgress / courses.length)
    setOverallProgress(newOverallProgress)
    return newOverallProgress
  }

  // Calcular el progreso general cuando cambian los cursos
  useEffect(() => {
    calculateOverallProgress()
  }, [courses])

  // Sincronizar eventos con tareas y exámenes
  useEffect(() => {
    // Convertir tareas a eventos
    const taskEvents = tasks
      .filter((task) => !task.completed)
      .map((task) => {
        const date = new Date(task.dueDate)
        return {
          id: task.id,
          date: date.getDate(),
          title: task.title,
          type: "task" as const,
          course: task.course,
          description: task.description,
        }
      })

    // Convertir exámenes a eventos
    const examEvents = exams.map((exam) => {
      const date = new Date(exam.date)
      return {
        id: exam.id + 1000, // Para evitar colisiones de ID
        date: date.getDate(),
        title: exam.title,
        type: "exam" as const,
        course: exam.course,
        description: exam.description,
      }
    })

    // Actualizar eventos
    setEvents([...taskEvents, ...examEvents])
  }, [tasks, exams])

  return (
    <StoreContext.Provider
      value={{
        tasks,
        setTasks,
        exams,
        setExams,
        courses,
        setCourses,
        events,
        setEvents,
        overallProgress,
        calculateOverallProgress,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

// Hook para usar el contexto
export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

