import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
  shortName?: string
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const currentItem = items.find(item => item.url === location.pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [location.pathname, items])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-6",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 md:gap-3 glass border border-primary/20 backdrop-blur-lg py-2 px-2 rounded-2xl shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => {
                setActiveTab(item.name);
                
                // Haptic feedback em dispositivos móveis
                if ('vibrate' in navigator && window.innerWidth < 768) {
                  navigator.vibrate(10);
                }
              }}
              className={cn(
                "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300",
                "min-w-[48px] min-h-[48px] flex items-center justify-center",
                "px-3 py-3 md:px-6 md:py-2",
                "text-primary/80 hover:text-primary",
                "active:scale-95",
                isActive && "bg-primary/10 text-primary",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon size={24} strokeWidth={2.5} />
                <span className={cn(
                  "transition-all duration-200 overflow-hidden whitespace-nowrap",
                  isActive ? "inline max-w-[200px] opacity-100" : "hidden md:inline md:max-w-[200px] md:opacity-100"
                )}>
                  {item.shortName || item.name}
                </span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}