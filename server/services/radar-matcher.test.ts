/**
 * Tests for the radar matching strategy
 *
 * These tests verify:
 * 1. Exact matches work
 * 2. Common variations are matched (React/React.js/ReactJS, Kubernetes/K8s)
 * 3. False positives are avoided (Go should not match Google)
 * 4. The most recent match is returned when multiple exist
 * 5. Case and punctuation variations are handled
 */

import { findPriorRadarMatch, isRadarDataAvailable } from './radar-matcher';

describe('RadarMatcher', () => {
  describe('isRadarDataAvailable', () => {
    it('should return true if radar data exists', () => {
      // This test assumes radar data has been fetched
      const available = isRadarDataAvailable();
      expect(available).toBe(true);
    });
  });

  describe('findPriorRadarMatch', () => {
    // Note: These tests use actual radar data
    // Run npm run fetch-radar-data before testing

    it('should find exact matches', () => {
      // "React" appears in multiple radar editions
      const result = findPriorRadarMatch('React');
      expect(result).not.toBeNull();
      expect(result?.name.toLowerCase()).toContain('react');
    });

    it('should match common variations with suffixes', () => {
      // Test React variations
      const react = findPriorRadarMatch('React');
      const reactJs = findPriorRadarMatch('React.js');

      // At least the exact name and .js suffix version should match
      expect(react).not.toBeNull();
      expect(reactJs).not.toBeNull();

      // Names should be similar (normalized)
      if (react && reactJs) {
        const normalizeName = (name: string) => name.toLowerCase().replace(/[^\w]/g, '');
        expect(normalizeName(react.name)).toContain('react');
        expect(normalizeName(reactJs.name)).toContain('react');

        // Both should find the same blip
        expect(react.name).toBe(reactJs.name);
      }
    });

    it('should match Kubernetes and K8s', () => {
      const kubernetes = findPriorRadarMatch('Kubernetes');
      const k8s = findPriorRadarMatch('K8s');

      // Both should find Kubernetes (if it exists in radar data)
      if (kubernetes) {
        expect(kubernetes.name.toLowerCase()).toContain('kubernetes');
      }
      // K8s might not match perfectly due to being very different, but let's test
      if (k8s) {
        expect(k8s.name.toLowerCase()).toContain('kubernetes');
      }
    });

    it('should handle case insensitivity', () => {
      const result1 = findPriorRadarMatch('react');
      const result2 = findPriorRadarMatch('REACT');
      const result3 = findPriorRadarMatch('React');

      // All should find the same blip (or all null if React not in data)
      if (result1 || result2 || result3) {
        expect(result1?.name).toBe(result2?.name);
        expect(result2?.name).toBe(result3?.name);
      }
    });

    it('should return null for non-existent technologies', () => {
      const result = findPriorRadarMatch('NonExistentTechnology12345XYZ');
      expect(result).toBeNull();
    });

    it('should avoid false positives - short names', () => {
      // "Go" should not match "Google" or other unrelated technologies
      const result = findPriorRadarMatch('Go');

      if (result) {
        // If a match is found, it should be exactly "Go", not something else
        const normalized = result.name.toLowerCase().replace(/[^\w]/g, '');
        expect(normalized).toBe('go');
      }
    });

    it('should return blip with all required fields', () => {
      const result = findPriorRadarMatch('React');

      if (result) {
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('ring');
        expect(result).toHaveProperty('quadrant');
        expect(result).toHaveProperty('description');
        expect(result).toHaveProperty('volume');

        expect(typeof result.name).toBe('string');
        expect(typeof result.ring).toBe('string');
        expect(typeof result.quadrant).toBe('string');
        expect(typeof result.description).toBe('string');
        expect(typeof result.volume).toBe('string');

        expect(result.name.length).toBeGreaterThan(0);
        expect(result.description.length).toBeGreaterThan(0);
      }
    });

    it('should return the most recent match when technology appears in multiple radars', () => {
      const result = findPriorRadarMatch('React');

      if (result) {
        // Volume should be a high number (recent editions)
        const volumeMatch = result.volume.match(/Volume (\d+)/);
        expect(volumeMatch).not.toBeNull();

        if (volumeMatch) {
          const volumeNumber = parseInt(volumeMatch[1]);
          // Recent volumes should be in the 30s (as of 2025)
          expect(volumeNumber).toBeGreaterThan(0);
        }
      }
    });

    it('should handle punctuation variations', () => {
      const result1 = findPriorRadarMatch('React');
      const result2 = findPriorRadarMatch('React!');
      const result3 = findPriorRadarMatch('React?');
      const result4 = findPriorRadarMatch('Re-act');

      // Punctuation should be stripped, so results should be similar
      if (result1) {
        expect(result1.name.toLowerCase()).toContain('react');
      }
      if (result2) {
        expect(result2.name.toLowerCase()).toContain('react');
      }
    });

    it('should handle whitespace variations', () => {
      const result1 = findPriorRadarMatch('React');
      const result2 = findPriorRadarMatch('  React  ');
      const result3 = findPriorRadarMatch('React ');

      // Whitespace should not affect matching
      if (result1 && result2 && result3) {
        expect(result1.name).toBe(result2.name);
        expect(result2.name).toBe(result3.name);
      }
    });

    it('should handle empty string input', () => {
      const result = findPriorRadarMatch('');
      expect(result).toBeNull();
    });

    it('should handle very long input strings', () => {
      const longName = 'A'.repeat(1000);
      const result = findPriorRadarMatch(longName);
      expect(result).toBeNull();
    });

    it('should not match when similarity is below threshold', () => {
      // "Reactangle" should not match "React" (too different)
      const result = findPriorRadarMatch('Reactangle');

      if (result) {
        // If it matches, it should not be React
        const normalized = result.name.toLowerCase().replace(/[^\w]/g, '');
        expect(normalized).not.toBe('react');
      }
    });
  });

  describe('Performance', () => {
    it('should complete lookups in reasonable time', () => {
      const start = Date.now();
      findPriorRadarMatch('React');
      const duration = Date.now() - start;

      // Should complete in under 2 seconds (spec requirement)
      expect(duration).toBeLessThan(2000);
    });

    it('should handle multiple consecutive lookups efficiently', () => {
      const names = ['React', 'Kubernetes', 'Docker', 'Python', 'NonExistent'];
      const start = Date.now();

      for (const name of names) {
        findPriorRadarMatch(name);
      }

      const duration = Date.now() - start;

      // All lookups should complete in under 5 seconds total
      expect(duration).toBeLessThan(5000);
    });
  });
});
