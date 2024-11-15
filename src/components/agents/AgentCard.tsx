import { Agent } from "@/lib/types";
import { Star } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
  onBookNow: (agentId: string) => void;
}

const AgentCard = ({ agent, onBookNow }: AgentCardProps) => {
  return (
    <div className="glass-card rounded-xl p-6 animate-scale-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-primary">{agent.full_name}</h3>
          <p className="text-sm text-muted-foreground">
            {agent.state}, {agent.district}
          </p>
        </div>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="ml-1 text-sm font-medium">{agent.rating ?? 5.0}</span>
          <span className="ml-1 text-xs text-muted-foreground">
            ({agent.review_count ?? 0})
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{agent.about_me}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 text-xs rounded-full bg-secondary text-primary">
          {agent.working_hours === 'nine-to-five' ? '9 to 5' : 'Flexible Hours'}
        </span>
        <span className="px-3 py-1 text-xs rounded-full bg-secondary text-primary">
          {agent.working_days.replace('-', ' ')}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Starting from</p>
          <p className="text-lg font-semibold text-primary">
            {agent.service_charge} ETH
          </p>
        </div>
        <button
          onClick={() => onBookNow(agent.id)}
          className="px-6 py-2 bg-accent text-white rounded-lg button-hover"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default AgentCard;