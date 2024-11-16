import { useState } from "react";
import { Agent } from "@/lib/types";
import AgentCard from "@/components/agents/AgentCard";
import Navbar from "@/components/shared/Navbar";

// Mock data for demonstration
const mockAgents: Agent[] = [
  {
    id: "1",
    role: "agent",
    full_name: "John Smith",
    state: "New York",
    district: "Manhattan",
    wallet_id: "0x123...",
    mobile_number: "1234567890", // Added missing field
    service_charge: 0.05,
    about_me: "Experienced real estate agent specializing in luxury properties with over 10 years of experience in Manhattan's high-end market.",
    working_hours: "nine-to-five",
    working_days: "weekdays",
    rating: 4.8,
    review_count: 127,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    role: "agent",
    full_name: "Sarah Johnson",
    state: "New York",
    district: "Brooklyn",
    wallet_id: "0x456...",
    mobile_number: "9876543210", // Added missing field
    service_charge: 0.03,
    about_me: "Brooklyn native with deep knowledge of emerging neighborhoods and investment opportunities. Passionate about helping first-time homebuyers.",
    working_hours: "flexible",
    working_days: "full-week",
    rating: 4.9,
    review_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const Index = () => {
  const [agents] = useState<Agent[]>(mockAgents);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Find Your Perfect Real Estate Agent
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with professional agents who understand your needs and help you
            make the right property decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;