import { useState } from 'react'

const outcomeStyles = {
  correct: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', label: 'Correct' },
  partial: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', label: 'Partially Correct' },
  incorrect: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'Incorrect' },
}

function scoreColor(score) {
  if (score >= 80) return 'text-green-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

export default function ScoreCard({ result, scenario, actionsTaken, onRetry, onReset }) {
  const style = outcomeStyles[result.decisionOutcome] || outcomeStyles.incorrect
  const { stats } = result
  const [showOptimal, setShowOptimal] = useState(false)

  const essentialActions = scenario.investigation_actions.filter(a => a.weight === 'essential')
  const goodPracticeActions = scenario.investigation_actions.filter(a => a.weight === 'good_practice')

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Score */}
        <div className="text-center mb-8">
          <div className={`text-7xl font-bold ${scoreColor(result.score)} mb-2`}>
            {result.score}
          </div>
          <div className="text-gray-500 text-sm">out of 100</div>
        </div>

        {/* Decision Outcome */}
        <div className={`rounded-lg border p-5 mb-4 ${style.bg}`}>
          <div className={`text-sm font-semibold ${style.color} mb-2`}>{style.label}</div>
          <p className="text-gray-300 text-sm leading-relaxed">{result.decisionFeedback}</p>
        </div>

        {/* Investigation Feedback */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-5 mb-4">
          <div className="text-sm font-semibold text-gray-400 mb-2">Investigation Efficiency</div>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">{result.investigationFeedback}</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span>Actions: {stats.totalTaken}/{stats.totalAvailable}</span>
            <span>Essential: {stats.essentialTaken}/{stats.essentialTotal}</span>
            <span>Optimal: {stats.optimalCount}</span>
          </div>
        </div>

        {/* Optimal Path */}
        <div className="mb-6">
          <button
            onClick={() => setShowOptimal(!showOptimal)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            {showOptimal ? 'Hide' : 'View'} Optimal Investigation Path
          </button>

          {showOptimal && (
            <div className="mt-3 bg-slate-800/40 border border-slate-700/40 rounded-lg p-4 space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Essential Actions</div>
              {essentialActions.map(a => (
                <div key={a.id} className="flex items-center gap-2 text-sm">
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${
                    actionsTaken.includes(a.id)
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {actionsTaken.includes(a.id) ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-300">{a.label}</span>
                </div>
              ))}

              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">Good Practice</div>
              {goodPracticeActions.map(a => (
                <div key={a.id} className="flex items-center gap-2 text-sm">
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${
                    actionsTaken.includes(a.id)
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {actionsTaken.includes(a.id) ? '✓' : '–'}
                  </span>
                  <span className="text-gray-400">{a.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={onReset}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-gray-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Back to Scenarios
          </button>
        </div>
      </div>
    </div>
  )
}
