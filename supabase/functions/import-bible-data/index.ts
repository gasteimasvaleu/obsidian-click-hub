import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const bookCategoryMap: Record<string, string> = {
  'Gênesis': 'pentateuco', 'Êxodo': 'pentateuco', 'Levítico': 'pentateuco', 'Números': 'pentateuco', 'Deuteronômio': 'pentateuco',
  'Josué': 'historicos', 'Juízes': 'historicos', 'Rute': 'historicos',
  'I Samuel': 'historicos', 'II Samuel': 'historicos', 'I Reis': 'historicos', 'II Reis': 'historicos',
  'I Crônicas': 'historicos', 'II Crônicas': 'historicos', 'Esdras': 'historicos', 'Neemias': 'historicos', 'Ester': 'historicos',
  'Jó': 'poeticos', 'Salmos': 'poeticos', 'Provérbios': 'poeticos', 'Eclesiastes': 'poeticos', 'Cântico dos Cânticos': 'poeticos',
  'Isaías': 'profetas_maiores', 'Jeremias': 'profetas_maiores', 'Lamentações': 'profetas_maiores', 'Ezequiel': 'profetas_maiores', 'Daniel': 'profetas_maiores',
  'Oséias': 'profetas_menores', 'Joel': 'profetas_menores', 'Amós': 'profetas_menores', 'Abdias': 'profetas_menores', 'Jonas': 'profetas_menores',
  'Miquéias': 'profetas_menores', 'Naum': 'profetas_menores', 'Habacuc': 'profetas_menores', 'Sofonias': 'profetas_menores',
  'Ageu': 'profetas_menores', 'Zacarias': 'profetas_menores', 'Malaquias': 'profetas_menores',
  'Tobias': 'deuterocanonicos', 'Judite': 'deuterocanonicos', 'Sabedoria': 'deuterocanonicos', 'Eclesiástico': 'deuterocanonicos',
  'Baruc': 'deuterocanonicos', 'I Macabeus': 'deuterocanonicos', 'II Macabeus': 'deuterocanonicos',
  'São Mateus': 'evangelhos', 'São Marcos': 'evangelhos', 'São Lucas': 'evangelhos', 'São João': 'evangelhos',
  'Atos dos Apóstolos': 'historico',
  'Romanos': 'cartas_paulo', 'I Coríntios': 'cartas_paulo', 'II Coríntios': 'cartas_paulo', 'Gálatas': 'cartas_paulo',
  'Efésios': 'cartas_paulo', 'Filipenses': 'cartas_paulo', 'Colossenses': 'cartas_paulo',
  'I Tessalonicenses': 'cartas_paulo', 'II Tessalonicenses': 'cartas_paulo', 'I Timóteo': 'cartas_paulo', 'II Timóteo': 'cartas_paulo',
  'Tito': 'cartas_paulo', 'Filêmon': 'cartas_paulo', 'Hebreus': 'cartas_paulo',
  'São Tiago': 'cartas_gerais', 'I São Pedro': 'cartas_gerais', 'II São Pedro': 'cartas_gerais',
  'I São João': 'cartas_gerais', 'II São João': 'cartas_gerais', 'III São João': 'cartas_gerais', 'São Judas': 'cartas_gerais',
  'Apocalipse': 'profetico',
};

const canonicalOrder: string[] = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
  'Josué', 'Juízes', 'Rute', 'I Samuel', 'II Samuel', 'I Reis', 'II Reis',
  'I Crônicas', 'II Crônicas', 'Esdras', 'Neemias',
  'Tobias', 'Judite', 'Ester',
  'Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cântico dos Cânticos',
  'Sabedoria', 'Eclesiástico',
  'Isaías', 'Jeremias', 'Lamentações', 'Baruc', 'Ezequiel', 'Daniel',
  'Oséias', 'Joel', 'Amós', 'Abdias', 'Jonas', 'Miquéias', 'Naum', 'Habacuc', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'I Macabeus', 'II Macabeus',
  'São Mateus', 'São Marcos', 'São Lucas', 'São João',
  'Atos dos Apóstolos',
  'Romanos', 'I Coríntios', 'II Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses',
  'I Tessalonicenses', 'II Tessalonicenses', 'I Timóteo', 'II Timóteo', 'Tito', 'Filêmon', 'Hebreus',
  'São Tiago', 'I São Pedro', 'II São Pedro', 'I São João', 'II São João', 'III São João', 'São Judas',
  'Apocalipse',
];

function getAbbrev(name: string): string {
  const m: Record<string, string> = {
    'Gênesis': 'gn', 'Êxodo': 'ex', 'Levítico': 'lv', 'Números': 'nm', 'Deuteronômio': 'dt',
    'Josué': 'js', 'Juízes': 'jz', 'Rute': 'rt',
    'I Samuel': '1sm', 'II Samuel': '2sm', 'I Reis': '1rs', 'II Reis': '2rs',
    'I Crônicas': '1cr', 'II Crônicas': '2cr', 'Esdras': 'ed', 'Neemias': 'ne',
    'Tobias': 'tb', 'Judite': 'jdt', 'Ester': 'et',
    'Jó': 'jo', 'Salmos': 'sl', 'Provérbios': 'pv', 'Eclesiastes': 'ecl', 'Cântico dos Cânticos': 'ct',
    'Sabedoria': 'sb', 'Eclesiástico': 'eclo',
    'Isaías': 'is', 'Jeremias': 'jr', 'Lamentações': 'lm', 'Baruc': 'br', 'Ezequiel': 'ez', 'Daniel': 'dn',
    'Oséias': 'os', 'Joel': 'jl', 'Amós': 'am', 'Abdias': 'ab', 'Jonas': 'jn',
    'Miquéias': 'mq', 'Naum': 'na', 'Habacuc': 'hc', 'Sofonias': 'sf', 'Ageu': 'ag', 'Zacarias': 'zc', 'Malaquias': 'ml',
    'I Macabeus': '1mc', 'II Macabeus': '2mc',
    'São Mateus': 'mt', 'São Marcos': 'mc', 'São Lucas': 'lc', 'São João': 'jo',
    'Atos dos Apóstolos': 'at',
    'Romanos': 'rm', 'I Coríntios': '1cor', 'II Coríntios': '2cor', 'Gálatas': 'gl', 'Efésios': 'ef',
    'Filipenses': 'fl', 'Colossenses': 'cl', 'I Tessalonicenses': '1ts', 'II Tessalonicenses': '2ts',
    'I Timóteo': '1tm', 'II Timóteo': '2tm', 'Tito': 'tt', 'Filêmon': 'fm', 'Hebreus': 'hb',
    'São Tiago': 'tg', 'I São Pedro': '1pd', 'II São Pedro': '2pd',
    'I São João': '1jo', 'II São João': '2jo', 'III São João': '3jo', 'São Judas': 'jd',
    'Apocalipse': 'ap',
  };
  return m[name] || name.toLowerCase().substring(0, 3);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse batch params: startBook (0-indexed), batchSize (default 5)
    const url = new URL(req.url);
    const startBook = parseInt(url.searchParams.get('start') || '0');
    const batchSize = parseInt(url.searchParams.get('batch') || '5');
    const cleanFirst = url.searchParams.get('clean') === 'true';

    console.log(`Import batch: start=${startBook}, batch=${batchSize}, clean=${cleanFirst}`);

    // Only clean on the first batch
    if (cleanFirst) {
      console.log('Cleaning user data...');
      await supabaseClient.from('user_favorite_verses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabaseClient.from('user_verse_notes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabaseClient.from('user_reading_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      console.log('Cleaning existing bible data...');
      await supabaseClient.from('bible_verses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabaseClient.from('bible_chapters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabaseClient.from('bible_books').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      console.log('Clean completed.');
      
      // If cleanOnly, return immediately
      if (url.searchParams.get('cleanOnly') === 'true') {
        return new Response(JSON.stringify({ success: true, action: 'clean' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
        });
      }
    }

    // Fetch Bible data
    console.log('Fetching Ave Maria Bible JSON...');
    const response = await fetch('https://raw.githubusercontent.com/fidalgobr/bibliaAveMariaJSON/main/bibliaAveMaria.json');
    if (!response.ok) throw new Error(`Failed to fetch Bible data: ${response.statusText}`);
    const bibleData = await response.json();

    const allBooks: Array<{ book: any; testament: string }> = [
      ...bibleData.antigoTestamento.map((b: any) => ({ book: b, testament: 'antigo' })),
      ...bibleData.novoTestamento.map((b: any) => ({ book: b, testament: 'novo' })),
    ];

    const booksToProcess = allBooks.slice(startBook, startBook + batchSize);
    let booksImported = 0;
    let chaptersImported = 0;
    let versesImported = 0;

    for (const { book, testament } of booksToProcess) {
      const bookName = book.nome;
      const category = bookCategoryMap[bookName] || 'outros';
      const bookOrder = canonicalOrder.indexOf(bookName) + 1 || (startBook + booksImported + 100);

      console.log(`Processing: ${bookName} (${startBook + booksImported + 1}/${allBooks.length})`);

      const { data: bookData, error: bookError } = await supabaseClient
        .from('bible_books')
        .insert({
          name: bookName, abbrev: getAbbrev(bookName), testament,
          book_order: bookOrder, chapters_count: book.capitulos.length, category,
        })
        .select().single();

      if (bookError) throw bookError;
      booksImported++;

      for (const cap of book.capitulos) {
        const { data: chapterData, error: chapterError } = await supabaseClient
          .from('bible_chapters')
          .insert({ book_id: bookData.id, chapter_number: cap.capitulo, verses_count: cap.versiculos.length })
          .select().single();

        if (chapterError) throw chapterError;
        chaptersImported++;

        const verses = cap.versiculos.map((v: any) => ({
          chapter_id: chapterData.id, verse_number: v.versiculo, text: v.texto,
        }));

        for (let i = 0; i < verses.length; i += 500) {
          const { error } = await supabaseClient.from('bible_verses').insert(verses.slice(i, i + 500));
          if (error) throw error;
        }
        versesImported += verses.length;
      }

      console.log(`Completed: ${bookName}`);
    }

    const nextStart = startBook + batchSize;
    const hasMore = nextStart < allBooks.length;

    return new Response(
      JSON.stringify({
        success: true,
        batch: { start: startBook, processed: booksImported, total: allBooks.length },
        imported: { books: booksImported, chapters: chaptersImported, verses: versesImported },
        hasMore,
        nextStart: hasMore ? nextStart : null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', details: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
