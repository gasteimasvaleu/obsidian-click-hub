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
      { name: 'Profetas Menores', filter: 'profetas_menores' }
    ],
    novo: [
      { name: 'Evangelhos', filter: 'evangelhos' },
      { name: 'Históricos', filter: 'historicos' },
      { name: 'Cartas Paulinas', filter: 'cartas_paulinas' },
      { name: 'Cartas Gerais', filter: 'cartas_gerais' },
      { name: 'Profético', filter: 'profetico' }
    ]
  };

  const BookCard = ({ book }: any) => (
    <GlassCard
      hoverable
      pressable
      onClick={() => navigate(`/biblia/${book.id}`)}
      className="p-4 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
          <BookOpen className="text-white" size={24} />
        </div>
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
      
      <div className="container mx-auto px-4 pt-20">
        {/* Video animation */}
        <div className="flex justify-center w-full mb-8">
          <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
            <video
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/video_33032f19_1763462060427.mp4"
              className="w-full h-auto"
              style={{ maxHeight: '300px' }}
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

        <GlassCard className="mb-6 text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Bíblia Interativa
          </h1>
          <p className="text-muted-foreground text-base">
            Explore as Sagradas Escrituras de forma interativa e organize seus estudos
          </p>
        </GlassCard>

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
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="antigo">Antigo Testamento ({antigoTestamento.length})</TabsTrigger>
            <TabsTrigger value="novo">Novo Testamento ({novoTestamento.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="antigo">
            {categories.antigo.map(category => {
              const categoryBooks = filterBooks(antigoTestamento.filter(b => b.category === category.filter));
              if (categoryBooks.length === 0) return null;
              
              return (
                <div key={category.filter} className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">{category.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryBooks.map(book => <BookCard key={book.id} book={book} />)}
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
                  <h2 className="text-xl font-semibold text-foreground mb-4">{category.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryBooks.map(book => <BookCard key={book.id} book={book} />)}
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
