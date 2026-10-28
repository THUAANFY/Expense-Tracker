export default function SourceFlowConnector({ warm = false }) {
  const curve = warm ? 'M0 28C20 28 22 37 40 34S61 23 80 28' : 'M0 28C20 28 22 18 40 22S61 33 80 28'
  return (
    <span className={`source-flow-connector ${warm ? 'is-warm' : ''}`} aria-hidden="true">
      <svg
        className="source-flow-curve"
        viewBox="0 0 80 56"
        preserveAspectRatio="none"
        fill="none"
        focusable="false"
      >
        <path d={curve} className="source-flow-glow" vectorEffect="non-scaling-stroke" />
        <path d={curve} className="source-flow-line" vectorEffect="non-scaling-stroke" />
        <path
          d={curve}
          className="source-flow-trace"
          pathLength="100"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}
