'use client'

import { useEffect, useState } from 'react'

interface Task {
  id: string
  title: string
  description: string
  status: string
  dueDate: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [dueDate, setDueDate] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const getAllTasks = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error('Error fetching tasks:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const taskData = { title, description, status, dueDate }

    try {
      const url = isEditing
        ? `https://restomart-hcc5.onrender.com/api/tasks/${editingTaskId}`
        : 'https://restomart-hcc5.onrender.com/api/tasks'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })

      if (!res.ok) throw new Error('Failed to save task')

      resetForm()
      getAllTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await fetch(`https://restomart-hcc5.onrender.com/api/tasks/${id}`, { method: 'DELETE' })
    getAllTasks()
  }

  const handleEdit = (task: Task) => {
    setIsEditing(true)
    setEditingTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description)
    setStatus(task.status)
    setDueDate(task.dueDate.slice(0, 10))
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setStatus('todo')
    setDueDate('')
    setIsEditing(false)
    setEditingTaskId(null)
  }

  useEffect(() => {
    getAllTasks()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
        📝 Task Manager
      </h1>

      {/* Add/Edit Task Form */}
      <div className="bg-white p-4 sm:p-6 rounded shadow-md mb-10">

       <form onSubmit={handleSubmit} className="space-y-2">
  {/* Title */}
  <div>
    <label className="block mb-1 font-medium text-gray-700">Title</label>
    <input
      type="text"
      placeholder="Enter task title"
      value={title}
      onChange={e => setTitle(e.target.value)}
      className="w-full p-2 border rounded"
      required
    />
  </div> 
   {/* Description */}
  <div>
    <label className="block mb-1 font-medium text-gray-700">Description</label>
    <textarea
      placeholder="Enter description"
      value={description}
      onChange={e => setDescription(e.target.value)}
      className="w-full p-2 border rounded"
      required
    />
  </div>





  {/* Status */}
  <div>
    <label className="block mb-1 font-medium text-gray-700">Status</label>
    <select
      value={status}
      onChange={e => setStatus(e.target.value)}
      className="w-full p-2 border rounded"
    >
      <option value="todo">Todo</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  </div>  
  {/* Due Date */}
  <div>
    <label className="block mb-1 font-medium text-gray-700">Due Date</label>
    <input
      type="date"
      value={dueDate}
      onChange={e => setDueDate(e.target.value)}
      className="w-full p-2 border rounded"
      required
    />
  </div>

  {/* Buttons */}
  <div className="flex flex-col sm:flex-row gap-2 mt-4">
    <button
      type="submit"
      className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
    >
      {isEditing ? 'Update Task' : 'Create Task'}
    </button>
    {isEditing && (
      <button
        type="button"
        onClick={resetForm}
        className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
      >
        Cancel
      </button>
    )}
  </div>
</form>

      </div>

      {/* Task List */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">📋 All Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <div
                key={task.id}
                className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl text-blue-700 truncate">
                    {task.title}
                  </h3>
                  <p className="text-sm sm:text-base line-clamp-3">{task.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Status:</strong> {task.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Due:</strong> {task.dueDate.slice(0, 10)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-end">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
