/**
 * Tests for the storage service
 *
 * These tests verify:
 * 1. Basic save and load operations work
 * 2. Concurrent writes don't corrupt data
 * 3. File locking prevents race conditions
 * 4. Atomic writes ensure data integrity
 * 5. Storage gracefully handles errors
 */

import fs from 'fs';
import path from 'path';
import { saveSubmission, loadSubmissions, isStorageAvailable, getStorageStats } from './storage';
import { BlipSubmission } from '../types';

// Use a test-specific storage path
const TEST_STORAGE_PATH = path.join(process.cwd(), 'data', 'test-submissions.json');
process.env.STORAGE_PATH = TEST_STORAGE_PATH;

describe('Storage Service', () => {
  beforeEach(() => {
    // Clean up before each test
    const dir = path.dirname(TEST_STORAGE_PATH);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.startsWith('test-submissions')) {
          fs.unlinkSync(path.join(dir, file));
        }
      }
    }
  });

  afterAll(() => {
    // Clean up after all tests
    const dir = path.dirname(TEST_STORAGE_PATH);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.startsWith('test-submissions')) {
          try {
            fs.unlinkSync(path.join(dir, file));
          } catch (e) {
            // Ignore
          }
        }
      }
    }
  });

  describe('isStorageAvailable', () => {
    it('should return true when storage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });
  });

  describe('loadSubmissions', () => {
    it('should return empty array when file does not exist', () => {
      const submissions = loadSubmissions();
      expect(submissions).toEqual([]);
    });

    it('should load existing submissions', async () => {
      const submission: BlipSubmission = {
        id: 'test-1',
        name: 'Test Blip',
        quadrant: 'techniques',
        ring: 'adopt',
        description: 'Test description',
        submissionType: 'new',
        createdAt: new Date().toISOString()
      };

      await saveSubmission(submission);
      const loaded = loadSubmissions();

      expect(loaded).toHaveLength(1);
      expect(loaded[0]).toEqual(submission);
    });
  });

  describe('saveSubmission', () => {
    it('should save a new submission', async () => {
      const submission: BlipSubmission = {
        id: 'test-1',
        name: 'React',
        quadrant: 'languages-and-frameworks',
        ring: 'adopt',
        description: 'A JavaScript library for building user interfaces',
        clientExamples: ['Client A - Built dashboard', 'Client B - E-commerce platform'],
        submissionType: 'new',
        createdAt: new Date().toISOString()
      };

      await saveSubmission(submission);

      const submissions = loadSubmissions();
      expect(submissions).toHaveLength(1);
      expect(submissions[0].name).toBe('React');
      expect(submissions[0].quadrant).toBe('languages-and-frameworks');
      expect(submissions[0].ring).toBe('adopt');
    });

    it('should append multiple submissions', async () => {
      const submission1: BlipSubmission = {
        id: 'test-1',
        name: 'React',
        quadrant: 'languages-and-frameworks',
        ring: 'adopt',
        description: 'Test 1',
        submissionType: 'new',
        createdAt: new Date().toISOString()
      };

      const submission2: BlipSubmission = {
        id: 'test-2',
        name: 'Kubernetes',
        quadrant: 'platforms',
        ring: 'adopt',
        description: 'Test 2',
        submissionType: 'new',
        createdAt: new Date().toISOString()
      };

      await saveSubmission(submission1);
      await saveSubmission(submission2);

      const submissions = loadSubmissions();
      expect(submissions).toHaveLength(2);
      expect(submissions[0].name).toBe('React');
      expect(submissions[1].name).toBe('Kubernetes');
    });

    it('should create backup file on write', async () => {
      const submission1: BlipSubmission = {
        id: 'test-1',
        name: 'First',
        quadrant: 'techniques',
        ring: 'adopt',
        description: 'First submission',
        submissionType: 'new',
        createdAt: new Date().toISOString()
      };

      await saveSubmission(submission1);

      const submission2: BlipSubmission = {
        id: 'test-2',
        name: 'Second',
        quadrant: 'techniques',
        ring: 'adopt',
        description: 'Second submission',
        submissionType: 'new',
        createdAt: new Date().toISOString()
      };

      await saveSubmission(submission2);

      const backupPath = `${TEST_STORAGE_PATH}.backup`;
      expect(fs.existsSync(backupPath)).toBe(true);

      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
      expect(backup).toHaveLength(1);
      expect(backup[0].name).toBe('First');
    });

    it('should maintain valid JSON even after multiple writes', async () => {
      for (let i = 0; i < 5; i++) {
        const submission: BlipSubmission = {
          id: `test-${i}`,
          name: `Blip ${i}`,
          quadrant: 'techniques',
          ring: 'adopt',
          description: `Description ${i}`,
          submissionType: 'new',
          createdAt: new Date().toISOString()
        };

        await saveSubmission(submission);

        // Verify JSON is valid after each write
        const data = fs.readFileSync(TEST_STORAGE_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed).toHaveLength(i + 1);
      }
    });
  });

  describe('Concurrency', () => {
    it('should handle concurrent submissions without data loss', async () => {
      const submissions: BlipSubmission[] = [];

      for (let i = 0; i < 10; i++) {
        submissions.push({
          id: `concurrent-${i}`,
          name: `Blip ${i}`,
          quadrant: 'techniques',
          ring: 'adopt',
          description: `Concurrent submission ${i}`,
          submissionType: 'new',
          createdAt: new Date().toISOString()
        });
      }

      // Save all concurrently
      await Promise.all(submissions.map(s => saveSubmission(s)));

      // Verify all were saved
      const loaded = loadSubmissions();
      expect(loaded).toHaveLength(10);

      // Verify all IDs are present
      const ids = loaded.map(s => s.id).sort();
      const expectedIds = submissions.map(s => s.id).sort();
      expect(ids).toEqual(expectedIds);
    }, 10000); // Longer timeout for concurrency test

    it('should maintain JSON validity under concurrent writes', async () => {
      const promises = [];

      for (let i = 0; i < 5; i++) {
        promises.push(
          saveSubmission({
            id: `concurrent-validity-${i}`,
            name: `Test ${i}`,
            quadrant: 'techniques',
            ring: 'adopt',
            description: `Test ${i}`,
            submissionType: 'new',
            createdAt: new Date().toISOString()
          })
        );
      }

      await Promise.all(promises);

      // File should still be valid JSON
      const data = fs.readFileSync(TEST_STORAGE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(5);
    });
  });

  describe('getStorageStats', () => {
    it('should return correct statistics', async () => {
      const stats1 = getStorageStats();
      expect(stats1.count).toBe(0);
      expect(stats1.path).toBe(TEST_STORAGE_PATH);

      await saveSubmission({
        id: 'stats-1',
        name: 'Test',
        quadrant: 'techniques',
        ring: 'adopt',
        description: 'Test',
        submissionType: 'new',
        createdAt: new Date().toISOString()
      });

      const stats2 = getStorageStats();
      expect(stats2.count).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupted JSON file gracefully', () => {
      // Write invalid JSON
      fs.mkdirSync(path.dirname(TEST_STORAGE_PATH), { recursive: true });
      fs.writeFileSync(TEST_STORAGE_PATH, '{invalid json}', 'utf-8');

      const submissions = loadSubmissions();
      expect(submissions).toEqual([]);
    });

    it('should handle non-array JSON gracefully', () => {
      // Write valid JSON but not an array
      fs.mkdirSync(path.dirname(TEST_STORAGE_PATH), { recursive: true });
      fs.writeFileSync(TEST_STORAGE_PATH, '{"key": "value"}', 'utf-8');

      const submissions = loadSubmissions();
      expect(submissions).toEqual([]);
    });
  });
});
