import './SuccessMessage.css';

interface SuccessMessageProps {
  onSubmitAnother: () => void;
}

const SuccessMessage = ({ onSubmitAnother }: SuccessMessageProps) => {
  return (
    <div className="success-message-container card">
      <div className="success-icon">✅</div>
      <h2>Submission Successful!</h2>
      <p className="success-text">
        Thank you for your submission. Your blip has been saved and will be reviewed
        by the Technology Radar editorial team.
      </p>
      <p className="success-info">
        The editorial team will evaluate all submissions and select approximately 120 blips
        for inclusion in the next published radar. Quality and specificity of your submission
        significantly improve your chances of being selected.
      </p>
      <div className="success-actions">
        <button onClick={onSubmitAnother} className="button-primary">
          Submit Another Blip
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
