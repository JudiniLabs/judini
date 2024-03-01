declare module 'judini' {
  export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

export interface Agent {
  id?: string;
  name?: string;
  model?: string;
  prompt?: string;
  topk?: number;
  welcome?: string;
  is_public?: boolean;
  pincode?: string;
}

  export class CodeGPTPlus {
    constructor(config: { apiKey: string, orgId?: string });
    isLoading(): boolean;
    stopStreaming(): void;
    chatCompletion(params: { messages: Array<Message>, agentId: string }, callback?: Function): Promise<string>;
    experimental_AIStream(params: { messages: Array<Message>, agentId: string }): Promise<ReadableStream>;
    getAgents(): Promise<Array<Agent>>;
    getAgent(agentId: string): Promise<Agent>;
    createAgent(agent: Agent): Promise<Agent>;
    updateAgent(agentId: string, agent: Agent): Promise<Agent>;
    deleteAgent(agentId: string): Promise<string>;
    updateAgentDocuments(agentId: string, documents: Array<string>): Promise<Agent>;
    getDocuments(): Promise<Array<any>>;
    getDocument(documentId: string): Promise<any>;
    deleteDocument(documentId: string): Promise<string>;
  }
}
