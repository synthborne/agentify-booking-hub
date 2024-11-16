import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Agent } from "@/lib/types";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BookingActions from "@/components/booking/BookingActions";

const BookingPage = () => {
  const { agentId } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string>("pending");

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

      const workingHours = agentDetails.working_hours === 'nine-to-five' ? 'nine-to-five' as const : 'flexible' as const;
      
      setAgent({
        ...profile,
        ...agentDetails,
        working_hours: workingHours,
        role: 'agent' as const
      } as Agent);

      // Create initial booking record with correct status
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          agent_id: agentId,
          customer_id: session.user.id,
          booking_date: new Date().toISOString(),
          status: "pending",
          payment_status: "pending"
        })
        .select()
        .single();

      if (bookingError) {
        toast.error("Error creating booking");
        console.error("Booking error:", bookingError);
        return;
      }

      setBookingId(booking.id);
    };

    fetchAgent();
  }, [agentId, session, navigate]);

  const handleStatusChange = (newStatus: string) => {
    setBookingStatus(newStatus);
  };

  if (!agent || !bookingId) return <div>Loading...</div>;

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

            <BookingActions
              bookingId={bookingId}
              customerId={session.user.id}
              agentId={agent.id}
              serviceCharge={agent.service_charge}
              bookingStatus={bookingStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;