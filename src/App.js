"use client"
import { useState, useEffect, useMemo } from "react"
import { format, isPast } from "date-fns"
import {
  LogOut,
  CheckCircle,
  Search,
  Plus,
  CalendarIcon,
  Edit,
  Trash2,
  MoreVertical,
  Flag,
  Moon,
  Sun,
} from "lucide-react"
import {
  Button,
  Input,
  Textarea,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Calendar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui"
import { useToast } from "@/lib/toast"
import { cn } from "@/lib/utils"

// Theme Provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme")
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  return (
    <div data-theme={theme}>
      {children}
      <ThemeToggle theme={theme} setTheme={setTheme} />
    </div>
  )
}

// Theme Toggle Component
function ThemeToggle({ theme, setTheme }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 text-muted-foreground"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Local Storage Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue
      try {
        return JSON.parse(item)
      } catch {
        return item
      }
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Login Component
function Login({ onLogin }) {
  const [isLoginView, setIsLoginView] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isLoginView && password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    if (username.trim()) {
      localStorage.setItem("username", username.trim())
      onLogin()
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-950 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            {isLoginView ? "Welcome Back!" : "Create an Account"}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isLoginView ? "Sign in to access your dashboard." : "Get started with your own task dashboard."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              type="text"
              placeholder={isLoginView ? "e.g., janedoe" : "Choose a username"}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder={isLoginView ? "Enter your password" : "Create a password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!isLoginView && (
            <div className="grid gap-2">
              <label htmlFor="confirm-password">Confirm Password</label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
          >
            {isLoginView ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {isLoginView ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </main>
  )
}

// Task Form Component
function TaskForm({ onAddTask, task, onEdit }) {
  const isEditMode = !!task
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate) : null)
  const [priority, setPriority] = useState(task?.priority || "medium")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority,
    }

    if (isEditMode) {
      onEdit(task.id, taskData)
    } else {
      onAddTask(taskData)
    }

    if (!isEditMode) {
      setTitle("")
      setDescription("")
      setDueDate(null)
      setPriority("medium")
    }
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "Add a new task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Design new landing page"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label>Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <label>Priority</label>
              <Select onValueChange={setPriority} defaultValue={priority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditMode ? "Save Changes" : "Add Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Task Item Component
function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)

  const priorityStyles = {
    low: {
      label: "Low",
      borderColor: "border-gray-400",
      textColor: "text-gray-500 dark:text-gray-400",
      bgColor: "bg-gray-100 dark:bg-gray-800",
    },
    medium: {
      label: "Medium",
      borderColor: "border-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/50",
    },
    high: {
      label: "High",
      borderColor: "border-red-500",
      textColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/50",
    },
  }

  const styles = priorityStyles[task.priority] || priorityStyles.medium
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed

  return (
    <div
      className={`group flex items-start gap-4 p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-900 border-l-4 ${task.completed ? "border-green-500" : styles.borderColor} ${task.completed ? "opacity-60" : ""}`}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-1 h-5 w-5 rounded-md"
      />
      <div className="flex-1 cursor-pointer" onClick={() => onToggle(task.id)}>
        <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-4 mt-1">
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500 font-semibold" : "text-muted-foreground"}`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          )}
          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${styles.bgColor} ${styles.textColor}`}
          >
            <Flag className="h-3 w-3" />
            <span>{styles.label}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => {
                if (window.confirm("Are you sure you want to permanently delete this task?")) {
                  onDelete(task.id)
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isEditing && (
        <div onClick={(e) => e.stopPropagation()}>
          <TaskForm task={task} onEdit={onEdit} />
        </div>
      )}
    </div>
  )
}

// Task Dashboard Component
function TaskDashboard({ onLogout }) {
  const { toast } = useToast()
  const [username] = useLocalStorage("username", "")
  const [tasks, setTasks] = useLocalStorage("tasks", [])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Add theme state management
  const [theme, setTheme] = useState("system")

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem("theme", theme)
  }, [theme])

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

  const filters = [
    { id: "all", label: "All Tasks" },
    { id: "pending", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ]

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
              <span className="text-sm font-medium hidden sm:inline">Welcome, {username}!</span>
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
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
              <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-full">
                {filters.map((f) => (
                  <Button
                    key={f.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter(f.id)}
                    className={`rounded-full transition-colors duration-200 ${filter === f.id ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-indigo-600"}`}
                  >
                    {f.label}
                    <span
                      className={`ml-2 text-xs rounded-full px-2 py-0.5 font-medium transition-colors duration-200 ${filter === f.id ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300"}`}
                    >
                      {taskCounts[f.id]}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tasks here. Add one to get started!</p>
              ) : (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompletion}
                    onDelete={deleteTask}
                    onEdit={editTask}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (localStorage.getItem("username")) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("username")
    setIsLoggedIn(false)
  }

  if (!isMounted) {
    return null
  }

  return (
    <ThemeProvider>
      <div className="dark:bg-gray-900">
        {isLoggedIn ? <TaskDashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
      </div>
    </ThemeProvider>
  )
}
