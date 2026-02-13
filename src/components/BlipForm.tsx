import { useState, useEffect } from 'react';
import { Quadrant, Ring, QUADRANTS, RINGS, ValidationError, SubmissionType, PriorRadarBlip } from '../types';
import { lookupPriorRadar, getCoaching, submitBlip } from '../services/api';
import FormField from './FormField';
import CoachingBox from './CoachingBox';
import PriorRadarMatch from './PriorRadarMatch';
import './BlipForm.css';

interface BlipFormProps {
  onSuccess: () => void;
}

interface FormData {
  name: string;
  quadrant: Quadrant | '';
  ring: Ring | '';
  description: string;
  clientExamples: string[];
  cautionReasoning: string;
}

const BlipForm = ({ onSuccess }: BlipFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    quadrant: '',
    ring: '',
    description: '',
    clientExamples: ['', ''],
    cautionReasoning: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [coaching, setCoaching] = useState<string>('');
  const [coachingLoading, setCoachingLoading] = useState(false);
  const [priorMatch, setPriorMatch] = useState<PriorRadarBlip | null>(null);
  const [priorMatchChecked, setPriorMatchChecked] = useState(false);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('new');
  const [suggestedNewRing, setSuggestedNewRing] = useState<Ring | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce coaching requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name || formData.description || formData.ring) {
        fetchCoaching();
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name, formData.quadrant, formData.ring, formData.description, formData.clientExamples, formData.cautionReasoning]);

  // Check for prior radar match when name changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name.length >= 3) {
        checkPriorRadar();
      } else {
        setPriorMatch(null);
        setPriorMatchChecked(false);
      }
    }, 800);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name]);

  const checkPriorRadar = async () => {
    try {
      const response = await lookupPriorRadar({ name: formData.name });
      if (response.success && response.data) {
        setPriorMatch(response.data.match || null);
        setPriorMatchChecked(true);
      }
    } catch (error) {
      console.error('Error checking prior radar:', error);
    }
  };

  const fetchCoaching = async () => {
    setCoachingLoading(true);
    try {
      const response = await getCoaching({
        name: formData.name || undefined,
        quadrant: formData.quadrant || undefined,
        ring: formData.ring || undefined,
        description: formData.description || undefined,
        clientExamples: formData.clientExamples.filter(e => e.trim().length > 0),
        cautionReasoning: formData.cautionReasoning || undefined,
        submissionType,
      });

      if (response.success && response.data) {
        setCoaching(response.data.coaching);
      }
    } catch (error) {
      console.error('Error fetching coaching:', error);
    } finally {
      setCoachingLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear field-specific errors
    setErrors(prev => prev.filter(e => e.field !== field));
  };

  const handleClientExampleChange = (index: number, value: string) => {
    const newExamples = [...formData.clientExamples];
    newExamples[index] = value;
    setFormData(prev => ({
      ...prev,
      clientExamples: newExamples,
    }));
  };

  const addClientExample = () => {
    setFormData(prev => ({
      ...prev,
      clientExamples: [...prev.clientExamples, ''],
    }));
  };

  const removeClientExample = (index: number) => {
    if (formData.clientExamples.length > getMinExamples()) {
      setFormData(prev => ({
        ...prev,
        clientExamples: prev.clientExamples.filter((_, i) => i !== index),
      }));
    }
  };

  const getMinExamples = (): number => {
    if (formData.ring === 'adopt') return 2;
    if (formData.ring === 'trial') return 1;
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      const submission = {
        name: formData.name,
        quadrant: formData.quadrant as Quadrant,
        ring: formData.ring as Ring,
        description: formData.description,
        clientExamples: formData.clientExamples.filter(e => e.trim().length > 0),
        cautionReasoning: formData.cautionReasoning || undefined,
        submissionType,
        priorRadarReference: priorMatch || undefined,
        suggestedNewRing: suggestedNewRing || undefined,
      };

      const response = await submitBlip(submission);

      if (response.success) {
        onSuccess();
      } else {
        setErrors(response.errors || []);
        if (response.message) {
          alert(response.message);
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(e => e.field === field)?.message;
  };

  const showClientExamples = formData.ring === 'adopt' || formData.ring === 'trial';
  const showCautionReasoning = formData.ring === 'caution';

  return (
    <form className="blip-form card" onSubmit={handleSubmit}>
      <div className="form-intro">
        <p>
          Submit a technology, tool, technique, or platform for consideration on the next
          Technology Radar. Your submission will be reviewed by the Radar editorial team.
        </p>
        <p className="form-note">
          <strong>Note:</strong> ~120 blips are selected from all submissions. Quality and
          specificity dramatically increase your chance of inclusion.
        </p>
      </div>

      <FormField
        label="Blip Name"
        required
        error={getFieldError('name')}
        description="Use the most widely recognized name. Avoid internal codenames or abbreviations."
      >
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., React, Kubernetes, Continuous Integration"
          maxLength={100}
          className={getFieldError('name') ? 'error' : ''}
        />
      </FormField>

      {priorMatchChecked && priorMatch && (
        <PriorRadarMatch
          match={priorMatch}
          onSelectType={(type) => setSubmissionType(type)}
          selectedType={submissionType}
          onSuggestedRingChange={(ring) => setSuggestedNewRing(ring)}
          suggestedRing={suggestedNewRing}
        />
      )}

      <FormField
        label="Quadrant"
        required
        error={getFieldError('quadrant')}
      >
        <select
          value={formData.quadrant}
          onChange={(e) => handleChange('quadrant', e.target.value)}
          className={getFieldError('quadrant') ? 'error' : ''}
        >
          <option value="">Select a quadrant...</option>
          {QUADRANTS.map((q) => (
            <option key={q.value} value={q.value}>
              {q.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Ring"
        required
        error={getFieldError('ring')}
        description="Select the recommended adoption level for this technology."
      >
        <select
          value={formData.ring}
          onChange={(e) => handleChange('ring', e.target.value)}
          className={getFieldError('ring') ? 'error' : ''}
        >
          <option value="">Select a ring...</option>
          {RINGS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label} — {r.description}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Description"
        required
        error={getFieldError('description')}
        description="Describe what it is, why it matters, and what your experience has been. Be specific and concrete."
      >
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Share your specific experience and observations..."
          maxLength={2000}
          className={getFieldError('description') ? 'error' : ''}
        />
        <div className="char-count">
          {formData.description.length} / 2000
        </div>
      </FormField>

      {showClientExamples && (
        <div className="client-examples-section">
          <FormField
            label="Client Examples"
            required
            description={`Provide ${getMinExamples()} or more specific client examples. Include client name, industry/domain, context, and outcome.`}
          >
            <div className="client-examples-list">
              {formData.clientExamples.map((example, index) => (
                <div key={index} className="client-example-item">
                  <textarea
                    value={example}
                    onChange={(e) => handleClientExampleChange(index, e.target.value)}
                    placeholder={`Example ${index + 1}: Client name, industry, context, outcome...`}
                    rows={3}
                    className={getFieldError(`clientExamples[${index}]`) ? 'error' : ''}
                  />
                  {formData.clientExamples.length > getMinExamples() && (
                    <button
                      type="button"
                      onClick={() => removeClientExample(index)}
                      className="button-outline button-small"
                    >
                      Remove
                    </button>
                  )}
                  {getFieldError(`clientExamples[${index}]`) && (
                    <div className="error-message">
                      {getFieldError(`clientExamples[${index}]`)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addClientExample}
              className="button-outline"
            >
              + Add Another Example
            </button>
          </FormField>
        </div>
      )}

      {showCautionReasoning && (
        <FormField
          label="Caution Reasoning"
          required
          error={getFieldError('cautionReasoning')}
          description="Clearly articulate the problems encountered, attempts to resolve them, and why the Caution recommendation is warranted."
        >
          <textarea
            value={formData.cautionReasoning}
            onChange={(e) => handleChange('cautionReasoning', e.target.value)}
            placeholder="Describe specific issues, what was tried, and why teams should be cautious..."
            maxLength={2000}
            className={getFieldError('cautionReasoning') ? 'error' : ''}
          />
        </FormField>
      )}

      {coaching && (
        <CoachingBox coaching={coaching} loading={coachingLoading} />
      )}

      <div className="form-actions">
        <button
          type="submit"
          className="button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Blip'}
        </button>
      </div>
    </form>
  );
};

export default BlipForm;
