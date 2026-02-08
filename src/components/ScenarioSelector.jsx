const difficultyColors = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
}

const severityColors = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

export default function ScenarioSelector({ scenarios, onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">
          SOC Alert Triage Simulator
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Practice investigating security alerts and making triage decisions.
          Select a scenario to begin.
        </p>
      </div>

      <div className="w-full max-w-lg space-y-4">
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="w-full text-left bg-slate-800/60 border border-slate-700/50 rounded-lg p-6 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                {s.title}
              </h2>
              <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded border ${severityColors[s.severity] || severityColors.Medium}`}>
                {s.severity}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{s.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Difficulty: <span className={difficultyColors[s.difficulty] || 'text-gray-300'}>{s.difficulty}</span></span>
              <span className="text-gray-600">|</span>
              <span>Start Investigation &rarr;</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
