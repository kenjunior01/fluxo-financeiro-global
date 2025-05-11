
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MARKET_AUX_API_KEY = Deno.env.get("MARKET_AUX_API_KEY");
const BASE_URL = "https://api.marketaux.com/v1/news/all";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols = "", limit = 5, language = "pt" } = await req.json();

    // Construct API URL
    const url = new URL(BASE_URL);
    url.searchParams.append("api_token", MARKET_AUX_API_KEY!);
    url.searchParams.append("language", language);
    url.searchParams.append("limit", limit.toString());
    
    if (symbols) {
      url.searchParams.append("symbols", symbols);
    }
    
    url.searchParams.append("filter_entities", "true");
    url.searchParams.append("sort", "published_at");

    console.log(`Fetching news from MarketAux with params: symbols=${symbols}, limit=${limit}`);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`MarketAux API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Check for API error messages
    if (data.error) {
      throw new Error(data.error.message || "MarketAux API error");
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in get-market-news function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
