"use client"

import { useState, useEffect, useMemo } from "react"
import { LogOut, CheckCircle, Search } from "lucide-react"
import { useLocalStorage } from "../utils/localStorage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import TaskForm from "./TaskForm"
import TaskFilter from "./TaskFilter"
import TaskList from "./TaskList"
import { ModeToggle } from "./ModeToggle"

export default function TaskDashboard({ onLogout }) {
  const { toast } = useToast()
  const [username] = useLocalStorage("username", "")
  const [tasks, setTasks] = useLocalStorage("tasks", [])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const addTask = (taskData) => {
    const newTask = {
      id: crypto.randomUUID(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks([newTask, ...tasks])
    toast({
      title: "✅ Task Added",
      description: `"${taskData.title}" is now on your list.`,
    })
  }

  const editTask = (id, taskData) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...taskData } : task)))
    toast({ title: "✏️ Task Updated", description: "Your changes have been saved." })
  }

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((t) => t.id === id)
    setTasks(tasks.filter((task) => task.id !== id))
    toast({
      title: "🗑️ Task Deleted",
      description: `"${taskToDelete?.title}" has been removed.`,
      variant: "destructive",
    })
  }

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === "pending") return !task.completed
        if (filter === "completed") return task.completed
        return true
      })
      .filter((task) => {
        if (!searchTerm) return true
        return (
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
  }, [tasks, filter, searchTerm])

  const taskCounts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks],
  )

  if (!isMounted) return null

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-7 w-7 text-indigo-600" />
              <h1 className="text-xl font-bold">My Tasks</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* The username is hidden on small screens to save space */}
              <span className="text-sm font-medium hidden sm:inline">Welcome, {username}!</span>
              <ModeToggle />
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {/* The "Logout" text is visible on all screens as it's short */}
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* This is the key responsive layout for the controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            {/* It's a column on mobile (`flex-col`) and a row on medium screens up (`md:flex-row`) */}
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <TaskForm onAddTask={addTask} />
          </div>
          <div className="bg-white dark:bg-gray-950/50 rounded-xl shadow-sm p-2">
            <div className="p-2 md:p-4">
              <TaskFilter filter={filter} setFilter={setFilter} counts={taskCounts} />
            </div>
            <TaskList tasks={filteredTasks} onToggle={toggleTaskCompletion} onDelete={deleteTask} onEdit={editTask} />
          </div>
        </div>
      </main>
    </div>
  )
}
