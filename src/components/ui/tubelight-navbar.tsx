import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LucideIcon, Gamepad2, BookOpen, Calendar, Palette, Bot, Users, User, Info, Shield, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
  shortName?: string
  isMenu?: boolean
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

const moreMenuItems = [
  { name: 'Games', url: '/games', icon: Gamepad2 },
  { name: 'Bíblia Interativa', url: '/biblia', icon: BookOpen },
  { name: 'Devocional Diário', url: '/devocional', icon: Calendar },
  { name: 'Colorir', url: '/colorir', icon: Palette },
  { name: 'Amigo Divino', url: '/amigodivino', icon: Bot },
  { name: 'Comunidade', url: '/comunidade', icon: Users },
  { name: 'Meu Perfil', url: '/profile', icon: User },
  { name: 'Sobre', url: '/sobre', icon: Info },
  { name: 'Política Família', url: '/politica-familia', icon: Shield },
  { name: 'Termos de Uso', url: '/termos-de-uso', icon: FileText },
]

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

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
    <>
      {/* Backdrop to close menu */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* More menu panel — floats above navbar */}
      {moreOpen && (
        <div
          className="fixed left-3 right-3 z-[45] rounded-2xl border border-primary/20 bg-background/80 backdrop-blur-xl shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)] overflow-hidden"
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 4.5rem)' }}
        >
          <div className="grid grid-cols-3 gap-2 p-3">
            {moreMenuItems.map((menuItem) => {
              const MenuIcon = menuItem.icon
              const isCurrentPage = location.pathname === menuItem.url
              return (
                <button
                  key={menuItem.url}
                  onClick={() => {
                    navigate(menuItem.url)
                    setMoreOpen(false)
                    if ('vibrate' in navigator && window.innerWidth < 768) {
                      navigator.vibrate(10)
                    }
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 active:scale-95",
                    isCurrentPage
                      ? "bg-primary/15 text-primary shadow-[0_0_12px_-2px_hsl(var(--primary)/0.4)]"
                      : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <MenuIcon size={26} strokeWidth={1.8} />
                  <span className="text-[11px] font-medium text-center leading-tight">{menuItem.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          className,
        )}
      >
        <div className="bg-black/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-center px-3 pt-2 pb-2">
            <div className="flex items-center gap-1.5 md:gap-3 glass border border-primary/20 backdrop-blur-lg py-2 px-2 rounded-2xl shadow-lg">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = item.isMenu ? moreOpen : activeTab === item.name

                if (item.isMenu) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setMoreOpen(prev => !prev)
                        if ('vibrate' in navigator && window.innerWidth < 768) {
                          navigator.vibrate(10)
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
                        {moreOpen ? <X size={24} strokeWidth={2.5} /> : <Icon size={24} strokeWidth={2.5} />}
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
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                            <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                            <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                            <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                          </div>
                        </motion.div>
                      )}
                    </button>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    onClick={() => {
                      setActiveTab(item.name)
                      setMoreOpen(false)
                      if ('vibrate' in navigator && window.innerWidth < 768) {
                        navigator.vibrate(10)
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
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
        </div>
      </div>
    </>
  )
}
