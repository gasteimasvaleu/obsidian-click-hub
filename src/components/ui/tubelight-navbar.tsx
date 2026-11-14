import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LucideIcon, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import amigoImg from "@/assets/more-menu/amigo-divino.png"
import devocionalImg from "@/assets/more-menu/devocional.png"
import oracoesImg from "@/assets/more-menu/oracoes.png"
import bibliafyImg from "@/assets/more-menu/bibliafy.png"
import colorirImg from "@/assets/more-menu/colorir.png"
import gamesImg from "@/assets/more-menu/games.png"
import comunidadeImg from "@/assets/more-menu/comunidade.png"
import perfilImg from "@/assets/more-menu/perfil.png"
import sobreImg from "@/assets/more-menu/sobre.png"
import politicaImg from "@/assets/more-menu/politica-familia.png"
import termosImg from "@/assets/more-menu/termos.png"

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
  { name: 'Amigo Divino', url: '/amigodivino', image: amigoImg },
  { name: 'Devocional', url: '/devocional', image: devocionalImg },
  { name: 'Orações', url: '/oracoes', image: oracoesImg },
  { name: 'Bíbliafy', url: '/audiofy', image: bibliafyImg },
  { name: 'Colorir', url: '/colorir', image: colorirImg },
  { name: 'Games', url: '/games', image: gamesImg },
  { name: 'Comunidade', url: '/comunidade', image: comunidadeImg },
  { name: 'Meu Perfil', url: '/profile', image: perfilImg },
  { name: 'Sobre', url: '/sobre', image: sobreImg },
  { name: 'Política Família', url: '/politica-familia', image: politicaImg },
  { name: 'Termos de Uso', url: '/termos-de-uso', image: termosImg },
]

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const light = true
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
                    "group h-auto whitespace-normal flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 active:scale-95",
                    isCurrentPage
                      ? "bg-primary/10 text-primary"
                      : light ? "text-muted-foreground hover:text-primary" : "text-primary/80 hover:text-primary"
                  )}
                >
                  <img src={menuItem.image} alt="" loading="lazy" width={44} height={44} className="h-11 w-11 object-contain transition-transform duration-200 group-active:scale-110 motion-reduce:transition-none" />
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
        <nav aria-label="Navegação principal" className="navigation-surface border-t border-border bg-background/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto grid h-16 max-w-xl grid-cols-5 items-center px-2">
            {items.map((item) => {
              const Icon = item.icon
              const vibrate = () => {
                if ('vibrate' in navigator && window.innerWidth < 768) navigator.vibrate(10)
              }

              if (item.isMenu) {
                return (
                  <button
                    type="button"
                    key={item.name}
                    aria-expanded={moreOpen}
                    aria-label="Mais"
                    onClick={() => { setMoreOpen(prev => !prev); vibrate() }}
                    className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="-mt-6 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-4 ring-background transition-transform active:scale-95">
                      {moreOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                    </span>
                    <span className={cn("mt-0.5 text-[11px] font-medium leading-none", moreOpen && "text-primary")}>Mais</span>
                  </button>
                )
              }

              const isActive = activeTab === item.name
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => { setActiveTab(item.name); setMoreOpen(false); vibrate() }}
                  className={cn(
                    "flex h-full min-w-0 flex-col items-center justify-center gap-1 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="max-w-[72px] truncate text-[11px] font-medium leading-none">
                    {item.shortName || item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
