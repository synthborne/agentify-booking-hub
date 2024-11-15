import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AgentCard from "@/components/agents/AgentCard";
import Navbar from "@/components/shared/Navbar";
import { Agent } from "@/lib/types";

const CustomerDashboard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    const fetchAgents = async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "agent");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
      }

      const { data: agentDetails, error: detailsError } = await supabase
        .from("agent_details")
        .select("*");

      if (detailsError) {
        console.error("Error fetching agent details:", detailsError);
        return;
      }

      const combinedAgents = profiles.map(profile => ({
        ...profile,
        ...agentDetails.find(details => details.id === profile.id),
        role: 'agent' as const
      })) as Agent[];

      setAgents(combinedAgents);
    };

    fetchAgents();
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Available Agents
          </h1>
          <p className="text-lg text-muted-foreground">
            Find and book the perfect real estate agent for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;