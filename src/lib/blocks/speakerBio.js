export default function SpeakerBio({ attributes }) {
  const { name, role, org, bio, photoUrl, photoAlt } = attributes || {};

  return (
    <div className="tvgf-speaker-bio">
      {photoUrl && (
        <img className="tvgf-speaker-photo" src={photoUrl} alt={photoAlt || name || ""} />
      )}
      <div className="tvgf-speaker-info">
        <div className="tvgf-speaker-name">{name}</div>
        <div className="tvgf-speaker-role">{[role, org].filter(Boolean).join(", ")}</div>
        {bio && <p className="tvgf-speaker-bio-text">{bio}</p>}
      </div>
    </div>
  );
}
