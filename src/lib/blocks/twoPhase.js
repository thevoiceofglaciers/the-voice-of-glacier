export default function TwoPhase({ attributes }) {
  const a = attributes || {};
  if (!a.leftHeader && !a.rightHeader) return null;

  return (
    <div className="tvgf-two-phase">
      <div className={`tvgf-phase-header tvgf-phase-${a.leftColor || "teal"}`}>{a.leftHeader}</div>
      <div className={`tvgf-phase-header tvgf-phase-${a.rightColor || "navy"}`}>{a.rightHeader}</div>
      <div className="tvgf-phase-body tvgf-phase-left">
        <p>
          {a.leftLead && <strong>{a.leftLead} </strong>}
          {a.leftText}
        </p>
      </div>
      <div className="tvgf-phase-body tvgf-phase-right">
        <p>
          {a.rightLead && <strong>{a.rightLead} </strong>}
          {a.rightText}
        </p>
      </div>
    </div>
  );
}
