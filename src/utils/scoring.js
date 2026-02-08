export function calculateScore({ actionsTaken, decisionId, scenario }) {
  const decision = scenario.decisions.find(d => d.id === decisionId)
  if (!decision) return null

  let score = decision.base_points

  const actions = scenario.investigation_actions
  const taken = new Set(actionsTaken)
  const totalTaken = taken.size
  const totalAvailable = actions.length

  const essentialActions = actions.filter(a => a.weight === 'essential')
  const essentialTaken = essentialActions.filter(a => taken.has(a.id)).length
  const essentialTotal = essentialActions.length

  const goodPracticeTaken = actions.filter(a => a.weight === 'good_practice' && taken.has(a.id)).length

  const isCorrectish = decision.outcome === 'correct' || decision.outcome === 'partial'
  const missedEssential = essentialTotal - essentialTaken
  const insufficientInvestigation = totalTaken === 0 || missedEssential >= 2
  const goodInvestigation = totalTaken > 0 && essentialTaken >= essentialTotal - 1

  // Efficiency modifiers only apply to correct/partial decisions
  if (isCorrectish) {
    if (totalTaken === totalAvailable) {
      score -= 15
    }
    if (totalTaken === scenario.optimal_investigation_count) {
      score += 5
    }
  }

  score = Math.max(0, Math.min(100, score))

  // Determine investigation feedback — contextual based on decision outcome
  let investigationFeedback

  if (!isCorrectish) {
    // Incorrect decision feedback
    if (insufficientInvestigation) {
      investigationFeedback = "Insufficient investigation led to an incorrect conclusion."
    } else {
      investigationFeedback = "You gathered the right evidence but drew the wrong conclusion."
    }
  } else if (totalTaken === 0) {
    investigationFeedback = "You made a decision without investigating at all. Always gather evidence before making a triage decision."
  } else if (insufficientInvestigation) {
    investigationFeedback = "You reached the right conclusion but missed critical evidence — investigate more thoroughly to build confidence."
  } else if (totalTaken === totalAvailable) {
    investigationFeedback = "You over-investigated — experienced analysts would have recognized the pattern earlier and saved time for other alerts."
  } else if (totalTaken <= scenario.optimal_investigation_count && goodInvestigation) {
    investigationFeedback = "Excellent investigation — you identified the key evidence efficiently."
  } else {
    investigationFeedback = "Good investigation, though you could have reached this conclusion with fewer steps."
  }

  return {
    score,
    decisionOutcome: decision.outcome,
    decisionFeedback: decision.feedback,
    investigationFeedback,
    stats: {
      totalTaken,
      totalAvailable,
      essentialTaken,
      essentialTotal,
      goodPracticeTaken,
      optimalCount: scenario.optimal_investigation_count,
    },
  }
}
