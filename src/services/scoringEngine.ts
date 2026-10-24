import { MysteryCase, AccusationSubmission, ScoreReport, DetectiveRank } from '../types/mystery';

/**
 * Deterministic Accusation Evaluation & 100-Point Scoring Model
 * Follows exact specifications:
 * - Correct culprit: 30 pts
 * - Correct motive: 15 pts
 * - Correct method: 15 pts
 * - Relevant supporting evidence: 25 pts
 * - Consistent timeline: 15 pts
 * - Deducts used hint penalties
 */
export function evaluateAccusation(
  mysteryCase: MysteryCase,
  submission: AccusationSubmission,
  hintsUsedTiers: number[],
  discoveredClueIds: string[],
  timeSpentSeconds: number
): ScoreReport {
  const solution = mysteryCase.verifiedSolution;
  const isCulpritCorrect = submission.suspectId === solution.culpritId;
  const culpritScore = isCulpritCorrect ? 30 : 0;

  // Evaluate Motive (15 pts max)
  let motiveScore = 0;
  if (isCulpritCorrect) {
    const motiveKeywords = solution.motive.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const subMotiveLower = (submission.motive || '').toLowerCase();
    const matchedCount = motiveKeywords.filter(k => subMotiveLower.includes(k)).length;
    const ratio = motiveKeywords.length > 0 ? matchedCount / Math.min(motiveKeywords.length, 6) : 0;
    if (ratio >= 0.5 || subMotiveLower.length > 20) {
      motiveScore = 15;
    } else if (ratio >= 0.2 || subMotiveLower.length > 8) {
      motiveScore = 8;
    }
  }

  // Evaluate Method (15 pts max)
  let methodScore = 0;
  if (isCulpritCorrect) {
    const methodKeywords = solution.method.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const subMethodLower = (submission.method || '').toLowerCase();
    const matchedCount = methodKeywords.filter(k => subMethodLower.includes(k)).length;
    const ratio = methodKeywords.length > 0 ? matchedCount / Math.min(methodKeywords.length, 6) : 0;
    if (ratio >= 0.5 || subMethodLower.length > 25) {
      methodScore = 15;
    } else if (ratio >= 0.2 || subMethodLower.length > 10) {
      methodScore = 8;
    }
  }

  // Evaluate Supporting Evidence (25 pts max)
  const requiredClueSet = new Set(solution.requiredClueIds);
  const submittedClueSet = new Set(submission.supportingClueIds || []);
  let matchingRequiredClues = 0;
  for (const reqId of requiredClueSet) {
    if (submittedClueSet.has(reqId)) {
      matchingRequiredClues++;
    }
  }
  const evidenceRatio = requiredClueSet.size > 0 ? matchingRequiredClues / requiredClueSet.size : 1;
  const evidenceScore = Math.round(evidenceRatio * 25);

  // Evaluate Timeline (15 pts max)
  let timelineScore = 0;
  const correctOrder = solution.timelineVerificationOrder;
  const submittedOrder = submission.timelineOrdering || [];
  if (correctOrder.length > 0 && submittedOrder.length > 0) {
    let orderMatches = 0;
    for (let i = 0; i < Math.min(correctOrder.length, submittedOrder.length); i++) {
      if (correctOrder[i] === submittedOrder[i]) {
        orderMatches++;
      }
    }
    const timelineRatio = orderMatches / correctOrder.length;
    timelineScore = Math.round(timelineRatio * 15);
  } else if (correctOrder.length === 0) {
    timelineScore = 15;
  }

  // Calculate Hint Deductions
  let hintDeductions = 0;
  for (const tier of hintsUsedTiers) {
    const hintObj = mysteryCase.hints.find(h => h.tier === tier);
    if (hintObj) {
      hintDeductions += hintObj.penaltyPoints;
    } else {
      hintDeductions += tier === 1 ? 2 : tier === 2 ? 5 : 10;
    }
  }

  // Raw score before penalty
  const rawScore = culpritScore + motiveScore + methodScore + evidenceScore + timelineScore;
  const totalScore = Math.max(0, Math.min(100, rawScore - hintDeductions));
  const accuracyPercentage = Math.round((rawScore / 100) * 100);
  const isSolved = isCulpritCorrect && totalScore >= 65;

  // Missed clues
  const discoveredSet = new Set(discoveredClueIds);
  const missedClues = mysteryCase.clues
    .filter(c => !discoveredSet.has(c.id) && c.significance === 'crucial')
    .map(c => c.name);

  // Educational breakdown
  const educationalBreakdown = isSolved
    ? `Deduction verified! You identified ${solution.culpritName} through conclusive forensics. ${solution.solutionNarrative}`
    : isCulpritCorrect
    ? `You correctly fingered ${solution.culpritName}, but your evidentiary substantiation lacked crucial forensic links. ${solution.solutionNarrative}`
    : `Incorrect accusation. ${solution.culpritName} was the actual perpetrator. Here is how the forensic trail unfolded: ${solution.solutionNarrative}`;

  // XP calculation
  const xpAwarded = Math.round(totalScore * 8 + (isSolved ? 200 : 50));

  // Determine unlocked achievements
  const unlockedAchievements: string[] = [];
  if (discoveredClueIds.length > 0) unlockedAchievements.push('first_clue');
  if (hintsUsedTiers.length === 0 && isSolved) unlockedAchievements.push('iron_deduction');
  if (timelineScore >= 12) unlockedAchievements.push('timeline_architect');
  if (isSolved) unlockedAchievements.push('first_case_solved');
  if (totalScore >= 90) unlockedAchievements.push('master_detective');

  return {
    totalScore,
    culpritScore,
    motiveScore,
    methodScore,
    evidenceScore,
    timelineScore,
    hintDeductions,
    accuracyPercentage,
    isSolved,
    correctCulprit: solution.culpritName,
    actualMotive: solution.motive,
    actualMethod: solution.method,
    missedClues,
    discoveredCluesCount: discoveredClueIds.length,
    totalCluesCount: mysteryCase.clues.length,
    verifiedContradictionsFound: mysteryCase.contradictions.filter(c => discoveredSet.has(c.contradictingClueId)).length,
    totalContradictionsCount: mysteryCase.contradictions.length,
    hintsUsedCount: hintsUsedTiers.length,
    timeSpentSeconds,
    educationalBreakdown,
    unlockedAchievements,
    xpAwarded
  };
}

export function computeRankFromXP(totalXP: number): DetectiveRank {
  if (totalXP >= 4500) return 'Master Detective';
  if (totalXP >= 2500) return 'Senior Detective';
  if (totalXP >= 1200) return 'Detective';
  if (totalXP >= 500) return 'Investigator';
  return 'Trainee';
}
