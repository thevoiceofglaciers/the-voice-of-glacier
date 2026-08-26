export default function DataTable({ attributes }) {
  const rows = attributes?.rows || [];
  if (!rows.length) return null;

  return (
    <div className="tvgf-data-table">
      {attributes?.header && <div className="tvgf-data-table-header">{attributes.header}</div>}
      {rows.map((row, index) => (
        <div key={index} className="tvgf-data-row">
          <div className="tvgf-data-label">{row.label}</div>
          <div className="tvgf-data-value">{row.value}</div>
        </div>
      ))}
    </div>
  );
}
