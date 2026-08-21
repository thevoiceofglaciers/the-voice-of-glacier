export default function ContextStrip({ attributes }) {
  const items = attributes?.items || [];
  if (!items.length) return null;

  return (
    <div className="tvgf-context-strip">
      {items.map((item, index) => (
        <div key={index} className="tvgf-context-item">
          {item.icon && <span className="tvgf-context-icon">{item.icon}</span>}
          <div>
            <div className="tvgf-context-label">{item.label}</div>
            <div className="tvgf-context-value">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
