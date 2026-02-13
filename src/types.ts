/**
 * Frontend types - mirrors backend types
 */

export type Quadrant = 'techniques' | 'tools' | 'platforms' | 'languages-and-frameworks';
export type Ring = 'adopt' | 'trial' | 'assess' | 'caution';
export type SubmissionType = 'new' | 'reblip' | 'move' | 'update';

export interface PriorRadarBlip {
  name: string;
  ring: string;
  quadrant: string;
  description: string;
  volume: string;
}

export interface BlipSubmission {
  id: string;
  name: string;
  quadrant: Quadrant;
  ring: Ring;
  description: string;
  clientExamples?: string[];
  cautionReasoning?: string;
  submissionType: SubmissionType;
  priorRadarReference?: PriorRadarBlip;
  suggestedNewRing?: Ring;
  createdAt: string;
}

export interface PriorRadarLookupRequest {
  name: string;
}

export interface PriorRadarLookupResponse {
  found: boolean;
  match?: PriorRadarBlip;
}

export interface CoachingRequest {
  name?: string;
  quadrant?: Quadrant;
  ring?: Ring;
  description?: string;
  clientExamples?: string[];
  cautionReasoning?: string;
  submissionType?: SubmissionType;
}

export interface CoachingResponse {
  coaching: string;
  unavailable?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  message?: string;
}

export const QUADRANTS: { value: Quadrant; label: string }[] = [
  { value: 'techniques', label: 'Techniques' },
  { value: 'tools', label: 'Tools' },
  { value: 'platforms', label: 'Platforms' },
  { value: 'languages-and-frameworks', label: 'Languages & Frameworks' },
];

export const RINGS: { value: Ring; label: string; description: string }[] = [
  {
    value: 'adopt',
    label: 'Adopt',
    description: 'Proven and recommended for broad use'
  },
  {
    value: 'trial',
    label: 'Trial',
    description: 'Worth pursuing; important to understand how to build up this capability'
  },
  {
    value: 'assess',
    label: 'Assess',
    description: 'Worth exploring to understand how it will affect the organization'
  },
  {
    value: 'caution',
    label: 'Caution',
    description: 'Proceed with caution; not recommended for new work'
  },
];
