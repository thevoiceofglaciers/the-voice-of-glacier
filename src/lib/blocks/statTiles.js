export default function StatTiles({ attributes }) {
  const tiles = attributes?.tiles || [];
  if (!tiles.length) return null;

  return (
    <div className="tvgf-stat-tiles">
      {tiles.map((tile, index) => (
        <div key={index} className="tvgf-stat-tile">
          <div className="tvgf-stat-value">{tile.value}</div>
          <div className="tvgf-stat-label">{tile.label}</div>
          {tile.trend && <div className="tvgf-stat-trend">{tile.trend}</div>}
        </div>
      ))}
    </div>
  );
}
