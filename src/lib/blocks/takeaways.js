export default function Takeaways({ attributes }) {
  const items = attributes?.items || [];
  if (!items.length) return null;

  return (
    <div className="tvgf-takeaways-grid">
      {items.map((item, index) => (
        <div key={index} className="tvgf-takeaway">
          <div className="tvgf-takeaway-number">{String(index + 1).padStart(2, "0")}</div>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
