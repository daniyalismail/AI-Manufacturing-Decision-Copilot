import { ScenarioWeights } from '../types';
import { fetchAPI } from '../lib/api-client';

export const scenarioService = {
  async runScenarioAnalysis(projectId: string, weights: ScenarioWeights): Promise<any[]> {
    try {
      const response = await fetchAPI<{ ranking: any[] }>(`/projects/${projectId}/scenario`, {
        method: 'POST',
        body: JSON.stringify({ weights }),
      });
      return response.ranking || [];
    } catch (err) {
      console.error("Scenario API error:", err);
      return [];
    }
  },
};
