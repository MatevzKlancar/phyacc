// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("IPFS Upload Function Started");

Deno.serve(async (req) => {
  // Add CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Or your specific domain like 'http://localhost:3001'
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check if it's a POST request
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Get the form data
    const formData = await req.formData();
    console.log("Received form data with fields:", [...formData.keys()]);

    // Forward the request to pump.fun
    const response = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }

    // Get the response data
    const data = await response.json();
    console.log("IPFS upload response:", data);

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error in IPFS upload:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to upload to IPFS" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

/* To test locally:
1. Start Supabase: supabase start
2. Run: curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/ipfs-upload' \
   --header 'Authorization: Bearer YOUR-ANON-KEY' \
   --header 'Content-Type: multipart/form-data' \
   --form 'name="Test Token"' \
   --form 'symbol="TEST"' \
   --form 'description="Test Description"' \
   --form 'twitter="https://twitter.com/test"' \
   --form 'telegram="https://t.me/test"' \
   --form 'website="https://test.com"' \
   --form 'showName="true"' \
   --form 'file=@"/path/to/your/image.jpg"'
*/
