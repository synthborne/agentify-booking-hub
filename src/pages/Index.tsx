import { useState } from "react";
import { Agent } from "@/lib/types";
import AgentCard from "@/components/agents/AgentCard";
import Navbar from "@/components/shared/Navbar";

// Mock data for demonstration
const mockAgents: Agent[] = [
  {
    id: "1",
    email: "john@example.com",
    fullName: "John Smith",
    role: "agent",
    region: "New York",
    district: "Manhattan",
    walletId: "0x123...",
    charges: 0.05,
    aboutMe: "Experienced real estate agent specializing in luxury properties with over 10 years of experience in Manhattan's high-end market.",
    workingHours: "nine-to-five",
    workingDays: "weekdays",
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: "2",
    email: "sarah@example.com",
    fullName: "Sarah Johnson",
    role: "agent",
    region: "New York",
    district: "Brooklyn",
    walletId: "0x456...",
    charges: 0.03,
    aboutMe: "Brooklyn native with deep knowledge of emerging neighborhoods and investment opportunities. Passionate about helping first-time homebuyers.",
    workingHours: "flexible",
    workingDays: "full-week",
    rating: 4.9,
    reviewCount: 89,
  },
];

const Index = () => {
  const [agents] = useState<Agent[]>(mockAgents);

  const handleBookNow = (agentId: string) => {
    console.log("Booking agent:", agentId);
  };

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
              onBookNow={handleBookNow}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;