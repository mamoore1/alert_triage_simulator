import { useState, useCallback, useMemo } from 'react'
import { calculateScore } from '../utils/scoring'
import scenario001 from '../data/scenarios/scenario_001.json'
import scenario002 from '../data/scenarios/scenario_002.json'
import scenario003 from '../data/scenarios/scenario_003.json'

const scenarios = { scenario_001: scenario001, scenario_002: scenario002, scenario_003: scenario003 }

function isUnlocked(action, actionsTaken) {
  // No requires field or empty array = Tier 1, always available
  if (!action.requires || action.requires.length === 0) return true
  // OR logic: any one prerequisite being completed unlocks the action
  return action.requires.some(prereq => actionsTaken.includes(prereq))
}

export function useScenario() {
  const [scenario, setScenario] = useState(null)
  const [actionsTaken, setActionsTaken] = useState([])
  const [decision, setDecision] = useState(null)
  const [result, setResult] = useState(null)
  const [phase, setPhase] = useState('select') // select | investigate | result
  // Track IDs that were unlocked before the latest action, so we can detect new unlocks
  const [prevUnlockedIds, setPrevUnlockedIds] = useState(new Set())

  const availableScenarios = Object.values(scenarios).map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    difficulty: s.difficulty,
    severity: s.alert.severity,
  }))

  const unlockedActions = useMemo(() => {
    if (!scenario) return []
    return scenario.investigation_actions.filter(a => isUnlocked(a, actionsTaken))
  }, [scenario, actionsTaken])

  // IDs that just appeared (weren't in the previous unlocked set)
  const newlyUnlockedIds = useMemo(() => {
    const currentIds = new Set(unlockedActions.map(a => a.id))
    const newIds = new Set()
    for (const id of currentIds) {
      if (!prevUnlockedIds.has(id)) newIds.add(id)
    }
    return newIds
  }, [unlockedActions, prevUnlockedIds])

  const loadScenario = useCallback((id) => {
    const s = scenarios[id]
    if (!s) return
    setScenario(s)
    setActionsTaken([])
    setDecision(null)
    setResult(null)
    setPhase('investigate')
    // Initialize prevUnlockedIds with Tier 1 actions so they don't fade in
    const tier1Ids = new Set(
      s.investigation_actions
        .filter(a => !a.requires || a.requires.length === 0)
        .map(a => a.id)
    )
    setPrevUnlockedIds(tier1Ids)
  }, [])

  const performAction = useCallback((actionId) => {
    setActionsTaken(prev => {
      if (prev.includes(actionId)) return prev
      // Snapshot current unlocked IDs before the state updates
      if (scenario) {
        const currentUnlocked = new Set(
          scenario.investigation_actions
            .filter(a => isUnlocked(a, prev))
            .map(a => a.id)
        )
        setPrevUnlockedIds(currentUnlocked)
      }
      return [...prev, actionId]
    })
  }, [scenario])

  const makeDecision = useCallback((decisionId) => {
    if (!scenario) return
    setDecision(decisionId)
    const scoreResult = calculateScore({
      actionsTaken,
      decisionId,
      scenario,
    })
    setResult(scoreResult)
    setPhase('result')
  }, [scenario, actionsTaken])

  const reset = useCallback(() => {
    setScenario(null)
    setActionsTaken([])
    setDecision(null)
    setResult(null)
    setPhase('select')
    setPrevUnlockedIds(new Set())
  }, [])

  const retry = useCallback(() => {
    if (!scenario) return
    setActionsTaken([])
    setDecision(null)
    setResult(null)
    setPhase('investigate')
    const tier1Ids = new Set(
      scenario.investigation_actions
        .filter(a => !a.requires || a.requires.length === 0)
        .map(a => a.id)
    )
    setPrevUnlockedIds(tier1Ids)
  }, [scenario])

  return {
    scenario,
    actionsTaken,
    decision,
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
  }
}
