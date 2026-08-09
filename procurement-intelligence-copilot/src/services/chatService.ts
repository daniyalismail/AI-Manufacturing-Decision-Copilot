import { ChatMessage, Evidence } from '../types';
import { INITIAL_EVIDENCE } from './mockData';

export const chatService = {
  async sendMessage(userInput: string, existingHistory: ChatMessage[]): Promise<ChatMessage> {
    return new Promise((resolve) => {
      const queryLower = userInput.toLowerCase();
      let replyText = '';
      let citations: Evidence[] = [];

      if (queryLower.includes('why') || queryLower.includes('vertex') || queryLower.includes('recommend')) {
        replyText = `Vertex Manufacturing is recommended with an overall score of 91/100 and a 94% confidence rating.

Key Decision Factors:
1. Full Compliance: Vertex satisfies all 4 mandatory criteria, including active ISO9001:2015 certification.
2. Lead Time Advantage: Guaranteed delivery in 15 days (5 days ahead of the 20-day limit).
3. Risk Score: 94/100, the lowest risk profile due to dual-sourced European aluminum inventory.

In contrast, Apex Industrial was disqualified due to an MOQ of 2,000 units (exceeding our 1,000 unit maximum limit).`;
        citations = [INITIAL_EVIDENCE[0], INITIAL_EVIDENCE[1]];
      } else if (queryLower.includes('moq') || queryLower.includes('minimum order')) {
        replyText = `Here is the MOQ breakdown across evaluated suppliers:

• Vertex Manufacturing: 1,000 units (PASS - exact match to requirement)
• Apex Industrial: 2,000 units (FAIL - exceeds 1,000 max limit)
• Nova Components: 500 units (PASS - flexible order threshold)

Apex Industrial's high MOQ introduces unnecessary inventory holding cost and storage strain.`;
        citations = [INITIAL_EVIDENCE[1], INITIAL_EVIDENCE[2]];
      } else if (queryLower.includes('nova') || queryLower.includes('reject') || queryLower.includes('iso')) {
        replyText = `Nova Components was REJECTED primarily due to non-compliance with the ISO9001 mandatory requirement.

Doc Evidence:
Nova's ISO9001:2015 certificate expired in December 2025 and is currently marked 'pending audit'. Furthermore, their quality risk rating is 68/100 due to unverified manufacturing tolerance controls.`;
        citations = [INITIAL_EVIDENCE[3]];
      } else if (queryLower.includes('compare') || queryLower.includes('apex')) {
        replyText = `Comparison between Vertex Manufacturing & Apex Industrial:

• Total Cost: Apex ($38,000) vs Vertex ($45,000). Apex is $7,000 cheaper.
• Lead Time: Vertex (15 days) vs Apex (25 days). Vertex is 10 days faster.
• MOQ: Vertex (1,000 units - PASS) vs Apex (2,000 units - FAIL).
• Overall Score: Vertex 91/100 vs Apex 78/100.

Conclusion: While Apex has lower unit pricing, Vertex's compliance and 10-day lead time savings outweigh the upfront cost differential.`;
        citations = [INITIAL_EVIDENCE[0], INITIAL_EVIDENCE[2]];
      } else {
        replyText = `Based on the extracted Procurement Knowledge Model for Motor Housing Procurement:

• Recommended Supplier: Vertex Manufacturing (Score: 91/100)
• Evaluated Suppliers: 3 (Vertex, Apex, Nova)
• Mandatory Requirements: A380 Aluminum Alloy, MOQ <= 1,000, Lead time <= 20 days, Active ISO9001.

You can ask me specific questions regarding cost tradeoffs, evidence quotes, or scenario weight adjustments!`;
        citations = [INITIAL_EVIDENCE[0]];
      }

      setTimeout(() => {
        resolve({
          id: `msg-${Date.now()}`,
          role: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations,
          suggestedQuestions: [
            'Why was Vertex Manufacturing selected?',
            'Which supplier has the lowest MOQ?',
            'Why was Nova Components rejected?',
            'Compare Vertex Manufacturing and Apex Industrial.',
          ],
        });
      }, 750);
    });
  },
};
