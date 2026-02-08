export default function ActionResult({ action }) {
  const { result } = action

  return (
    <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4">
      <h4 className="text-sm font-medium text-blue-400 mb-2">{action.label}</h4>
      {result.type === 'code' ? (
        <pre className="bg-slate-900 rounded p-3 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
          {result.content}
        </pre>
      ) : (
        <p className="text-sm text-gray-300 leading-relaxed">{result.content}</p>
      )}
    </div>
  )
}
