
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");
const BASE_URL = "https://www.alphavantage.co/query";

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
    const { symbol, function: func = "GLOBAL_QUOTE" } = await req.json();

    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "Symbol parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Construct API URL
    const url = new URL(BASE_URL);
    url.searchParams.append("function", func);
    url.searchParams.append("symbol", symbol);
    url.searchParams.append("apikey", ALPHA_VANTAGE_API_KEY!);

    if (func === "TIME_SERIES_INTRADAY") {
      url.searchParams.append("interval", "5min");
      url.searchParams.append("outputsize", "compact");
    } else if (func === "TIME_SERIES_DAILY") {
      url.searchParams.append("outputsize", "compact");
    }

    console.log(`Fetching data from Alpha Vantage for ${symbol}, function: ${func}`);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Check for API error messages
    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }

    if (data["Note"]) {
      console.warn("Alpha Vantage API limit reached:", data["Note"]);
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in get-market-data function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
