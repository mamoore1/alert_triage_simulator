import { useState, useEffect } from 'react'

const STORAGE_KEY = 'soc-triage-onboarding-seen'

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-slate-800 border border-slate-700/60 rounded-xl max-w-lg w-full p-8 animate-[fadeSlideIn_0.3s_ease-out]">
        <h2 className="text-xl font-bold text-white mb-4">Welcome, Analyst</h2>

        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          You're a SOC analyst investigating security alerts. Click investigation
          actions to gather evidence, then make your triage decision. You'll be
          scored on both your conclusion and investigation efficiency.
        </p>

        {/* UI layout diagram */}
        <div className="bg-slate-900 border border-slate-700/40 rounded-lg p-4 mb-6">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">How it works</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded bg-yellow-500/15 text-yellow-400 flex items-center justify-center text-xs">1</span>
              <span className="text-gray-400">Review the alert details at the top of the screen</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded bg-blue-500/15 text-blue-400 flex items-center justify-center text-xs">2</span>
              <span className="text-gray-400">Click investigation actions on the left to gather evidence</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded bg-green-500/15 text-green-400 flex items-center justify-center text-xs">3</span>
              <span className="text-gray-400">Results appear on the right — new actions may unlock as you investigate</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-xs">4</span>
              <span className="text-gray-400">Make your triage decision when you've gathered enough evidence</span>
            </div>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
