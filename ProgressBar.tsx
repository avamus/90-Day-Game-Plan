'use client'

interface ProgressBarProps {
  progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="relative w-full h-3 bg-[#fff5e1] rounded-full overflow-hidden">
      <div 
        className="absolute left-0 top-0 h-full bg-[#f8b922] transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
