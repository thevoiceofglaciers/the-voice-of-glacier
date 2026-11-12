export default function Callout({ attributes }) {
  const { variant = "insight", title, body } = attributes || {};

  return (
    <div className={`tvgf-callout tvgf-callout-${variant}`}>
      {title && <div className="tvgf-callout-title">{title}</div>}
      <p className="tvgf-callout-body">{body}</p>
    </div>
  );
}
