import { create } from "domain"
import Task from "../models/Task.js"


export const getAllTasks = async (req, res) => {

  const {filter = "today"} = req.query
  const now = new Date()

  let startDate

  switch (filter) {
    case "today": {
      // Return now day at 00:00
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    }
    case "week": {
      const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0)
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate)
      break
    }
    case "month":{
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    }
    case "all": 
      default: {
        startDate = null
      }
  }

  // $gte: greater than or equal to
  const query = startDate ? {createdAt: { $gte: startDate }} : {}


  try {
    // { createdAt: -1 } : Sort from bottom to top
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{$sort: {createdAt: -1}}],
          activeCount: [{$match: {status: "active"}}, {$count: "count"}],
          completeCount: [{$match: {status: "complete"}}, {$count: "count"}]
        }
      }
    ])

    const tasks = result[0].tasks
    const activeCount = result[0].activeCount[0]?.count || 0
    const completeCount = result[0].completeCount[0]?.count || 0


    res.status(200).json({tasks, activeCount, completeCount})
  } catch (error) {
    console.error('Error call getAllTasks', error)
    res.status(500).json({ message: 'System Error!'})
  }

}

export const createTasks = async (req, res) => {
  try {
    const {title} = req.body;
    const task = new Task({title})

    // Save new task to DB
    const newTask = await task.save()

    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error Create Task', error)
    res.status(500).json({ message: 'Error' })
  }
}

export const addTasks = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body
    const updatedTask = await Task.findByIdAndUpdate(
      // Get Id from URL
      req.params.id,
      {
        title,
        status,
        completedAt
      },
      { new: true }
    )

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task is not exist!' })
    }

    res.status(200).json(updatedTask)

  } catch (error) {
    console.error('Error Update Task', error)
    res.status(500).json({ message: 'Error' })
  }
}

export const deleteTasks = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id)

    if (!deleteTask) {
      return res.status(404).json({ message: 'Task not found!' })
    }

    res.status(200).json(deleteTask)

  } catch (error) {
    console.error('Error Delete Task', error)
    res.status(500).json({ message: 'Error' })
  }
}