const severityStyles = {
  Critical: 'bg-red-500/10 border-red-500/40 text-red-400',
  High: 'bg-orange-500/10 border-orange-500/40 text-orange-400',
  Medium: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400',
  Low: 'bg-blue-500/10 border-blue-500/40 text-blue-400',
}

const severityDot = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-blue-500',
}

export default function AlertDisplay({ alert }) {
  const style = severityStyles[alert.severity] || severityStyles.Medium
  const dot = severityDot[alert.severity] || severityDot.Medium

  return (
    <div className={`rounded-lg border p-5 ${style}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
            <span className="text-xs font-medium uppercase tracking-wide opacity-80">
              {alert.severity} Severity
            </span>
          </div>
          <h2 className="text-lg font-semibold text-white">{alert.title}</h2>
        </div>
        <span className="text-xs text-gray-500 shrink-0 mt-1">{alert.timestamp}</span>
      </div>

      <div className="space-y-2">
        {Object.entries(alert.fields).map(([key, value]) => (
          <div key={key} className="flex gap-3 text-sm">
            <span className="text-gray-500 shrink-0 w-36">{key}</span>
            <span className="text-gray-200 font-mono text-xs break-all">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
