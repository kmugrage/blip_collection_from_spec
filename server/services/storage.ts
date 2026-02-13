/**
 * Data Storage Service
 *
 * Handles storing blip submissions to a JSON file with concurrency protection.
 * Uses a simple file-locking mechanism suitable for low-concurrency scenarios
 * (fewer than 5 simultaneous users).
 *
 * Features:
 * - Atomic writes to prevent data corruption
 * - File locking to handle concurrent submissions
 * - Automatic JSON validation
 * - Backup on write
 */

import fs from 'fs';
import path from 'path';
import { BlipSubmission } from '../types';

const LOCK_TIMEOUT = 5000; // 5 seconds
const LOCK_RETRY_DELAY = 100; // 100ms

/**
 * Gets the storage file path from environment or default
 */
function getStoragePath(): string {
  return process.env.STORAGE_PATH || path.join(process.cwd(), 'data', 'submissions.json');
}

/**
 * Gets the lock file path
 */
function getLockPath(): string {
  const storagePath = getStoragePath();
  return `${storagePath}.lock`;
}

/**
 * Acquires a file lock
 * Waits until lock is available or timeout occurs
 */
async function acquireLock(): Promise<void> {
  const lockPath = getLockPath();
  const startTime = Date.now();

  while (true) {
    try {
      // Try to create lock file exclusively
      fs.writeFileSync(lockPath, process.pid.toString(), { flag: 'wx' });
      return; // Lock acquired
    } catch (error) {
      // Lock file exists, check if it's stale
      if (Date.now() - startTime > LOCK_TIMEOUT) {
        // Force remove stale lock
        try {
          fs.unlinkSync(lockPath);
        } catch {
          // Ignore errors
        }
        throw new Error('Failed to acquire lock: timeout');
      }

      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, LOCK_RETRY_DELAY));
    }
  }
}

/**
 * Releases the file lock
 */
function releaseLock(): void {
  const lockPath = getLockPath();
  try {
    fs.unlinkSync(lockPath);
  } catch (error) {
    // Ignore errors - lock may have been force-removed
  }
}

/**
 * Ensures the storage directory exists
 */
function ensureStorageDirectory(): void {
  const storagePath = getStoragePath();
  const dir = path.dirname(storagePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Loads all submissions from storage
 * Returns empty array if file doesn't exist or is invalid
 */
export function loadSubmissions(): BlipSubmission[] {
  const storagePath = getStoragePath();

  if (!fs.existsSync(storagePath)) {
    return [];
  }

  try {
    const data = fs.readFileSync(storagePath, 'utf-8');
    const submissions = JSON.parse(data);

    // Validate it's an array
    if (!Array.isArray(submissions)) {
      console.error('Storage file is not an array, resetting');
      return [];
    }

    return submissions;
  } catch (error) {
    console.error('Error loading submissions:', error);
    return [];
  }
}

/**
 * Saves a submission to storage with concurrency protection
 * Uses atomic writes and file locking
 */
export async function saveSubmission(submission: BlipSubmission): Promise<void> {
  ensureStorageDirectory();

  try {
    // Acquire lock
    await acquireLock();

    // Load existing submissions
    const submissions = loadSubmissions();

    // Add new submission
    submissions.push(submission);

    // Write to temporary file first (atomic write)
    const storagePath = getStoragePath();
    const tempPath = `${storagePath}.tmp`;

    fs.writeFileSync(tempPath, JSON.stringify(submissions, null, 2), 'utf-8');

    // Backup existing file if it exists
    if (fs.existsSync(storagePath)) {
      const backupPath = `${storagePath}.backup`;
      fs.copyFileSync(storagePath, backupPath);
    }

    // Atomically replace the file
    fs.renameSync(tempPath, storagePath);

    // Verify the write was successful
    const verification = JSON.parse(fs.readFileSync(storagePath, 'utf-8'));
    if (!Array.isArray(verification) || verification.length !== submissions.length) {
      throw new Error('Verification failed after write');
    }

  } finally {
    // Always release lock
    releaseLock();
  }
}

/**
 * Checks if storage is available and writable
 */
export function isStorageAvailable(): boolean {
  try {
    ensureStorageDirectory();
    const storagePath = getStoragePath();
    const dir = path.dirname(storagePath);

    // Check if directory is writable
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch (error) {
    console.error('Storage not available:', error);
    return false;
  }
}

/**
 * Gets storage statistics
 */
export function getStorageStats(): { count: number; path: string } {
  const submissions = loadSubmissions();
  return {
    count: submissions.length,
    path: getStoragePath()
  };
}
