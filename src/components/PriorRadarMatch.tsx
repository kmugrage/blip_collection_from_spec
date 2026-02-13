import { PriorRadarBlip, SubmissionType, Ring, RINGS } from '../types';
import './PriorRadarMatch.css';

interface PriorRadarMatchProps {
  match: PriorRadarBlip;
  onSelectType: (type: SubmissionType) => void;
  selectedType: SubmissionType;
  onSuggestedRingChange: (ring: Ring) => void;
  suggestedRing: Ring | '';
}

const PriorRadarMatch = ({
  match,
  onSelectType,
  selectedType,
  onSuggestedRingChange,
  suggestedRing,
}: PriorRadarMatchProps) => {
  return (
    <div className="prior-radar-match info-box">
      <h3>📊 Prior Radar Match Found</h3>
      <div className="match-details">
        <p><strong>Name:</strong> {match.name}</p>
        <p><strong>Last Appeared:</strong> {match.volume}</p>
        <p><strong>Ring:</strong> {match.ring}</p>
        <p><strong>Quadrant:</strong> {match.quadrant}</p>
        <details className="match-description">
          <summary>View Description</summary>
          <div dangerouslySetInnerHTML={{ __html: match.description }} />
        </details>
      </div>

      <div className="submission-type-selector">
        <p><strong>How would you like to proceed?</strong></p>

        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="submissionType"
              value="reblip"
              checked={selectedType === 'reblip'}
              onChange={() => onSelectType('reblip')}
            />
            <div className="radio-content">
              <strong>Reblip</strong>
              <span>Recommend it appear again unchanged because the advice hasn't been absorbed</span>
            </div>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="submissionType"
              value="move"
              checked={selectedType === 'move'}
              onChange={() => onSelectType('move')}
            />
            <div className="radio-content">
              <strong>Suggest ring change</strong>
              <span>Recommend moving it to a different ring</span>
            </div>
          </label>

          {selectedType === 'move' && (
            <div className="suggested-ring-selector">
              <label>New suggested ring:</label>
              <select
                value={suggestedRing}
                onChange={(e) => onSuggestedRingChange(e.target.value as Ring)}
              >
                <option value="">Select a ring...</option>
                {RINGS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="radio-option">
            <input
              type="radio"
              name="submissionType"
              value="update"
              checked={selectedType === 'update'}
              onChange={() => onSelectType('update')}
            />
            <div className="radio-content">
              <strong>Suggest updated description</strong>
              <span>Propose new or additional information for the description</span>
            </div>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="submissionType"
              value="new"
              checked={selectedType === 'new'}
              onChange={() => onSelectType('new')}
            />
            <div className="radio-content">
              <strong>Submit as new</strong>
              <span>Continue with my submission independent of the prior radar entry</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PriorRadarMatch;
