/**
 * Validation Service
 *
 * Validates blip submissions according to the specification rules:
 * - General field validation (required fields, length constraints)
 * - Ring-specific validation (client examples, caution reasoning)
 * - Input sanitization for security
 */

import { BlipSubmission, ValidationError, Quadrant, Ring } from '../types';

const QUADRANTS: Quadrant[] = ['techniques', 'tools', 'platforms', 'languages-and-frameworks'];
const RINGS: Ring[] = ['adopt', 'trial', 'assess', 'caution'];

/**
 * Sanitizes text input to prevent XSS and injection attacks
 * Removes potentially dangerous characters while preserving plain text
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  // Decode HTML entities first
  text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  text = text.replace(/&#x?[0-9a-fA-F]+;/g, ''); // Remove other HTML entities

  // Remove HTML tags (including content within script/style tags)
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  text = text.replace(/<[^>]*>/g, '');

  // Remove potentially dangerous characters but keep basic punctuation
  text = text.replace(/[<>'"]/g, '');

  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Validates a blip submission
 * Returns array of validation errors (empty if valid)
 */
export function validateSubmission(data: Partial<BlipSubmission>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.push({
      field: 'name',
      message: 'Name is required'
    });
  } else if (data.name.length < 1 || data.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Name must be between 1 and 100 characters'
    });
  }

  // Validate quadrant
  if (!data.quadrant) {
    errors.push({
      field: 'quadrant',
      message: 'Quadrant is required'
    });
  } else if (!QUADRANTS.includes(data.quadrant as Quadrant)) {
    errors.push({
      field: 'quadrant',
      message: `Quadrant must be one of: ${QUADRANTS.join(', ')}`
    });
  }

  // Validate ring
  if (!data.ring) {
    errors.push({
      field: 'ring',
      message: 'Ring is required'
    });
  } else if (!RINGS.includes(data.ring as Ring)) {
    errors.push({
      field: 'ring',
      message: `Ring must be one of: ${RINGS.join(', ')}`
    });
  }

  // Validate description
  if (!data.description || typeof data.description !== 'string') {
    errors.push({
      field: 'description',
      message: 'Description is required'
    });
  } else if (data.description.length < 1 || data.description.length > 2000) {
    errors.push({
      field: 'description',
      message: 'Description must be between 1 and 2000 characters'
    });
  }

  // Ring-specific validation
  if (data.ring) {
    const ringErrors = validateRingSpecificRequirements(
      data.ring as Ring,
      data.clientExamples,
      data.cautionReasoning
    );
    errors.push(...ringErrors);
  }

  return errors;
}

/**
 * Validates ring-specific requirements
 */
function validateRingSpecificRequirements(
  ring: Ring,
  clientExamples?: string[],
  cautionReasoning?: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (ring) {
    case 'adopt':
      // Must have at least 2 client examples
      if (!clientExamples || !Array.isArray(clientExamples)) {
        errors.push({
          field: 'clientExamples',
          message: 'Adopt ring requires at least 2 client examples'
        });
      } else if (clientExamples.length < 2) {
        errors.push({
          field: 'clientExamples',
          message: 'Adopt ring requires at least 2 client examples'
        });
      } else {
        // Check each example is non-empty
        clientExamples.forEach((example, index) => {
          if (!example || typeof example !== 'string' || example.trim().length === 0) {
            errors.push({
              field: `clientExamples[${index}]`,
              message: `Client example ${index + 1} cannot be empty`
            });
          }
        });
      }
      break;

    case 'trial':
      // Must have at least 1 client example
      if (!clientExamples || !Array.isArray(clientExamples)) {
        errors.push({
          field: 'clientExamples',
          message: 'Trial ring requires at least 1 client example'
        });
      } else if (clientExamples.length < 1) {
        errors.push({
          field: 'clientExamples',
          message: 'Trial ring requires at least 1 client example'
        });
      } else {
        // Check first example is non-empty
        if (!clientExamples[0] || typeof clientExamples[0] !== 'string' || clientExamples[0].trim().length === 0) {
          errors.push({
            field: 'clientExamples[0]',
            message: 'Client example cannot be empty'
          });
        }
      }
      break;

    case 'caution':
      // Must have caution reasoning
      if (!cautionReasoning || typeof cautionReasoning !== 'string' || cautionReasoning.trim().length === 0) {
        errors.push({
          field: 'cautionReasoning',
          message: 'Caution ring requires reasoning including examples of issues encountered'
        });
      }
      break;

    case 'assess':
      // No additional requirements
      break;
  }

  return errors;
}

/**
 * Validates and sanitizes a complete submission
 * Returns sanitized submission and validation errors
 */
export function validateAndSanitize(data: Partial<BlipSubmission>): {
  sanitized: Partial<BlipSubmission>;
  errors: ValidationError[];
} {
  // Sanitize all text fields
  const sanitized: Partial<BlipSubmission> = {
    ...data,
    name: data.name ? sanitizeText(data.name) : undefined,
    description: data.description ? sanitizeText(data.description) : undefined,
    clientExamples: data.clientExamples?.map(sanitizeText),
    cautionReasoning: data.cautionReasoning ? sanitizeText(data.cautionReasoning) : undefined,
  };

  // Validate
  const errors = validateSubmission(sanitized);

  return { sanitized, errors };
}

/**
 * Checks if a value is a valid quadrant
 */
export function isValidQuadrant(value: unknown): value is Quadrant {
  return typeof value === 'string' && QUADRANTS.includes(value as Quadrant);
}

/**
 * Checks if a value is a valid ring
 */
export function isValidRing(value: unknown): value is Ring {
  return typeof value === 'string' && RINGS.includes(value as Ring);
}
