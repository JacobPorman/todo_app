
const Footer = ({ completedTasksCount = 2, activeTasksCount = 3 }) => {
  return (
    <>
      {completedTasksCount + activeTasksCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {
              completedTasksCount > 0 && (
                <>
                  Awesome! You're done {completedTasksCount} tasks!
                  {
                    activeTasksCount > 0 && `, only ${activeTasksCount} more tasks!` 
                  }
                </>
              )
            }

            {completedTasksCount === 0 && activeTasksCount > 0 && (
              <>
                Let's start doing {activeTasksCount} tasks!
              </>
            )}
          </p>
        
        </div>
      )}
    </>
  )
}

export default Footer
