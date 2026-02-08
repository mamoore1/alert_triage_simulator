export default function DecisionPanel({ decisions, actionsTakenCount, onDecide }) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
          Make Your Decision
        </h3>
        {actionsTakenCount === 0 && (
          <p className="text-xs text-yellow-500/80">
            Consider investigating the alert before making a decision.
          </p>
        )}
      </div>

      <div className="space-y-2">
        {decisions.map(d => (
          <button
            key={d.id}
            onClick={() => onDecide(d.id)}
            className="w-full text-left px-4 py-3 rounded-lg border border-slate-700/50 bg-slate-800/60 text-sm text-gray-200 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-white transition-all cursor-pointer"
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  )
}
