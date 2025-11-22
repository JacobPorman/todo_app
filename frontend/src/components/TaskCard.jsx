import React, { useState } from 'react'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Calendar, CheckCircle2, Circle, Square, SquarePen, Trash2, Trash2Icon } from 'lucide-react'
import { Input } from './ui/input'
import api from '@/lib/axios'
import { toast } from 'sonner'

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "")

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      toast.success("Task is deleted!")
      handleTaskChanged() // This func will be reloaded a Task List and response to FE to render

    } catch (error) {
      console.error("Error when delete task", error)
      toast.error("Error when delete task")
    }
  }


  const updateTask = async () => {
    try {
      setIsEditing(false)
      await api.put(`/tasks/${task._id}`, {
        title: updateTaskTitle
      })

      toast.success(`Task is changed to ${updateTaskTitle}`)
      handleTaskChanged()

    } catch (error) {
      console.error("Error when update task!", error)
      toast.error("Error when update task!")
    }
  }


  const toggleTaskCompleteButton = async () => {
    try {
      if (task.status === "active") {
        await api.put(`/tasks/${task._id}`, {
          status: "complete",
          completedAt: new Date().toISOString() // ISO: is international time
        })

        toast.success(`${task.title} is completed! Congratulation!`)
      } else {
        await api.put(`/tasks/${task._id}`, {
          status: "active",
          completedAt: null
        })
        toast.success(`${task.title} has been changed to "In progress" status!`)
      }


      handleTaskChanged()

    } catch (error) {
      console.error("Error when update task!", error)
      toast.error("Error when update task!")
    }
  }


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      updateTask()
    }
  }

  return (
    <Card 
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
      task.status === "complete" && "opacity-75"
    )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Circle Button */}
        <Button 
          variant="ghost"
          size="icon"
          className={cn(
            "shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "completed"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary-dark"
          )}
          onClick={toggleTaskCompleteButton}
        >
            {task.status === "complete" ? (
              <CheckCircle2 className="size-5"/>
            ) : (
              <Circle className="size-5"/>
            )}

        </Button>


        {/* Show or edit title */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              placeholder="Need to do?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary-dark/50 focus:ring-primary-dark/20"
              type="text"
              value={updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setIsEditing(false)
                setUpdateTaskTitle(task.title || "")
              }}
            />


          ): (
            <p className={cn(
              "text-base transition-all duration-200",
              task.status === "complete"
                ? "line-through text-muted-foreground"
                : "text-foreground"
            )}>
              {task.title}
            </p>
          )}

          {/* Created At and Completed At */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>


        {/* Edit and Delete Button */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* Edit Button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditing(true)
              setUpdateTaskTitle(task.title || "")
            }}
          >
            <SquarePen className="size-4" />
          </Button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4"/>

          </Button>

        </div>

      </div>
      
    </Card>
  )
}

export default TaskCard
