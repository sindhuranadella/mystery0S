import { MysteryCase, ContradictionRule, InvestigationSession } from '../types/mystery';

export interface EvaluatedContradiction {
  rule: ContradictionRule;
  isTriggered: boolean;
  missingPrerequisiteClueName?: string;
  supportingClueName: string;
}

/**
 * Deterministic Contradiction Detection Engine
 * Compares suspect claims against independently verified physical and digital records.
 */
export function evaluateCaseContradictions(
  mysteryCase: MysteryCase,
  session: InvestigationSession
): {
  activeContradictions: ContradictionRule[];
  pendingContradictionsCount: number;
  allEvaluations: EvaluatedContradiction[];
} {
  const discoveredClueSet = new Set(session.discoveredClueIds);
  const activeContradictions: ContradictionRule[] = [];
  const allEvaluations: EvaluatedContradiction[] = [];
  let pendingCount = 0;

  for (const rule of mysteryCase.contradictions) {
    const hasDiscoveredClue = discoveredClueSet.has(rule.contradictingClueId);
    const clueObj = mysteryCase.clues.find(c => c.id === rule.contradictingClueId);
    const supportingName = clueObj ? clueObj.name : rule.contradictingClueName;

    if (hasDiscoveredClue) {
      activeContradictions.push(rule);
      allEvaluations.push({
        rule,
        isTriggered: true,
        supportingClueName: supportingName
      });
    } else {
      pendingCount++;
      allEvaluations.push({
        rule,
        isTriggered: false,
        missingPrerequisiteClueName: supportingName,
        supportingClueName: supportingName
      });
    }
  }

  return {
    activeContradictions,
    pendingContradictionsCount: pendingCount,
    allEvaluations
  };
}

/**
 * Check if a specific suspect statement conflicts with known physical evidence
 */
export function checkStatementConflict(
  mysteryCase: MysteryCase,
  suspectId: string,
  statementText: string,
  discoveredClueIds: string[]
): ContradictionRule | null {
  const discoveredSet = new Set(discoveredClueIds);

  for (const rule of mysteryCase.contradictions) {
    if (rule.suspectId === suspectId && discoveredSet.has(rule.contradictingClueId)) {
      // Check if statement relates to this contradiction
      const words = rule.claimedStatement.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      const matches = words.some(w => statementText.toLowerCase().includes(w));
      if (matches || statementText.toLowerCase().includes(rule.title.toLowerCase())) {
        return rule;
      }
    }
  }

  return null;
}
