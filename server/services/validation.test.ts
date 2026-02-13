/**
 * Tests for validation service
 *
 * Covers:
 * - General field validation
 * - Ring-specific requirements
 * - Input sanitization
 * - XSS prevention
 * - SQL injection prevention
 */

import { validateSubmission, validateAndSanitize, sanitizeText, isValidQuadrant, isValidRing } from './validation';
import { BlipSubmission } from '../types';

describe('Validation Service', () => {
  describe('sanitizeText', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('');
      expect(sanitizeText('Hello <b>world</b>')).toBe('Hello world');
      expect(sanitizeText('<div>Test</div>')).toBe('Test');
    });

    it('should remove potentially dangerous characters', () => {
      expect(sanitizeText('Test<>"\'')).toBe('Test');
      expect(sanitizeText('Normal text')).toBe('Normal text');
    });

    it('should normalize whitespace', () => {
      expect(sanitizeText('  Multiple   spaces  ')).toBe('Multiple spaces');
      expect(sanitizeText('Line\nbreak')).toBe('Line break');
    });

    it('should handle empty strings', () => {
      expect(sanitizeText('')).toBe('');
      expect(sanitizeText('   ')).toBe('');
    });

    it('should preserve safe punctuation', () => {
      expect(sanitizeText('Hello, world! How are you?')).toBe('Hello, world! How are you?');
      expect(sanitizeText('React.js')).toBe('React.js');
    });
  });

  describe('validateSubmission', () => {
    const validBase: Partial<BlipSubmission> = {
      name: 'React',
      quadrant: 'languages-and-frameworks',
      ring: 'adopt',
      description: 'A JavaScript library for building user interfaces',
      clientExamples: ['Client A', 'Client B']
    };

    it('should validate a complete valid submission', () => {
      const errors = validateSubmission(validBase);
      expect(errors).toHaveLength(0);
    });

    it('should require name', () => {
      const errors = validateSubmission({ ...validBase, name: undefined });
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Name is required'
      });
    });

    it('should enforce name length constraints', () => {
      const errors1 = validateSubmission({ ...validBase, name: '' });
      expect(errors1.some(e => e.field === 'name')).toBe(true);

      const longName = 'A'.repeat(101);
      const errors2 = validateSubmission({ ...validBase, name: longName });
      expect(errors2).toContainEqual({
        field: 'name',
        message: 'Name must be between 1 and 100 characters'
      });
    });

    it('should require quadrant', () => {
      const errors = validateSubmission({ ...validBase, quadrant: undefined });
      expect(errors).toContainEqual({
        field: 'quadrant',
        message: 'Quadrant is required'
      });
    });

    it('should validate quadrant values', () => {
      const errors = validateSubmission({ ...validBase, quadrant: 'invalid' as any });
      expect(errors.some(e => e.field === 'quadrant')).toBe(true);
    });

    it('should require ring', () => {
      const errors = validateSubmission({ ...validBase, ring: undefined });
      expect(errors).toContainEqual({
        field: 'ring',
        message: 'Ring is required'
      });
    });

    it('should validate ring values', () => {
      const errors = validateSubmission({ ...validBase, ring: 'invalid' as any });
      expect(errors.some(e => e.field === 'ring')).toBe(true);
    });

    it('should require description', () => {
      const errors = validateSubmission({ ...validBase, description: undefined });
      expect(errors).toContainEqual({
        field: 'description',
        message: 'Description is required'
      });
    });

    it('should enforce description length constraints', () => {
      const errors1 = validateSubmission({ ...validBase, description: '' });
      expect(errors1.some(e => e.field === 'description')).toBe(true);

      const longDesc = 'A'.repeat(2001);
      const errors2 = validateSubmission({ ...validBase, description: longDesc });
      expect(errors2).toContainEqual({
        field: 'description',
        message: 'Description must be between 1 and 2000 characters'
      });
    });

    describe('Ring-specific validation', () => {
      it('should require 2 client examples for Adopt ring', () => {
        const errors1 = validateSubmission({
          ...validBase,
          ring: 'adopt',
          clientExamples: []
        });
        expect(errors1.some(e => e.field === 'clientExamples')).toBe(true);

        const errors2 = validateSubmission({
          ...validBase,
          ring: 'adopt',
          clientExamples: ['Only one']
        });
        expect(errors2).toContainEqual({
          field: 'clientExamples',
          message: 'Adopt ring requires at least 2 client examples'
        });
      });

      it('should require non-empty client examples for Adopt', () => {
        const errors = validateSubmission({
          ...validBase,
          ring: 'adopt',
          clientExamples: ['Example 1', '']
        });
        expect(errors.some(e => e.field === 'clientExamples[1]')).toBe(true);
      });

      it('should require 1 client example for Trial ring', () => {
        const errors = validateSubmission({
          ...validBase,
          ring: 'trial',
          clientExamples: []
        });
        expect(errors.some(e => e.field === 'clientExamples')).toBe(true);
      });

      it('should require non-empty client example for Trial', () => {
        const errors = validateSubmission({
          ...validBase,
          ring: 'trial',
          clientExamples: ['']
        });
        expect(errors.some(e => e.field === 'clientExamples[0]')).toBe(true);
      });

      it('should not require client examples for Assess ring', () => {
        const errors = validateSubmission({
          ...validBase,
          ring: 'assess',
          clientExamples: undefined
        });
        expect(errors).toHaveLength(0);
      });

      it('should require caution reasoning for Caution ring', () => {
        const errors1 = validateSubmission({
          ...validBase,
          ring: 'caution',
          cautionReasoning: undefined
        });
        expect(errors1.some(e => e.field === 'cautionReasoning')).toBe(true);

        const errors2 = validateSubmission({
          ...validBase,
          ring: 'caution',
          cautionReasoning: ''
        });
        expect(errors2.some(e => e.field === 'cautionReasoning')).toBe(true);
      });
    });
  });

  describe('validateAndSanitize', () => {
    it('should sanitize and validate submission', () => {
      const input: Partial<BlipSubmission> = {
        name: 'React <span>Framework</span>',
        quadrant: 'languages-and-frameworks',
        ring: 'adopt',
        description: 'A <b>JavaScript</b> library',
        clientExamples: ['<div>Client A</div>', 'Client B']
      };

      const { sanitized, errors } = validateAndSanitize(input);

      expect(sanitized.name).toBe('React Framework');
      expect(sanitized.description).toBe('A JavaScript library');
      expect(sanitized.clientExamples).toEqual(['Client A', 'Client B']);
      expect(errors).toHaveLength(0);
    });

    it('should return validation errors for invalid input', () => {
      const input: Partial<BlipSubmission> = {
        name: '',
        quadrant: 'invalid' as any,
        ring: 'adopt',
        description: 'Test'
      };

      const { errors } = validateAndSanitize(input);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Security Tests - XSS Prevention', () => {
    it('should prevent script injection in name', () => {
      const malicious = '<script>alert("xss")</script>';
      const { sanitized } = validateAndSanitize({
        name: malicious,
        quadrant: 'techniques',
        ring: 'assess',
        description: 'Test'
      });

      expect(sanitized.name).not.toContain('<script>');
      expect(sanitized.name).not.toContain('</script>');
    });

    it('should prevent event handler injection', () => {
      const malicious = '<img src=x onerror="alert(1)">';
      const { sanitized } = validateAndSanitize({
        name: 'Test',
        quadrant: 'techniques',
        ring: 'assess',
        description: malicious
      });

      expect(sanitized.description).not.toContain('onerror');
      expect(sanitized.description).not.toContain('<img');
    });

    it('should prevent encoded XSS attempts', () => {
      const encoded = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      const { sanitized } = validateAndSanitize({
        name: encoded,
        quadrant: 'techniques',
        ring: 'assess',
        description: 'Test'
      });

      // Should not contain dangerous patterns
      expect(sanitized.name).not.toContain('script');
    });

    it('should prevent XSS in client examples', () => {
      const malicious = ['<script>alert("xss")</script>', 'Normal example'];
      const { sanitized } = validateAndSanitize({
        name: 'Test',
        quadrant: 'techniques',
        ring: 'trial',
        description: 'Test',
        clientExamples: malicious
      });

      expect(sanitized.clientExamples?.[0]).not.toContain('<script>');
      expect(sanitized.clientExamples?.[1]).toBe('Normal example');
    });
  });

  describe('Security Tests - SQL Injection Prevention', () => {
    it('should handle SQL injection attempts in text fields', () => {
      const sqlInjection = "'; DROP TABLE blips; --";
      const { sanitized, errors } = validateAndSanitize({
        name: sqlInjection,
        quadrant: 'techniques',
        ring: 'assess',
        description: sqlInjection
      });

      // Should be sanitized but not cause validation errors
      expect(errors.some(e => e.field === 'name' && e.message.includes('required'))).toBe(false);
      expect(sanitized.name).toBeDefined();
      expect(sanitized.description).toBeDefined();
    });

    it('should handle SQL keywords without breaking', () => {
      const sqlKeywords = 'SELECT * FROM users WHERE id = 1 OR 1=1';
      const { sanitized } = validateAndSanitize({
        name: 'Test',
        quadrant: 'techniques',
        ring: 'assess',
        description: sqlKeywords
      });

      expect(sanitized.description).toBeDefined();
    });
  });

  describe('isValidQuadrant', () => {
    it('should validate quadrant values', () => {
      expect(isValidQuadrant('techniques')).toBe(true);
      expect(isValidQuadrant('tools')).toBe(true);
      expect(isValidQuadrant('platforms')).toBe(true);
      expect(isValidQuadrant('languages-and-frameworks')).toBe(true);
      expect(isValidQuadrant('invalid')).toBe(false);
      expect(isValidQuadrant(null)).toBe(false);
      expect(isValidQuadrant(undefined)).toBe(false);
    });
  });

  describe('isValidRing', () => {
    it('should validate ring values', () => {
      expect(isValidRing('adopt')).toBe(true);
      expect(isValidRing('trial')).toBe(true);
      expect(isValidRing('assess')).toBe(true);
      expect(isValidRing('caution')).toBe(true);
      expect(isValidRing('invalid')).toBe(false);
      expect(isValidRing(null)).toBe(false);
      expect(isValidRing(undefined)).toBe(false);
    });
  });
});
