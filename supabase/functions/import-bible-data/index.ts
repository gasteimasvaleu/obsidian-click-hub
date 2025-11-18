import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting Bible data import...');

    // Fetch ACF Bible data from GitHub
    const response = await fetch('https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/acf.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch Bible data: ${response.statusText}`);
    }
    const bibleData = await response.json();

    let booksImported = 0;
    let chaptersImported = 0;
    let versesImported = 0;

    // Helper to determine testament from group
    const getTestament = (book: any): string => {
      const oldTestamentGroups = ['pentateuco', 'historicos', 'poeticos', 'profetas_maiores', 'profetas_menores'];
      if (book.testament === 'VT' || oldTestamentGroups.includes(book.group)) {
        return 'antigo';
      }
      return 'novo';
    };

    // Helper to get abbreviation
    const getAbbrev = (book: any): string => {
      if (typeof book.abbrev === 'string') return book.abbrev;
      if (book.abbrev?.pt) return book.abbrev.pt;
      return book.name.toLowerCase().substring(0, 2);
    };

    // Process each book
    for (const book of bibleData) {
      console.log(`Processing book: ${book.name}`);
      
      // Insert book
      const { data: bookData, error: bookError } = await supabaseClient
        .from('bible_books')
        .insert({
          name: book.name,
          abbrev: getAbbrev(book),
          testament: getTestament(book),
          book_order: booksImported + 1,
          chapters_count: book.chapters.length,
          category: book.group || 'outros'
        })
        .select()
        .single();

      if (bookError) {
        console.error(`Error inserting book ${book.name}:`, bookError);
        throw bookError;
      }
      booksImported++;

      // Process chapters
      for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
        const chapter = book.chapters[chapterIndex];
        
        const { data: chapterData, error: chapterError } = await supabaseClient
          .from('bible_chapters')
          .insert({
            book_id: bookData.id,
            chapter_number: chapterIndex + 1,
            verses_count: Object.keys(chapter).length
          })
          .select()
          .single();

        if (chapterError) {
          console.error(`Error inserting chapter ${chapterIndex + 1} of ${book.name}:`, chapterError);
          throw chapterError;
        }
        chaptersImported++;

        // Process verses in batches
        const verses = Object.entries(chapter).map(([verseNum, verseText]) => ({
          chapter_id: chapterData.id,
          verse_number: parseInt(verseNum),
          text: verseText as string
        }));

        const { error: versesError } = await supabaseClient
          .from('bible_verses')
          .insert(verses);

        if (versesError) {
          console.error(`Error inserting verses for chapter ${chapterIndex + 1} of ${book.name}:`, versesError);
          throw versesError;
        }
        versesImported += verses.length;
      }
      
      console.log(`Completed book: ${book.name} (${booksImported}/${bibleData.length})`);
    }

    console.log('Bible data import completed successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        imported: {
          books: booksImported,
          chapters: chaptersImported,
          verses: versesImported
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
