"use client"

import { Button } from "@/components/ui/button"

export default function TaskFilter({ filter, setFilter, counts }) {
  const filters = [
    { id: "all", label: "All Tasks" },
    { id: "pending", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ]

  return (
    // `flex-wrap` allows buttons to wrap onto the next line on very small screens
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
            {counts[f.id]}
          </span>
        </Button>
      ))}
    </div>
  )
}
