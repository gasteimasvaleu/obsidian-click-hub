import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Category mapping for each book name
const bookCategoryMap: Record<string, string> = {
  // Pentateuco
  'Gênesis': 'pentateuco',
  'Êxodo': 'pentateuco',
  'Levítico': 'pentateuco',
  'Números': 'pentateuco',
  'Deuteronômio': 'pentateuco',
  // Históricos
  'Josué': 'historicos',
  'Juízes': 'historicos',
  'Rute': 'historicos',
  'I Samuel': 'historicos',
  'II Samuel': 'historicos',
  'I Reis': 'historicos',
  'II Reis': 'historicos',
  'I Crônicas': 'historicos',
  'II Crônicas': 'historicos',
  'Esdras': 'historicos',
  'Neemias': 'historicos',
  'Ester': 'historicos',
  // Poéticos
  'Jó': 'poeticos',
  'Salmos': 'poeticos',
  'Provérbios': 'poeticos',
  'Eclesiastes': 'poeticos',
  'Cântico dos Cânticos': 'poeticos',
  // Profetas Maiores
  'Isaías': 'profetas_maiores',
  'Jeremias': 'profetas_maiores',
  'Lamentações': 'profetas_maiores',
  'Ezequiel': 'profetas_maiores',
  'Daniel': 'profetas_maiores',
  // Profetas Menores
  'Oséias': 'profetas_menores',
  'Joel': 'profetas_menores',
  'Amós': 'profetas_menores',
  'Abdias': 'profetas_menores',
  'Jonas': 'profetas_menores',
  'Miquéias': 'profetas_menores',
  'Naum': 'profetas_menores',
  'Habacuc': 'profetas_menores',
  'Sofonias': 'profetas_menores',
  'Ageu': 'profetas_menores',
  'Zacarias': 'profetas_menores',
  'Malaquias': 'profetas_menores',
  // Deuterocanônicos
  'Tobias': 'deuterocanonicos',
  'Judite': 'deuterocanonicos',
  'Sabedoria': 'deuterocanonicos',
  'Eclesiástico': 'deuterocanonicos',
  'Baruc': 'deuterocanonicos',
  'I Macabeus': 'deuterocanonicos',
  'II Macabeus': 'deuterocanonicos',
  // Evangelhos
  'São Mateus': 'evangelhos',
  'São Marcos': 'evangelhos',
  'São Lucas': 'evangelhos',
  'São João': 'evangelhos',
  // Histórico NT
  'Atos dos Apóstolos': 'historico',
  // Cartas Paulinas
  'Romanos': 'cartas_paulo',
  'I Coríntios': 'cartas_paulo',
  'II Coríntios': 'cartas_paulo',
  'Gálatas': 'cartas_paulo',
  'Efésios': 'cartas_paulo',
  'Filipenses': 'cartas_paulo',
  'Colossenses': 'cartas_paulo',
  'I Tessalonicenses': 'cartas_paulo',
  'II Tessalonicenses': 'cartas_paulo',
  'I Timóteo': 'cartas_paulo',
  'II Timóteo': 'cartas_paulo',
  'Tito': 'cartas_paulo',
  'Filêmon': 'cartas_paulo',
  'Hebreus': 'cartas_paulo',
  // Cartas Gerais
  'São Tiago': 'cartas_gerais',
  'I São Pedro': 'cartas_gerais',
  'II São Pedro': 'cartas_gerais',
  'I São João': 'cartas_gerais',
  'II São João': 'cartas_gerais',
  'III São João': 'cartas_gerais',
  'São Judas': 'cartas_gerais',
  // Profético
  'Apocalipse': 'profetico',
};

// Canonical book order for the Catholic Bible
const canonicalOrder: string[] = [
  // AT
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
  'Josué', 'Juízes', 'Rute', 'I Samuel', 'II Samuel', 'I Reis', 'II Reis',
  'I Crônicas', 'II Crônicas', 'Esdras', 'Neemias',
  'Tobias', 'Judite', 'Ester',
  'Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cântico dos Cânticos',
  'Sabedoria', 'Eclesiástico',
  'Isaías', 'Jeremias', 'Lamentações', 'Baruc', 'Ezequiel', 'Daniel',
  'Oséias', 'Joel', 'Amós', 'Abdias', 'Jonas', 'Miquéias', 'Naum', 'Habacuc', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'I Macabeus', 'II Macabeus',
  // NT
  'São Mateus', 'São Marcos', 'São Lucas', 'São João',
  'Atos dos Apóstolos',
  'Romanos', 'I Coríntios', 'II Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses',
  'I Tessalonicenses', 'II Tessalonicenses', 'I Timóteo', 'II Timóteo', 'Tito', 'Filêmon', 'Hebreus',
  'São Tiago', 'I São Pedro', 'II São Pedro', 'I São João', 'II São João', 'III São João', 'São Judas',
  'Apocalipse',
];

function getAbbrev(name: string): string {
  const abbrevMap: Record<string, string> = {
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
  return abbrevMap[name] || name.toLowerCase().substring(0, 3);
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

    console.log('Starting Catholic Bible (Ave Maria) import...');

    // Step 1: Clean up user data that references bible IDs
    console.log('Cleaning user data...');
    await supabaseClient.from('user_favorite_verses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseClient.from('user_verse_notes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseClient.from('user_reading_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Step 2: Clean existing bible data (order matters for FK)
    console.log('Cleaning existing bible data...');
    await supabaseClient.from('bible_verses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseClient.from('bible_chapters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseClient.from('bible_books').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Step 3: Fetch Ave Maria Bible data
    console.log('Fetching Ave Maria Bible JSON...');
    const response = await fetch('https://raw.githubusercontent.com/fidalgobr/bibliaAveMariaJSON/main/bibliaAveMaria.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch Bible data: ${response.statusText}`);
    }
    const bibleData = await response.json();

    let booksImported = 0;
    let chaptersImported = 0;
    let versesImported = 0;

    // Combine AT and NT into a single list with testament info
    const allBooks: Array<{ book: any; testament: string }> = [
      ...bibleData.antigoTestamento.map((b: any) => ({ book: b, testament: 'antigo' })),
      ...bibleData.novoTestamento.map((b: any) => ({ book: b, testament: 'novo' })),
    ];

    // Process each book
    for (const { book, testament } of allBooks) {
      const bookName = book.nome;
      const category = bookCategoryMap[bookName] || 'outros';
      const bookOrder = canonicalOrder.indexOf(bookName) + 1 || (booksImported + 100);

      console.log(`Processing book: ${bookName} (order: ${bookOrder}, category: ${category})`);

      const { data: bookData, error: bookError } = await supabaseClient
        .from('bible_books')
        .insert({
          name: bookName,
          abbrev: getAbbrev(bookName),
          testament,
          book_order: bookOrder,
          chapters_count: book.capitulos.length,
          category,
        })
        .select()
        .single();

      if (bookError) {
        console.error(`Error inserting book ${bookName}:`, bookError);
        throw bookError;
      }
      booksImported++;

      // Process chapters
      for (const cap of book.capitulos) {
        const { data: chapterData, error: chapterError } = await supabaseClient
          .from('bible_chapters')
          .insert({
            book_id: bookData.id,
            chapter_number: cap.capitulo,
            verses_count: cap.versiculos.length,
          })
          .select()
          .single();

        if (chapterError) {
          console.error(`Error inserting chapter ${cap.capitulo} of ${bookName}:`, chapterError);
          throw chapterError;
        }
        chaptersImported++;

        // Insert verses in batches of 500
        const verses = cap.versiculos.map((v: any) => ({
          chapter_id: chapterData.id,
          verse_number: v.versiculo,
          text: v.texto,
        }));

        for (let i = 0; i < verses.length; i += 500) {
          const batch = verses.slice(i, i + 500);
          const { error: versesError } = await supabaseClient
            .from('bible_verses')
            .insert(batch);

          if (versesError) {
            console.error(`Error inserting verses for chapter ${cap.capitulo} of ${bookName}:`, versesError);
            throw versesError;
          }
        }
        versesImported += verses.length;
      }

      console.log(`Completed book: ${bookName} (${booksImported}/${allBooks.length})`);
    }

    console.log('Catholic Bible (Ave Maria) import completed successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        version: 'Ave Maria (Católica)',
        imported: {
          books: booksImported,
          chapters: chaptersImported,
          verses: versesImported,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.toString() : String(error);

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorDetails,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
