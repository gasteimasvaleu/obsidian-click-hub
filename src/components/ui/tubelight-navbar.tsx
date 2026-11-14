import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LucideIcon, Users, User, Info, Shield, FileText, X, Bot, Heart, HandHeart, Music, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  { name: 'Amigo Divino', url: '/amigodivino', icon: Bot },
  { name: 'Devocional', url: '/devocional', icon: Heart },
  { name: 'Orações', url: '/oracoes', icon: HandHeart },
  { name: 'Bíbliafy', url: '/audiofy', icon: Music },
  { name: 'Games', url: '/games', icon: Gamepad2 },
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
  const light = location.pathname === "/"
  const reducedMotion = useReducedMotion()
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    const currentItem = items.find(item => item.url === location.pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [location.pathname, items])

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
          className={cn("fixed left-3 right-3 z-[45] rounded-2xl border border-border bg-popover/95 backdrop-blur-xl shadow-lg overflow-hidden", light && "navigation-light")}
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 4.5rem)' }}
        >
          <div className="grid grid-cols-3 gap-2 p-3">
            {moreMenuItems.map((menuItem) => {
              const MenuIcon = menuItem.icon
              const isCurrentPage = location.pathname === menuItem.url
              return (
                 <Button variant="ghost"
                    type="button"
                  key={menuItem.url}
                  onClick={() => {
                    navigate(menuItem.url)
                    setMoreOpen(false)
                    if ('vibrate' in navigator && window.innerWidth < 768) {
                      navigator.vibrate(10)
                    }
                  }}
                  className={cn(
                    "h-auto whitespace-normal flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 active:scale-95",
                    isCurrentPage
                      ? "bg-primary/10 text-primary"
                      : light ? "text-muted-foreground hover:text-primary" : "text-primary/80 hover:text-primary"
                  )}
                >
                  <MenuIcon size={26} strokeWidth={1.8} />
                  <span className="text-[11px] font-medium text-center leading-tight">{menuItem.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          className,
          light && "navigation-light",
        )}
      >
        <div className="navigation-surface bg-background/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-center px-2 pt-2 pb-2">
            <div className={cn("grid w-full max-w-xl grid-cols-6 py-1.5 px-1", !light && "glass border border-primary/20 backdrop-blur-lg rounded-2xl shadow-lg")}>
              {items.map((item) => {
                const Icon = item.icon
                const isActive = item.isMenu ? moreOpen : activeTab === item.name

                if (item.isMenu) {
                  return (
                    <Button variant="ghost"
                      key={item.name}
                      aria-expanded={moreOpen}
                      aria-label="Mais"
                      onClick={() => {
                        setMoreOpen(prev => !prev)
                        if ('vibrate' in navigator && window.innerWidth < 768) {
                          navigator.vibrate(10)
                        }
                      }}
                      className={cn(
                        "relative min-w-0 cursor-pointer rounded-xl transition-all duration-300",
                        "h-[52px] flex flex-col items-center justify-center gap-1 px-0.5 [&_svg]:size-[21px]",
                        light ? "text-muted-foreground hover:text-primary" : "text-primary/80 hover:text-primary",
                        "active:scale-95",
                        isActive && "bg-primary/10 text-primary",
                      )}
                    >
                      {moreOpen ? <X size={21} strokeWidth={2.5} /> : <Icon size={21} strokeWidth={2.5} />}
                      <span className="w-full truncate text-center text-[9px] font-semibold leading-none">
                        {item.shortName || item.name}
                      </span>
                      {isActive && !light && !reducedMotion && (
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
                    </Button>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      setActiveTab(item.name)
                      setMoreOpen(false)
                      if ('vibrate' in navigator && window.innerWidth < 768) {
                        navigator.vibrate(10)
                      }
                    }}
                    className={cn(
                      "relative min-w-0 cursor-pointer rounded-xl transition-all duration-300",
                      "h-[52px] flex flex-col items-center justify-center gap-1 px-0.5 [&_svg]:size-[21px]",
                      light ? "text-muted-foreground hover:text-primary" : "text-primary/80 hover:text-primary",
                      "active:scale-95",
                      isActive && "bg-primary/10 text-primary",
                    )}
                  >
                    <Icon size={21} strokeWidth={2.5} />
                    <span className="w-full truncate text-center text-[9px] font-semibold leading-none">
                      {item.shortName || item.name}
                    </span>
                    {isActive && !light && !reducedMotion && (
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
