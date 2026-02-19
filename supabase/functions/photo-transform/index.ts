import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TransformRequest {
  imageUrl: string;
  fileName: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const { imageUrl, fileName }: TransformRequest = await req.json();

    if (!imageUrl || !fileName) {
      return new Response('Missing imageUrl or fileName', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    console.log('Processing image transformation for:', fileName);
    console.log('Image URL (first 100 chars):', imageUrl.substring(0, 100));
    console.log('Using Lovable AI Gateway with Gemini model');

    // Optimized prompt for coloring book pages using Gemini
    const prompt = `Converta esta foto de retrato humano em uma página de livro de colorir em preto e branco.

REGRAS IMPORTANTES:
1. Mantenha EXATAMENTE as feições faciais, expressão facial e penteado da pessoa original
2. Use apenas linhas pretas finas e limpas sobre fundo totalmente branco
3. Crie contornos claros e bem definidos adequados para colorir
4. Simplifique detalhes menores mas PRESERVE a semelhança e identidade da pessoa
5. Estilo de ilustração para livro de colorir infantil
6. SEM preenchimentos, sombreamentos ou gradientes - apenas linhas de contorno
7. A imagem deve parecer uma página de livro de colorir profissional`;

    console.log('Calling Lovable AI Gateway...');

    // Call Lovable AI Gateway with the image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Limite de requisições excedido. Tente novamente em alguns segundos.'
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Créditos insuficientes. Por favor, adicione créditos à sua conta.'
          }),
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error(`Lovable AI Gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Lovable AI response received');

    // Extract the generated image from the response
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImage) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('Failed to generate image - no image in response');
    }

    console.log('Image generated successfully, processing for storage...');

    // Extract base64 data (remove the data:image/... prefix if present)
    let base64Data = generatedImage;
    let contentType = 'image/png';
    
    if (generatedImage.startsWith('data:')) {
      const matches = generatedImage.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        contentType = matches[1];
        base64Data = matches[2];
      }
    }

    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Generate a unique filename for the transformed image
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const transformedFileName = `transformed_${timestamp}_${fileName.replace(/\.[^/.]+$/, '')}.${extension}`;

    console.log('Uploading to storage:', transformedFileName);

    // Upload the transformed image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photo-transforms')
      .upload(`transformed/${transformedFileName}`, bytes, {
        contentType: contentType,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to save transformed image: ${uploadError.message}`);
    }

    // Get public URL for the transformed image
    const { data: publicUrlData } = supabase.storage
      .from('photo-transforms')
      .getPublicUrl(`transformed/${transformedFileName}`);

    console.log('Image transformation completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        transformedImageUrl: publicUrlData.publicUrl,
        originalImageUrl: imageUrl,
        fileName: transformedFileName
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in photo-transform function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
