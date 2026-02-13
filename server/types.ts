/**
 * Shared type definitions for the Technology Radar Blip Submission application
 * These types are used across both frontend and backend
 */

/**
 * The four quadrants that classify a blip by its nature
 */
export type Quadrant = 'techniques' | 'tools' | 'platforms' | 'languages-and-frameworks';

/**
 * The four rings indicating recommended adoption level
 * Ordered from center (most recommended) to outer edge (least recommended)
 */
export type Ring = 'adopt' | 'trial' | 'assess' | 'caution';

/**
 * Type of submission determined by prior radar lookup
 */
export type SubmissionType = 'new' | 'reblip' | 'move' | 'update';

/**
 * A blip from a prior radar edition
 */
export interface PriorRadarBlip {
  name: string;
  ring: string;
  quadrant: string;
  description: string;
  volume: string; // e.g., "Volume 33 (Nov 2025)"
}

/**
 * Complete blip submission
 */
export interface BlipSubmission {
  id: string;
  name: string;
  quadrant: Quadrant;
  ring: Ring;
  description: string;
  clientExamples?: string[]; // Required for Adopt (2+) and Trial (1+)
  cautionReasoning?: string; // Required for Caution ring
  submissionType: SubmissionType;
  priorRadarReference?: PriorRadarBlip;
  suggestedNewRing?: Ring; // Required when submissionType is 'move'
  createdAt: string; // ISO 8601 timestamp
}

/**
 * Request to check if a blip exists in prior radars
 */
export interface PriorRadarLookupRequest {
  name: string;
}

/**
 * Response from prior radar lookup
 */
export interface PriorRadarLookupResponse {
  found: boolean;
  match?: PriorRadarBlip;
}

/**
 * Request for LLM coaching
 */
export interface CoachingRequest {
  name?: string;
  quadrant?: Quadrant;
  ring?: Ring;
  description?: string;
  clientExamples?: string[];
  cautionReasoning?: string;
  submissionType?: SubmissionType;
}

/**
 * Response from LLM coaching
 */
export interface CoachingResponse {
  coaching: string;
  unavailable?: boolean; // True if LLM service is unavailable
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  message?: string;
}
