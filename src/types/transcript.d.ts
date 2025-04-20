export type TranscriptItem = {
    id: number;
    agent_id: string;
    game_id: string;
    game_type: string;
    round_number: number;
    message_data: MessageData;
    message_type: MessageType;
    timestamp: string;
}

export type MessageType = "response" | "game_state" | "prompt";

export type ResponseMessageData = {
  choice: "left" | "right";
  reasoning: string;
};

export type AttemptHistoryItem = {
  position: number;
  agent: string;
  choice: "left" | "right";
  result: "success" | "eliminated";
};

export type AgentOrder = Record<string, number>;

export type GameStateMessageData = {
  round: number;
  current_position: number;
  bridge_pattern: ("left" | "right")[];
  attempt_history: AttemptHistoryItem[];
  eliminated_agents: string[];
  immune_agents: string[];
  active_agents: string[];
  agent_order: AgentOrder;
  ordering_phase: boolean;
};

export type PromptMessageData = {
  prompt: string;
};

export type MessageData = ResponseMessageData | GameStateMessageData | PromptMessageData;
