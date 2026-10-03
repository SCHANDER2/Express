import { SeoIssue } from './seo-checks';

/**
 * Calculates the overall SEO score based on issues found.
 * Base 100, subtract: critical = -3pts, warning = -1.5pts
 * Floor at 0, ceil at 100
 * @param issues Array of SEO issues
 * @returns Score from 0 to 100
 */
export function calculateSeoScore(issues: SeoIssue[]): number {
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === 'critical') score -= 3;
    else if (issue.severity === 'warning') score -= 1.5;
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculates scores and stats per category.
 * @param issues Array of SEO issues
 * @returns Object mapping category to its stats
 */
export function calculateCategoryScores(issues: SeoIssue[]): Record<string, { score: number; total: number; passed: number; critical: number; warnings: number }> {
  const result: Record<string, { score: number; total: number; passed: number; critical: number; warnings: number }> = {};
  
  for (const issue of issues) {
    if (!result[issue.category]) {
      result[issue.category] = { score: 100, total: 0, passed: 0, critical: 0, warnings: 0 };
    }
    const cat = result[issue.category];
    cat.total += 1;
    if (issue.severity === 'critical') {
      cat.critical += 1;
      cat.score -= 10; // Simple heuristic for category score
    }
    else if (issue.severity === 'warning') {
      cat.warnings += 1;
      cat.score -= 5;
    }
    else if (issue.severity === 'good') {
      cat.passed += 1;
    }
  }

  for (const key of Object.keys(result)) {
    result[key].score = Math.max(0, Math.min(100, Math.round(result[key].score)));
  }

  return result;
}

/**
 * Returns a human-readable label for a given score.
 * 80-100: Excellent, 60-79: Good, 40-59: Needs Work, 0-39: Poor
 * @param score The numerical score
 * @returns Score label
 */
export function getScoreLabel(score: number): 'Excellent' | 'Good' | 'Needs Work' | 'Poor' {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
}

/**
 * Returns a CSS color class based on the score.
 * green for 80+, yellow/orange for 40-79, red for <40
 * @param score The numerical score
 * @returns Tailwind CSS text color class
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 40) return 'text-yellow-500'; // Or text-orange-500
  return 'text-red-500';
}
