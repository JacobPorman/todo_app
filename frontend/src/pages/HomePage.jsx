  import Header from '@/components/Header.jsx'
import AddTask from '@/components/AddTask.jsx'
import DateTimeFilter from '@/components/DateTimeFilter.jsx'
import Footer from '@/components/Footer.jsx'
import StatsAndFilters from '@/components/StatsAndFilters.jsx'
import TaskList from '@/components/TaskList.jsx'
import TaskListPagination from '@/components/TaskListPagination.jsx'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { visibleTaskLimit } from '@/lib/data'

const HomePage = () => {

  const [taskBuffer, setTaskBuffer] = useState([])
  const [activeTaskCount, setActiveTaskCount] = useState(0)
  const [completeTaskCount, setCompleteTaskCount] = useState(0)

  const [filter, setFilter] = useState('all')
  const [dateQuery, setDateQuery] = useState("today")
  const [page, setPage] = useState(1)


  useEffect(() => {
    fetchTasks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateQuery])


  useEffect(() => {
    setPage(1)
  }, [filter, dateQuery])


  // Logic
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`)
      setTaskBuffer(res.data.tasks)
      setActiveTaskCount(res.data.activeCount)
      setCompleteTaskCount(res.data.completeCount)


    } catch (error) {
      console.error("An error occurred while accessing tasks!", error)
      toast.error("An error occurred while accessing tasks!")
    }
  }

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }


  // Variable
  const filteredTasks = taskBuffer.filter((task) => {
    switch(filter) {
      case 'active': 
        return task.status === "active"

      case 'completed':
        return task.status === "complete"

      default:
        return true
    }
  })


  const handleTaskChanged = () => {
    fetchTasks()
  }


  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  )


  if (visibleTasks.length === 0) {
    handlePrev()
  }


  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit)


  return (

  <div className="min-h-screen w-full relative">
  {/* Aurora Dream Corner Whispers */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: `
        radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
            radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
            radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
            radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
    }}
  />
  {/* Your content goes here */}
  <div className="container pt-8 mx-auto relative z-10">
      <div className="w-full max-w-2xl p-6 mx-auto space-y-6">

        {/* Header */}
        <Header />

        {/* Add Task */}
        <AddTask handleNewTaskAdded={handleTaskChanged} />

        {/* Stats and Filters */}
        <StatsAndFilters
          filter={filter}
          setFilter={setFilter}
          completedTasksCount={completeTaskCount}
          activeTasksCount={activeTaskCount}
        />

        {/* Task List */}
        <TaskList filteredTasks={visibleTasks} filter={filter} handleTaskChanged={handleTaskChanged}/>

        {/* Task List Pagination and Date Time Filter */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <TaskListPagination 
          handleNext={handleNext}
          handlePrev={handlePrev}
          handlePageChange={handlePageChange}
          page={page}
          totalPages={totalPages}
         />
          <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery}/>
        </div>

        {/* Footer */}
        <Footer
          completedTasksCount={completeTaskCount}
          activeTasksCount={activeTaskCount}
        />


      </div>
    </div>
</div>

    
  )
}

export default HomePage
