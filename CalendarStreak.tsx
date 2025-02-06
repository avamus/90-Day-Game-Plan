import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, Info, CheckSquare, Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"
import { type Quest, dailyQuests, generateDailyQuests } from '@/types/quests'

interface CalendarStreakProps {
  onClose?: () => void
  allDailyTasksCompleted: boolean
  completedQuestIds: string[]
  onQuestCompletion: (questId: string, completed: boolean) => void
}

interface Event {
  title: string
  description: string
  time: string
  type: "quest" | "meeting" | "session"
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
}: CalendarStreakProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 26))
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const streakDays = [6, 7, 8]
  const currentDay = 26

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

  const allDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
  }))

  const events: DayEvents = {
    ...Object.fromEntries(
      Array.from({ length: daysInMonth }, (_, i) => [
        i + 1,
        {
          quests: generateDailyQuests(i + 1),
          events: [],
        },
      ])
    ),
    15: {
      quests: generateDailyQuests(15),
      events: [
        {
          title: "Mindset Coach Session",
          description: "One-on-one coaching session",
          time: "2:00 PM",
          type: "session",
        },
      ],
    },
    26: {
      quests: dailyQuests,
      events: [
        {
          title: "Team Meeting",
          description: "Weekly team sync",
          time: "10:00 AM",
          type: "meeting",
        },
      ],
    },
  }

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prevDate) => {
      const nextMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      )
      return nextMonth
    })
  }, [])

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prevDate) => {
      const previousMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      )
      return previousMonth
    })
  }, [])

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
    if (events[day]) {
      setIsDialogOpen(true)
    }
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

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <h3 className="text-2xl font-bold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 p-4">
          {allDays.map(({ day, isCurrentMonth }, index) => (
            <button
              key={`${day}-${index}`}
              onClick={() => handleDayClick(day)}
              className={cn(
                "aspect-square flex flex-col items-center justify-between p-4 text-lg relative",
                !isCurrentMonth && "text-gray-300",
                isCurrentMonth &&
                  !streakDays.includes(day) &&
                  day !== currentDay &&
                  "text-gray-900",
                isCurrentMonth &&
                  streakDays.includes(day) &&
                  "bg-[#fbb350] text-white rounded-2xl",
                isCurrentMonth &&
                  day === currentDay &&
                  "ring-2 ring-[#5b06be] text-[#5b06be] rounded-2xl",
                events[day]?.events.length > 0 &&
                  "bg-[#4ade80] text-white rounded-2xl",
                day === 26 &&
                  "bg-[#4ade80] ring-2 ring-[#5b06be] rounded-2xl"
              )}
            >
              <span className="text-lg font-medium">{day}</span>
              <div className="flex justify-center items-center mt-2">
                <div className="bg-white rounded-full py-1 px-2 inline-flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-[#fbb350]" />
                  {events[day]?.events.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-5 h-5 text-[#5b06be]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{events[day].events[0].title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#5b06be]">
              Events for {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {selectedDay}
            </DialogTitle>
          </DialogHeader>
          {selectedDay && (
            <>
              {events[selectedDay]?.events.length > 0 && (
                <div className="space-y-4">
                  {events[selectedDay].events.map((event, index) => (
                    <div
                      key={index}
                      className="bg-[#fbb350]/90 backdrop-filter backdrop-blur-sm p-4 rounded-lg border border-[#fbb350]/20 shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-white pr-4">
                          {event.title}
                        </h3>
                        <span className="px-3 py-1 text-sm font-medium text-white bg-[#5b06be] rounded-full">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-white/90">{event.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {events[selectedDay]?.events.length > 0 &&
                events[selectedDay]?.quests.length > 0 && <Separator />}

              {events[selectedDay]?.quests.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#5b06be] flex items-center">
                    <Image
                      src="https://res.cloudinary.com/drkudvyog/image/upload/v1737454406/Daily_quests_icon_duha_hh7svb.png"
                      alt="Daily Quests icon"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    Daily Quests
                  </h3>
                  <div className="space-y-3">
                    {events[selectedDay].quests.map((quest) => {
                      const dayStatus = getDayStatus(selectedDay)
                      const isCompleted = completedQuestIds.includes(quest.id)
                      const isDisabled = dayStatus !== "present"

                      return (
                        <div
                          key={quest.id}
                          className={`flex items-center justify-between bg-white p-4 rounded-xl shadow-sm ${
                            isDisabled ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-start flex-grow">
                            <div>
                              <h4
                                className={`font-bold ${
                                  isCompleted
                                    ? "text-gray-400 line-through"
                                    : dayStatus === "recent-past" ||
                                      dayStatus === "far-past"
                                    ? "text-gray-400"
                                    : "text-[#5b06be]"
                                }`}
                              >
                                {quest.title}
                              </h4>
                              <p
                                className={`text-sm ${
                                  isCompleted ||
                                  dayStatus === "recent-past" ||
                                  dayStatus === "far-past"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {quest.description}
                              </p>
                            </div>
                          </div>
                          {dayStatus === "present" ? (
                            <button
                              onClick={() => handleQuestCompletion(quest.id)}
                              className={`${
                                isCompleted
                                  ? "bg-gray-300 hover:bg-gray-400"
                                  : "bg-[#f8b922] hover:bg-[#e5a91f]"
                              } text-white font-semibold rounded-full px-4 py-2 text-sm transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(248,185,34,0.5)] hover:shadow-[0_0_25px_rgba(248,185,34,0.8)]`}
                            >
                              {isCompleted ? "Completed" : "Complete"}
                            </button>
                          ) : dayStatus === "recent-past" ||
                            dayStatus === "far-past" ? (
                            isCompleted ? (
                              <Check className="text-[#5b06be]" />
                            ) : (
                              <span className="text-gray-400">Missed</span>
                            )
                          ) : (
                            <Lock className="text-gray-400" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
