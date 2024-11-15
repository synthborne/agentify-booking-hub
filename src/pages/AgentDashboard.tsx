import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/shared/Navbar";
import { Booking, Profile } from "@/lib/types";

interface BookingWithCustomer extends Booking {
  customer: Profile;
}

const AgentDashboard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingWithCustomer[]>([]);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          customer:profiles!bookings_customer_id_fkey(*)
        `)
        .eq("agent_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        return;
      }

      setBookings(data);
    };

    fetchBookings();
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            My Bookings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your appointments and customer bookings
          </p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {booking.customer.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.customer.state}, {booking.customer.district}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary">
                    {booking.status}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {/* Implement status update logic */}}
                  className="px-4 py-2 rounded-lg bg-secondary text-primary hover:bg-secondary/80 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;