import { SPLIT_BAR } from "@/components/ui/bubble-section";
import { getBookIllustration } from "@/data/bookIllustrations";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/GlassCard";
import { BookOpen, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";

export default function BibliaPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: books, isLoading } = useQuery({
    queryKey: ['bible-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bible_books')
        .select('*')
        .order('book_order');
      if (error) throw error;
      return data;
    }
  });

  const antigoTestamento = books?.filter(b => b.testament === 'antigo') || [];
  const novoTestamento = books?.filter(b => b.testament === 'novo') || [];

  const filterBooks = (booksList: any[]) => {
    if (!searchTerm) return booksList;
    return booksList.filter(book => 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.abbrev.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const categories = {
    antigo: [
      { name: 'Pentateuco', filter: 'pentateuco' },
      { name: 'Históricos', filter: 'historicos' },
      { name: 'Poéticos', filter: 'poeticos' },
      { name: 'Profetas Maiores', filter: 'profetas_maiores' },
      { name: 'Profetas Menores', filter: 'profetas_menores' },
      { name: 'Deuterocanônicos', filter: 'deuterocanonicos' }
    ],
    novo: [
      { name: 'Evangelhos', filter: 'evangelhos' },
      { name: 'Históricos', filter: 'historico' },
      { name: 'Cartas Paulinas', filter: 'cartas_paulo' },
      { name: 'Cartas Gerais', filter: 'cartas_gerais' },
      { name: 'Profético', filter: 'profetico' }
    ]
  };

  const GRADIENT_PALETTE = [
    'from-blue-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-yellow-400 to-orange-500',
    'from-red-500 to-pink-500',
    'from-lime-400 to-green-500',
    'from-green-500 to-cyan-500',
    'from-pink-500 to-red-500',
    'from-indigo-500 to-blue-500'
  ];

  const BookCard = ({ book, index }: { book: any; index: number }) => (
    <GlassCard
      hoverable
      pressable
      onClick={() => navigate(`/biblia/${book.id}`)}
      className="p-4 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {getBookIllustration(book.name) ? (
          <img
            src={getBookIllustration(book.name)}
            alt=""
            loading="lazy"
            className="h-14 w-14 flex-shrink-0 object-contain"
          />
        ) : (
          <div className={`p-3 rounded-lg bg-gradient-to-br ${GRADIENT_PALETTE[index % GRADIENT_PALETTE.length]}`}>
            <BookOpen className="text-white" size={24} />
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-foreground">{book.name}</h3>
          <p className="text-muted-foreground text-base">{book.chapters_count} capítulos</p>
        </div>
      </div>
    </GlassCard>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground text-xl">Carregando livros...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <FuturisticNavbar />
      
      <div className="container mx-auto px-4 pt-20 max-w-[58rem]">
        {/* Video animation */}
        <div className="flex justify-center w-full mb-8">
          <GlassCard className="w-full max-w-4xl p-0 overflow-hidden">
            <video
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/video_33032f19_1763462060427.mp4"
              className="aspect-video w-full h-auto object-cover"
              autoPlay
              muted
              playsInline
              preload="metadata"
              onEnded={(e) => {
                e.currentTarget.currentTime = 0;
              }}
              onError={(e) => console.error("Biblia video error:", e)}
              onStalled={() => console.warn("Biblia video stalled")}
            />
          </GlassCard>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <SectionHeader title="Bíblia Interativa" description="Explore as Sagradas Escrituras de forma interativa e organize seus estudos" className="mb-6" />
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Buscar livro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="antigo" className="w-full">
          <TabsList className={`${SPLIT_BAR} !h-auto p-0 mb-6`}>
            <TabsTrigger value="antigo" className="h-11 flex-1 min-w-0 rounded-none px-2 text-xs sm:text-sm text-muted-foreground shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none"><span className="truncate">Antigo Testamento ({antigoTestamento.length})</span></TabsTrigger>
            <TabsTrigger value="novo" className="h-11 flex-1 min-w-0 rounded-none px-2 text-xs sm:text-sm text-muted-foreground shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none"><span className="truncate">Novo Testamento ({novoTestamento.length})</span></TabsTrigger>
          </TabsList>

          <TabsContent value="antigo">
            {categories.antigo.map(category => {
              const categoryBooks = filterBooks(antigoTestamento.filter(b => b.category === category.filter));
              if (categoryBooks.length === 0) return null;
              
              return (
                <div key={category.filter} className="mb-8">
                  <SectionHeader title={category.name} className="mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryBooks.map((book, idx) => <BookCard key={book.id} book={book} index={idx} />)}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="novo">
            {categories.novo.map(category => {
              const categoryBooks = filterBooks(novoTestamento.filter(b => b.category === category.filter));
              if (categoryBooks.length === 0) return null;
              
              return (
                <div key={category.filter} className="mb-8">
                  <SectionHeader title={category.name} className="mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryBooks.map((book, idx) => <BookCard key={book.id} book={book} index={idx} />)}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
