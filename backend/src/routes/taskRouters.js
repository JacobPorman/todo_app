import express from 'express'
import { 
  getAllTasks,
  createTasks,
  addTasks,
  deleteTasks
 } from '../controller/taskController.js'

const router = express.Router()


router.get('/', getAllTasks)

router.post('/', createTasks)

router.put('/:id', addTasks)

router.delete('/:id', deleteTasks)

export default router

// 