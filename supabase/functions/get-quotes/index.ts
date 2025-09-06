import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-QUOTES] ${step}${detailsStr}`);
};

interface QuoteRequest {
  numVisas: number;
  officeType: "none" | "flex" | "small_office" | "shared_desk";
  durationYears: number;
  activityCode?: string;
}

interface QuoteResponse {
  quotes: Array<{
    freezone: {
      id: string;
      name: string;
    };
    type: 'itemized' | 'package';
    subtotal: number;
    admin: number;
    vat: number;
    total: number;
    details: any;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started", { method: req.method });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    let params: QuoteRequest;

    // Extract parameters based on request method
    if (req.method === 'POST') {
      try {
        params = await req.json() as QuoteRequest;
        logStep("POST request parsed", params);
      } catch (error) {
        logStep("JSON parse error", error);
        return new Response(JSON.stringify({ 
          error: "Invalid JSON body" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    } else if (req.method === 'GET') {
      const url = new URL(req.url);
      params = {
        numVisas: parseInt(url.searchParams.get('numVisas') || '1'),
        officeType: (url.searchParams.get('officeType') || 'none') as QuoteRequest['officeType'],
        durationYears: parseInt(url.searchParams.get('durationYears') || '1'),
        activityCode: url.searchParams.get('activityCode') || undefined,
      };
      logStep("GET request parsed", params);
    } else {
      logStep("Method not allowed", { method: req.method });
      return new Response(JSON.stringify({ 
        error: "Method not allowed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      });
    }

    // Validate required parameters
    if (!params.numVisas || params.numVisas < 1) {
      return new Response(JSON.stringify({ 
        error: "numVisas must be a positive number" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!params.durationYears || params.durationYears < 1) {
      return new Response(JSON.stringify({ 
        error: "durationYears must be a positive number" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Parameters validated", params);

    // Fetch freezones data
    const { data: freezones, error: freezonesError } = await supabaseClient
      .from('freezones')
      .select('*');

    if (freezonesError) {
      logStep("Error fetching freezones", freezonesError);
      throw new Error(`Failed to fetch freezones: ${freezonesError.message}`);
    }

    // Fetch addon prices
    const { data: addonPrices, error: addonError } = await supabaseClient
      .from('addon_prices')
      .select('*');

    if (addonError) {
      logStep("Error fetching addon prices", addonError);
      throw new Error(`Failed to fetch addon prices: ${addonError.message}`);
    }

    // Fetch packages
    const { data: packages, error: packagesError } = await supabaseClient
      .from('packages')
      .select('*');

    if (packagesError) {
      logStep("Error fetching packages", packagesError);
      throw new Error(`Failed to fetch packages: ${packagesError.message}`);
    }

    logStep("Data fetched successfully", { 
      freezonesCount: freezones?.length || 0,
      addonPricesCount: addonPrices?.length || 0,
      packagesCount: packages?.length || 0
    });

    const quotes: QuoteResponse['quotes'] = [];

    // Process each freezone
    for (const freezone of freezones || []) {
      try {
        // Calculate itemized quote
        const itemizedQuote = calculateItemizedQuote(freezone, params, addonPrices || []);
        if (itemizedQuote) {
          quotes.push({
            freezone: {
              id: freezone.freezone_id || freezone.id,
              name: freezone.name
            },
            type: 'itemized',
            ...itemizedQuote
          });
        }

        // Calculate package quote if packages exist for this freezone
        const freezonePackages = packages?.filter(pkg => 
          pkg.freezone_name === freezone.name || 
          pkg.freezone_name === freezone.freezone_id
        ) || [];

        if (freezonePackages.length > 0) {
          const packageQuote = calculatePackageQuote(freezone, params, freezonePackages);
          if (packageQuote) {
            quotes.push({
              freezone: {
                id: freezone.freezone_id || freezone.id,
                name: freezone.name
              },
              type: 'package',
              ...packageQuote
            });
          }
        }
      } catch (error) {
        logStep(`Error processing freezone ${freezone.name}`, error);
        // Continue with other freezones
      }
    }

    logStep("Quotes calculated", { quotesCount: quotes.length });

    const response: QuoteResponse = { quotes };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function calculateItemizedQuote(freezone: any, params: QuoteRequest, addonPrices: any[]) {
  try {
    let subtotal = 0;
    const details: any = {
      components: []
    };

    // Base license cost
    const baseLicense = freezone.base_license_yearly || 0;
    subtotal += baseLicense * params.durationYears;
    details.components.push({
      name: 'Base License',
      cost: baseLicense,
      years: params.durationYears,
      total: baseLicense * params.durationYears
    });

    // Visa costs
    if (params.numVisas > 0 && freezone.visa_fee_per) {
      const visaCost = freezone.visa_fee_per * params.numVisas;
      subtotal += visaCost * params.durationYears;
      details.components.push({
        name: 'Visa Fees',
        cost: freezone.visa_fee_per,
        quantity: params.numVisas,
        years: params.durationYears,
        total: visaCost * params.durationYears
      });
    }

    // Office costs
    if (params.officeType !== 'none') {
      let officeCost = 0;
      let officeName = '';
      
      switch (params.officeType) {
        case 'flex':
          officeCost = freezone.office_flex_fee_yearly || 0;
          officeName = 'Flexi Desk';
          break;
        case 'small_office':
          officeCost = freezone.office_small_office_fee_yearly || 0;
          officeName = 'Small Office';
          break;
        case 'shared_desk':
          // Assuming shared desk is similar to flex desk or has a separate field
          officeCost = freezone.office_flex_fee_yearly || 0;
          officeName = 'Shared Desk';
          break;
      }

      if (officeCost > 0) {
        subtotal += officeCost * params.durationYears;
        details.components.push({
          name: officeName,
          cost: officeCost,
          years: params.durationYears,
          total: officeCost * params.durationYears
        });
      }
    }

    // Admin fee
    const adminFeePercent = freezone.admin_fee_percent || 0;
    const admin = subtotal * (adminFeePercent / 100);

    // VAT
    const vatPercent = freezone.vat_percent || 0;
    const vat = (subtotal + admin) * (vatPercent / 100);

    const total = subtotal + admin + vat;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      admin: Math.round(admin * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      total: Math.round(total * 100) / 100,
      details
    };
  } catch (error) {
    logStep(`Error calculating itemized quote for ${freezone.name}`, error);
    return null;
  }
}

function calculatePackageQuote(freezone: any, params: QuoteRequest, packages: any[]) {
  try {
    // Find the best matching package
    const suitablePackages = packages.filter(pkg => 
      pkg.max_visas >= params.numVisas &&
      pkg.tenure_years >= params.durationYears
    );

    if (suitablePackages.length === 0) {
      return null;
    }

    // Select the most cost-effective package
    const bestPackage = suitablePackages.reduce((best, current) => 
      current.price_aed < best.price_aed ? current : best
    );

    let subtotal = bestPackage.base_cost || bestPackage.price_aed || 0;
    const details: any = {
      packageName: bestPackage.package_name,
      components: [{
        name: 'Package Base Cost',
        cost: subtotal,
        total: subtotal
      }]
    };

    // Additional visa costs if needed
    if (params.numVisas > (bestPackage.max_visas || 0)) {
      const additionalVisas = params.numVisas - (bestPackage.max_visas || 0);
      const additionalVisaCost = (bestPackage.per_visa_cost || freezone.visa_fee_per || 0) * additionalVisas;
      subtotal += additionalVisaCost;
      details.components.push({
        name: 'Additional Visas',
        cost: bestPackage.per_visa_cost || freezone.visa_fee_per || 0,
        quantity: additionalVisas,
        total: additionalVisaCost
      });
    }

    // Duration multiplier if package is for less than requested years
    if (params.durationYears > (bestPackage.tenure_years || 1)) {
      const yearMultiplier = params.durationYears / (bestPackage.tenure_years || 1);
      subtotal *= yearMultiplier;
      details.yearMultiplier = yearMultiplier;
    }

    // Admin fee
    const adminFeePercent = freezone.admin_fee_percent || 0;
    const admin = subtotal * (adminFeePercent / 100);

    // VAT
    const vatPercent = freezone.vat_percent || 0;
    const vat = (subtotal + admin) * (vatPercent / 100);

    const total = subtotal + admin + vat;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      admin: Math.round(admin * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      total: Math.round(total * 100) / 100,
      details
    };
  } catch (error) {
    logStep(`Error calculating package quote for ${freezone.name}`, error);
    return null;
  }
}