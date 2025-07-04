"use client"

import { useState } from "react"
import { format, isPast } from "date-fns"
import { Edit, Trash2, MoreVertical, CalendarIcon, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import TaskForm from "./TaskForm" // Re-using the form for editing

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
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
