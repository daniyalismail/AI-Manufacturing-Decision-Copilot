import { ChatMessage } from '../types';
import { fetchAPI } from '../lib/api-client';

export const chatService = {
  async sendMessage(userInput: string, existingHistory: ChatMessage[], projectId: string): Promise<ChatMessage> {
    try {
      const response = await fetchAPI<any>('/chat', {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId,
          message: userInput,
          history: existingHistory.map(h => ({ role: h.role, text: h.text }))
        })
      });

      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.sources || [],
        suggestedQuestions: response.suggestedQuestions && response.suggestedQuestions.length > 0 
          ? response.suggestedQuestions 
          : [
              'Why was Vertex Manufacturing selected?',
              'Which supplier has the lowest MOQ?',
              'Why was Nova Components rejected?',
              'Compare Vertex Manufacturing and Apex Industrial.',
            ],
      };
    } catch (err) {
      console.error("Chat API error:", err);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: "I'm sorry, I'm having trouble connecting to the Decision Engine right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }
  },
};
