export default function Comparison({ attributes }) {
  const columns = attributes?.columns || [];
  if (!columns.length) return null;

  return (
    <div className="tvgf-comparison">
      {columns.map((col, index) => (
        <div key={index} className="tvgf-comparison-col">
          <div className="tvgf-comparison-heading">{col.heading}</div>
          <p className="tvgf-comparison-body">{col.body}</p>
        </div>
      ))}
    </div>
  );
}
