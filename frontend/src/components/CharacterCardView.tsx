import './CharacterCardView.css';

interface CharacterCardViewProps {
  onClose: () => void;
}

function CharacterCardView({ onClose }: CharacterCardViewProps) {
  return (
    <div className="character-card-fullscreen">
      <button className="character-card-close-btn" onClick={onClose}>
        ✕
      </button>

      <div className="character-card-header-section">
        <h1 className="character-card-title">Character Card</h1>
      </div>

      <div className="character-card-main-content">
        {/* Content area for todos and other details */}
      </div>
    </div>
  );
}

export default CharacterCardView;
