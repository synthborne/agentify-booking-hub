import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { agentId, customerId, status } = await req.json();

    // Fetch agent and customer details
    const { data: agent } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", agentId)
      .single();

    const { data: customer } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", customerId)
      .single();

    if (!agent || !customer) {
      throw new Error("Could not find agent or customer details");
    }

    // Prepare email content based on status
    const getEmailContent = () => {
      switch (status) {
        case "pending":
          return {
            subject: "New Booking Request",
            agentHtml: `<p>You have a new booking request from ${customer.full_name}.</p>`,
            customerHtml: `<p>Your booking request with ${agent.full_name} has been received.</p>`,
          };
        case "confirmed":
          return {
            subject: "Booking Confirmed",
            agentHtml: `<p>The booking with ${customer.full_name} has been confirmed.</p>`,
            customerHtml: `<p>Your booking with ${agent.full_name} has been confirmed.</p>`,
          };
        default:
          throw new Error("Invalid status");
      }
    };

    const emailContent = getEmailContent();

    // Send emails using Resend
    const sendEmail = async (to: string, html: string) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Real Estate Booking <booking@yourdomain.com>",
          to: [to],
          subject: emailContent.subject,
          html: html,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to send email: ${await res.text()}`);
      }
    };

    // Send emails to both agent and customer
    await Promise.all([
      sendEmail("agent@example.com", emailContent.agentHtml),
      sendEmail("customer@example.com", emailContent.customerHtml),
    ]);

    return new Response(
      JSON.stringify({ message: "Emails sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});