import { useScenario } from './hooks/useScenario'
import ScenarioSelector from './components/ScenarioSelector'
import AlertDisplay from './components/AlertDisplay'
import InvestigationPanel from './components/InvestigationPanel'
import ActionResult from './components/ActionResult'
import DecisionPanel from './components/DecisionPanel'
import ScoreCard from './components/ScoreCard'

export default function App() {
  const {
    scenario,
    actionsTaken,
    result,
    phase,
    availableScenarios,
    unlockedActions,
    newlyUnlockedIds,
    loadScenario,
    performAction,
    makeDecision,
    reset,
    retry,
  } = useScenario()

  if (phase === 'select') {
    return <ScenarioSelector scenarios={availableScenarios} onSelect={loadScenario} />
  }

  if (phase === 'result' && result) {
    return (
      <ScoreCard
        result={result}
        scenario={scenario}
        actionsTaken={actionsTaken}
        onRetry={retry}
        onReset={reset}
      />
    )
  }

  // investigate phase
  const completedActions = scenario.investigation_actions.filter(a =>
    actionsTaken.includes(a.id)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">{scenario.title}</h1>
          <p className="text-sm text-gray-500">Investigate the alert and make your triage decision</p>
        </div>
        <button
          onClick={reset}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          &larr; Back
        </button>
      </div>

      {/* Alert */}
      <div className="mb-6">
        <AlertDisplay alert={scenario.alert} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: actions + decisions */}
        <div className="lg:col-span-1 space-y-6">
          <InvestigationPanel
            actions={unlockedActions}
            actionsTaken={actionsTaken}
            newlyUnlockedIds={newlyUnlockedIds}
            onPerformAction={performAction}
          />
          <DecisionPanel
            decisions={scenario.decisions}
            actionsTakenCount={actionsTaken.length}
            onDecide={makeDecision}
          />
        </div>

        {/* Right column: results */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Investigation Results
          </h3>
          {completedActions.length === 0 ? (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-sm">
                Click an investigation action to view its results here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedActions.map(action => (
                <ActionResult key={action.id} action={action} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
