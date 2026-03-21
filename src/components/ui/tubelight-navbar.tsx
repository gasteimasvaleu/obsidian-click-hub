import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LucideIcon, Gamepad2, BookOpen, Calendar, Palette, Bot, Users, User, Info, Shield, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

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
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          className,
        )}
      >
        {/* Safe-area black background strip */}
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
        </div>
      </div>

      {/* More menu sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="bg-background/95 backdrop-blur-xl border-t border-primary/20 rounded-t-3xl px-4 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
          <SheetHeader className="pb-2">
            <SheetTitle className="text-foreground text-lg">Mais opções</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 pt-2">
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
                    "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 active:scale-95",
                    isCurrentPage
                      ? "bg-primary/15 text-primary"
                      : "bg-muted/50 text-foreground/80 hover:bg-muted"
                  )}
                >
                  <MenuIcon size={28} strokeWidth={1.8} />
                  <span className="text-xs font-medium text-center leading-tight">{menuItem.name}</span>
                </button>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
