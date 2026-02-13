import './FormField.css';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
}

const FormField = ({ label, required, error, description, children }: FormFieldProps) => {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="required-indicator" aria-label="required">*</span>}
      </label>
      {description && <p className="field-description">{description}</p>}
      {children}
      {error && <div className="error-message" role="alert">{error}</div>}
    </div>
  );
};

export default FormField;
