/**
 * API client for communicating with the backend
 */

import {
  PriorRadarLookupRequest,
  PriorRadarLookupResponse,
  CoachingRequest,
  CoachingResponse,
  BlipSubmission,
  ApiResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
}

/**
 * Health check
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Look up a blip in prior radars
 */
export async function lookupPriorRadar(
  request: PriorRadarLookupRequest
): Promise<ApiResponse<PriorRadarLookupResponse>> {
  return apiRequest<PriorRadarLookupResponse>('/prior-radar-lookup', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Get coaching for a submission
 */
export async function getCoaching(
  request: CoachingRequest
): Promise<ApiResponse<CoachingResponse>> {
  return apiRequest<CoachingResponse>('/coaching', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Submit a blip
 */
export async function submitBlip(
  submission: Partial<BlipSubmission>
): Promise<ApiResponse<{ id: string }>> {
  return apiRequest<{ id: string }>('/submit', {
    method: 'POST',
    body: JSON.stringify(submission),
  });
}
