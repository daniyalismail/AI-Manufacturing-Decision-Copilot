import { Supplier, ScenarioWeights } from '../types';

/**
 * Calculates weighted score for a supplier based on customizable scenario weights.
 * Normalized to 100.
 */
export function calculateScenarioScore(supplier: Supplier, weights: ScenarioWeights): number {
  const totalWeight = weights.cost + weights.quality + weights.leadTime + weights.risk + weights.sustainability;
  if (totalWeight === 0) return 0;

  const weightedSum =
    (supplier.scores.cost * weights.cost) +
    (supplier.scores.quality * weights.quality) +
    (supplier.scores.leadTime * weights.leadTime) +
    (supplier.scores.risk * weights.risk) +
    (supplier.scores.sustainability * weights.sustainability);

  return Math.round(weightedSum / totalWeight);
}

/**
 * Ranks suppliers based on active scenario weights and detects rank changes.
 */
export function getRankedSuppliers(suppliers: Supplier[], weights: ScenarioWeights) {
  const calculated = suppliers.map((supplier) => {
    const scenarioScore = calculateScenarioScore(supplier, weights);
    return {
      ...supplier,
      calculatedScore: scenarioScore,
      scoreDiff: scenarioScore - (supplier.scores.overall || scenarioScore),
    };
  });

  return calculated.sort((a, b) => b.calculatedScore - a.calculatedScore);
}
