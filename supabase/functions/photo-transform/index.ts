import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TransformRequest {
  imageUrl: string;
  fileName: string;
}

const runwareService = {
  async generateImage(imageUrl: string, prompt: string) {
    const apiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!apiKey) {
      throw new Error('RUNWARE_API_KEY not configured');
    }

    const payload = [
      {
        taskType: "authentication",
        apiKey: apiKey
      },
      {
        taskType: "imageInference", 
        taskUUID: crypto.randomUUID(),
        positivePrompt: prompt,
        inputImageURL: imageUrl,
        model: "runware:100@1",
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 4,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.3,
        steps: 10
      }
    ];

    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Runware API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Runware response:', result);
    
    if (result.data && result.data.length > 0) {
      const imageData = result.data.find((item: any) => item.taskType === 'imageInference');
      if (imageData && imageData.imageURL) {
        return imageData.imageURL;
      }
    }
    
    throw new Error('Failed to generate image from Runware API');
  }
};

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

    // Define the prompt for Bobbie Goods coloring book style with better preservation
    const prompt = "Convert this EXACT image into a black and white coloring book style. Keep the SAME person, SAME pose, SAME facial expression, SAME composition, and SAME background elements. IMPORTANT: Maintain the exact gender characteristics - if the person is male, keep masculine features; if female, keep feminine features. Only change the style to simple line art with clear outlines suitable for children to color. Do not add or remove any elements, people, or change the scene. Preserve all details of the original image including facial features, hair, clothing, and poses. White background, clean black lines only.";

    // Call Runware API to transform the image
    const transformedImageUrl = await runwareService.generateImage(imageUrl, prompt);

    // Download the transformed image
    const imageResponse = await fetch(transformedImageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download transformed image');
    }

    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Generate a unique filename for the transformed image
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const transformedFileName = `transformed_${timestamp}_${fileName}`;

    // Upload the transformed image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photo-transforms')
      .upload(`transformed/${transformedFileName}`, imageBuffer, {
        contentType: 'image/webp',
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