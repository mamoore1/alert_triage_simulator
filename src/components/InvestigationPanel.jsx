export default function InvestigationPanel({ actions, actionsTaken, newlyUnlockedIds, onPerformAction }) {
  const takenCount = actionsTaken.length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Investigation Actions
        </h3>
        <span className="text-xs text-gray-500">
          {takenCount} action{takenCount !== 1 ? 's' : ''} taken
        </span>
      </div>

      <div className="space-y-2">
        {actions.map(action => {
          const taken = actionsTaken.includes(action.id)
          const isNew = newlyUnlockedIds.has(action.id)
          return (
            <button
              key={action.id}
              onClick={() => !taken && onPerformAction(action.id)}
              disabled={taken}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                isNew ? 'animate-[fadeSlideIn_0.4s_ease-out]' : ''
              } ${
                taken
                  ? 'bg-slate-800/40 border-slate-700/30 text-gray-500 cursor-default'
                  : 'bg-slate-800/60 border-slate-700/50 text-gray-200 hover:bg-slate-700/60 hover:border-slate-600 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 ${
                  taken
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-700/50 text-gray-500'
                }`}>
                  {taken ? '✓' : '›'}
                </span>
                <span>{action.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
