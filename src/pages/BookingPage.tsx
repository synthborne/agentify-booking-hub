import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Agent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BookingPage = () => {
  const { agentId } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"initial" | "pending" | "confirmed" | "cancelled">("initial");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    const fetchAgent = async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", agentId)
        .single();

      if (profileError) {
        toast.error("Error fetching agent details");
        return;
      }

      const { data: agentDetails, error: detailsError } = await supabase
        .from("agent_details")
        .select("*")
        .eq("id", agentId)
        .single();

      if (detailsError) {
        toast.error("Error fetching agent details");
        return;
      }

      setAgent({
        ...profile,
        ...agentDetails,
        role: 'agent' as const
      });
    };

    fetchAgent();
  }, [agentId, session, navigate]);

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        agent_id: agentId,
        customer_id: session?.user.id,
        booking_date: new Date().toISOString(),
        status: "pending",
        payment_status: "pending"
      });

      if (error) throw error;

      setBookingStatus("pending");
      toast.success("Booking initiated successfully!");

      // Call the edge function to send email notifications
      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: { agentId, customerId: session?.user.id, status: 'pending' }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
      }

    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDeal = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("agent_id", agentId)
        .eq("customer_id", session?.user.id)
        .eq("status", "pending");

      if (error) throw error;

      setBookingStatus("confirmed");
      toast.success("Deal confirmed successfully!");

      // Send confirmation emails
      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: { agentId, customerId: session?.user.id, status: 'confirmed' }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
      }

    } catch (error) {
      toast.error("Failed to confirm deal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("agent_id", agentId)
        .eq("customer_id", session?.user.id)
        .eq("status", "pending");

      if (error) throw error;

      setBookingStatus("cancelled");
      toast.success("Booking cancelled successfully!");
      navigate("/customer-dashboard");

    } catch (error) {
      toast.error("Failed to cancel booking");
    } finally {
      setIsLoading(false);
    }
  };

  if (!agent) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card rounded-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{agent.full_name}</h1>
              <p className="text-muted-foreground">
                {agent.state}, {agent.district}
              </p>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="ml-1 font-medium">{agent.rating ?? 5.0}</span>
              <span className="ml-1 text-sm text-muted-foreground">
                ({agent.review_count ?? 0} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-muted-foreground">{agent.about_me}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Working Hours</h2>
              <p className="text-muted-foreground">
                {agent.working_hours === 'nine-to-five' ? '9 AM to 5 PM' : 'Flexible Hours'}
              </p>
              <p className="text-muted-foreground">
                Available: {agent.working_days.replace('-', ' ')}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Service Charge</h2>
              <p className="text-2xl font-bold text-primary">{agent.service_charge} ETH</p>
            </div>

            {bookingStatus === "initial" && (
              <Button
                className="w-full"
                size="lg"
                onClick={handleConfirmBooking}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Booking"}
              </Button>
            )}

            {bookingStatus === "pending" && (
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">Agent Contact</h3>
                  <p className="text-muted-foreground">Email: agent@example.com</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    className="flex-1"
                    variant="default"
                    size="lg"
                    onClick={handleConfirmDeal}
                    disabled={isLoading}
                  >
                    Confirm Deal
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    size="lg"
                    onClick={handleCancelBooking}
                    disabled={isLoading}
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;