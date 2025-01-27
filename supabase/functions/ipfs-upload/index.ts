// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import "../types.d.ts";

console.log("IPFS Upload Function Started");

Deno.serve(async (req) => {
  // Add CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
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
  } catch (error: unknown) {
    console.error("Error in IPFS upload:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload to IPFS";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});
