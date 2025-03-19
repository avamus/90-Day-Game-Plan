"use client"

import { useState, useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight, Info, CheckSquare, Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { type Quest, dailyQuests, generateDailyQuests } from '@/types/quests'

interface DailyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface CalendarStreakProps {
  onClose?: () => void
  allDailyTasksCompleted: boolean
  completedQuestIds: string[]
  onQuestCompletion: (questId: string, completed: boolean) => void
  currentDayProp?: number
  memberId?: string
  dailyTasksCompletion?: {[date: string]: boolean}
  onDailyTasksCompletion?: (date: string, value: any) => void
}

interface Event {
  title: string
  description: string
  time: string
  type: "quest" | "meeting" | "session"
}

interface MindsetCoachSession {
  day: number
  month: number
  year: number
  time: string
  title: string
  description: string
  fullDate?: string
}

interface DayEvents {
  [key: number]: {
    quests: Quest[]
    events: Event[]
  }
}

export function CalendarStreak({
  onClose,
  allDailyTasksCompleted,
  completedQuestIds,
  onQuestCompletion,
  currentDayProp = 26,
  memberId,
  dailyTasksCompletion = {},
  onDailyTasksCompletion
}: CalendarStreakProps) {
  const today = new Date() // Current date in user's timezone
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [coachSessions, setCoachSessions] = useState<MindsetCoachSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)

  // Remove default streak days
  const streakDays: number[] = []
  const currentDay = today.getDate() // Current day of the month in user's timezone

  // Set current year and month for display
  useEffect(() => {
    // Maintain current year and month on initialization and month changes
    const now = new Date()
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
  }, [])

  // Calculate days in month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    
    // Previous month
    const prevMonthDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate()
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false
      })
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true
      })
    }
    
    // Next month
    const remainingDays = 42 - days.length // Changed from 35 to 42 for 6 rows
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false
      })
    }
    
    return days
  }

  const allDays = generateCalendarDays()

  // Calendar events - initialize with empty events (no hardcoded defaults)
  const [events, setEvents] = useState<DayEvents>({
    ...Object.fromEntries(
      Array.from({ length: daysInMonth }, (_, i) => [
        i + 1,
        {
          quests: generateDailyQuests(i + 1),
          events: [],
        },
      ])
    )
  })

  // Fetch daily tasks for a specific date
  const fetchDailyTasks = async (date: string) => {
    if (!memberId) return;
    
    setLoadingTasks(true);
    try {
      const response = await fetch(`/api/daily-tasks?memberId=${memberId}&date=${date}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Format tasks for display in the dialog
        const tasks = [
          { 
            id: "task-1", 
            title: `Day ${new Date(date).getDate()} Quest 1`, 
            description: data.task_1 || "Complete daily task 1",
            completed: data.task_1_completed || false
          },
          { 
            id: "task-2", 
            title: `Day ${new Date(date).getDate()} Quest 2`, 
            description: data.task_2 || "Complete daily task 2",
            completed: data.task_2_completed || false
          },
          { 
            id: "task-3", 
            title: `Day ${new Date(date).getDate()} Quest 3`, 
            description: data.task_3 || "Complete daily task 3",
            completed: data.task_3_completed || false
          }
        ];
        
        setDailyTasks(tasks);
      } else {
        // Set default tasks if no data is found
        const dayNum = new Date(date).getDate();
        setDailyTasks([
          { id: "task-1", title: `Day ${dayNum} Quest 1`, description: "Complete daily task 1", completed: false },
          { id: "task-2", title: `Day ${dayNum} Quest 2`, description: "Complete daily task 2", completed: false },
          { id: "task-3", title: `Day ${dayNum} Quest 3`, description: "Complete daily task 3", completed: false }
        ]);
      }
    } catch (error) {
      console.error("Error fetching daily tasks:", error);
      setDailyTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Handle task completion in the dialog
  const handleTaskCompletion = async (taskId: string, completed: boolean) => {
    // Only allow completion if it's today
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDay || 0
    ).toISOString().split('T')[0];
    
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate !== today) {
      return; // Don't allow changing tasks for non-current dates
    }
    
    // Optimistic update UI
    setDailyTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
    
    // Extract the task number from the ID (task-1 => 1)
    const taskNum = parseInt(taskId.split('-')[1]);
    
    if (!memberId || isNaN(taskNum)) return;
    
    try {
      // Send update to API
      await fetch('/api/daily-tasks/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          taskId: taskNum,
          completed,
          date: selectedDate
        })
      });
      
      // Check if all tasks are completed now
      const allTasksCompleted = dailyTasks.every(task => 
        task.id === taskId ? completed : task.completed
      );
      
      // Notify parent component about completion status change
      if (onDailyTasksCompletion) {
        onDailyTasksCompletion(selectedDate, allTasksCompleted);
      }
      
    } catch (error) {
      console.error("Error updating task completion:", error);
      // Revert the optimistic update on error
      fetchDailyTasks(selectedDate);
    }
  };

  // Fetch mindset coach sessions function (extracted for reuse)
  const fetchCoachSessions = async () => {
    if (!memberId) {
      console.log("No memberId provided - skipping API fetch")
      return
    }
    
    console.log("Fetching sessions for memberId:", memberId)
    setIsLoading(true)
    try {
      // Make the API request with a cache-busting parameter to prevent cached responses
      const response = await fetch(`/api/mindset-coach?memberId=${memberId}&_t=${Date.now()}`)
      console.log("API Response status:", response.status)
      
      if (!response.ok) {
        throw new Error('Failed to fetch mindset coach sessions')
      }
      
      const data = await response.json()
      console.log("API Response data:", data)
      
      // Check if we got any sessions
      if (data.sessions && data.sessions.length > 0) {
        console.log("Received sessions:", data.sessions.length)
        setCoachSessions(data.sessions)
      } else {
        console.log("No sessions returned from API")
      }
    } catch (error) {
      console.error('Error fetching mindset coach sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset events when the month changes
  useEffect(() => {
    // Initialize empty events for the new month
    setEvents({
      ...Object.fromEntries(
        Array.from({ length: daysInMonth }, (_, i) => [
          i + 1,
          {
            quests: generateDailyQuests(i + 1),
            events: [],
          },
        ])
      )
    })
    
    // If we have a memberId, fetch sessions again for the new month
    if (memberId) {
      fetchCoachSessions()
    }
  }, [currentDate.getMonth(), currentDate.getFullYear(), daysInMonth, memberId])
  
  // Set up initial fetch for sessions
  useEffect(() => {
    // Only set up fetching if there's a memberId
    if (memberId) {
      fetchCoachSessions()
      
      // No automatic polling to avoid refresh issues
      // Sessions will update when manually changing months 
      // or when the user refreshes the page
    }
  }, [memberId])

  // Convert coach sessions to events for the calendar
  useEffect(() => {
    if (coachSessions.length === 0) {
      console.log("No coach sessions from API to convert to events")
      return
    }
    
    console.log("Converting coach sessions from API to calendar events:", coachSessions)
    
    // Start with a clean slate for events in the current month/year view
    const updatedEvents = {
      ...Object.fromEntries(
        Array.from({ length: daysInMonth }, (_, i) => [
          i + 1,
          {
            quests: generateDailyQuests(i + 1),
            events: [],
          },
        ])
      )
    }
    
    // Filter sessions by current month and year before processing
    const currentMonthSessions = coachSessions.filter(session => 
      session.month === currentDate.getMonth() && 
      session.year === currentDate.getFullYear()
    )
    
    console.log(`Filtered ${currentMonthSessions.length} sessions for current month/year view`)
    
    // Process only sessions for the current month/year
    currentMonthSessions.forEach(session => {
      const day = session.day
      console.log(`Adding API session for day ${day}, month ${session.month}, year ${session.year}`)
      
      if (!updatedEvents[day]) {
        updatedEvents[day] = {
          quests: generateDailyQuests(day),
          events: []
        }
      }
      
      // Check if this session already exists to avoid duplicates
      const sessionExists = updatedEvents[day].events.some(
        event => event.title === session.title && event.time === session.time
      )
      
      if (!sessionExists) {
        updatedEvents[day].events.push({
          title: session.title,
          description: session.description,
          time: session.time,
          type: "session"
        })
        console.log(`Added session from API to day ${day}:`, {
          title: session.title,
          time: session.time
        })
      }
    })
    
    // Set events state to the updated events
    setEvents(updatedEvents)
  }, [coachSessions, currentDate, daysInMonth])

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1))
  }, [])

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1))
  }, [])

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
    
    // Format the date string for the clicked day
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0]
    
    // Fetch daily tasks for this date
    fetchDailyTasks(clickedDate)
    
    // Notify parent about the date change for QuestList synchronization
    if (onDailyTasksCompletion) {
      // Use a special key for the selected date to distinguish from completion status
      onDailyTasksCompletion('selectedDate', clickedDate)
    }
    
    setIsDialogOpen(true)
  }

  const handleQuestCompletion = (questId: string) => {
    if (selectedDay === currentDay) {
      onQuestCompletion(questId, !completedQuestIds.includes(questId))
    }
  }

  const getDayStatus = useCallback(
    (day: number) => {
      if (day < currentDay - 5) return "far-past"
      if (day < currentDay) return "recent-past"
      if (day === currentDay) return "present"
      return "future"
    },
    [currentDay]
  )

  // Render calendar day
  const renderCalendarDay = (day: number, isCurrentMonth: boolean, index: number) => {
    // Check if this day is the current day in the current month
    const isToday = isCurrentMonth && day === currentDay && 
                   currentDate.getMonth() === today.getMonth() &&
                   currentDate.getFullYear() === today.getFullYear()
    
    // Check if this day has a mindset coach session
    const hasCoachSession = isCurrentMonth && 
                           events[day]?.events.some(event => 
                             event.title.includes("Mindset Coach Session")
                           )
    
    // Format the date string for the current day (YYYY-MM-DD)
    const dateString = isCurrentMonth ? 
      `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
    
    // Check if this day has completed daily tasks
    const hasDailyTasksCompleted = isCurrentMonth && 
                                  dateString && 
                                  dailyTasksCompletion?.[dateString] === true
    
    return (
      <div className="flex items-center justify-center">
        <button
          key={`${day}-${index}`}
          onClick={() => handleDayClick(day)}
          className={cn(
            "h-6 w-6 xs:h-7 xs:w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 flex flex-col items-center justify-center gap-0.5 relative",
            !isCurrentMonth && "text-gray-300",
            isCurrentMonth && !isToday && !hasCoachSession && !hasDailyTasksCompleted && "text-gray-900",
            isToday && "ring-2 ring-[#5b06be]", // Today gets a ring
            hasDailyTasksCompleted && "bg-[#4ade80] text-white rounded-lg", // Green only for completed tasks
            hasCoachSession && !hasDailyTasksCompleted && "bg-[#fbb350] text-white rounded-lg", // Yellow for coach sessions
            isToday && hasDailyTasksCompleted && "ring-2 ring-[#5b06be] bg-[#4ade80] text-white rounded-lg", // Today with completed tasks
            isToday && hasCoachSession && !hasDailyTasksCompleted && "ring-2 ring-[#5b06be] bg-[#fbb350] text-white rounded-lg" // Today with coach session
          )}
        >
          <span className="text-xs sm:text-sm font-medium">{day}</span>
          {(events[day]?.events.length > 0 || events[day]?.quests.length > 0) && (
            <div className="bg-white rounded-full inline-flex items-center h-3 px-1">
              {events[day]?.quests.length > 0 && (
                <CheckSquare className="w-2 h-2 text-[#fbb350] stroke-[2.5]" />
              )}
              {events[day]?.events.length > 0 && (
                <Info className="w-2 h-2 text-[#5b06be] stroke-[2.5] ml-0.5" />
              )}
            </div>
          )}
        </button>
      </div>
    )
  }

  // Check if a day is today's date
  const isSelectedDayToday = () => {
    if (!selectedDay) return false;
    
    const selectedDateObj = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDay
    );
    
    const todayObj = new Date();
    
    return (
      selectedDateObj.getDate() === todayObj.getDate() &&
      selectedDateObj.getMonth() === todayObj.getMonth() &&
      selectedDateObj.getFullYear() === todayObj.getFullYear()
    );
  };

  return (
    <div className="w-full flex-1 bg-white rounded-2xl border border-[#ddd] overflow-hidden flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b06be]"></div>
        </div>
      )}
      
      <div className="px-2 sm:px-4 pt-2 sm:pt-4 pb-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <button 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors" 
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
          </button>
          <h3 className="text-[19px] font-black">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h3>
          <button 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors" 
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="flex items-center justify-center text-[10px] xs:text-xs text-gray-500">
                {day}
              </div>
            ))}
          </div>
              
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {allDays.map((dayInfo, index) => 
              renderCalendarDay(dayInfo.day, dayInfo.isCurrentMonth, index)
            )}
          </div>
        </div>
      </div>

      {/* Day details dialog with daily tasks */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[350px] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[19px] font-black text-[#5b06be]">
              Events for {currentDate.toLocaleString("default", { month: "long" })} {selectedDay}
            </DialogTitle>
          </DialogHeader>

          {/* Coach sessions displayed at the top */}
          {selectedDay && events[selectedDay]?.events.map((event, index) => (
            <div
              key={index}
              className="bg-[#fbb350] p-3 rounded-xl text-white mb-3"
            >
              <div className="flex justify-between items-start mb-1.5">
                <h3 className="text-[15px] font-semibold pr-3">
                  {event.title}
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-[#5b06be] rounded-full">
                  {event.time}
                </span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm">{event.description}</p>
            </div>
          ))}

          {/* Daily Quests section */}
          {selectedDay && (
            <>
              <Separator className="my-3" />
              <div className="space-y-3">
                <h3 className="text-[15px] font-semibold text-[#5b06be] flex items-center">
                  Daily Quests
                </h3>

                {loadingTasks ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Loading tasks...</p>
                  </div>
                ) : (
                  dailyTasks.length > 0 ? (
                    dailyTasks.map((task) => {
                      const isToday = isSelectedDayToday();
                      
                      return (
                        <div
                          key={task.id}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-xl",
                            !isToday && !task.completed && "opacity-50"
                          )}
                        >
                          <div className="flex-1">
                            <h4 className={cn(
                              "font-semibold text-[15px]",
                              task.completed && "text-[#4ade80] line-through opacity-80",
                              !task.completed && "text-[#5b06be]"
                            )}>
                              {task.title}
                            </h4>
                            <p className={cn(
                              "text-xs",
                              task.completed ? "text-gray-400" : "text-gray-600"
                            )}>
                              {task.description}
                            </p>
                          </div>
                          
                          {isToday ? (
                            <Button
                              onClick={() => handleTaskCompletion(task.id, !task.completed)}
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium text-white transition-all",
                                task.completed
                                  ? "bg-gray-300 hover:bg-gray-400"
                                  : "bg-[#f8b922] hover:bg-[#e5a91f] shadow-[0_0_10px_rgba(248,185,34,0.3)] hover:shadow-[0_0_15px_rgba(248,185,34,0.5)]"
                              )}
                            >
                              {task.completed ? "Completed" : "Complete"}
                            </Button>
                          ) : (
                            task.completed ? (
                              <Check className="text-[#5b06be] w-4 h-4" />
                            ) : (
                              <span className="text-gray-400 text-xs">
                                {new Date(
                                  currentDate.getFullYear(),
                                  currentDate.getMonth(),
                                  selectedDay
                                ) < new Date() ? "Missed" : "Locked"}
                              </span>
                            )
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No daily quests for this day</p>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
