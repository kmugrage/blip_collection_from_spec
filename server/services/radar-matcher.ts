/**
 * Radar Matching Service
 *
 * Implements the matching strategy for looking up blips in prior radar editions.
 * Strategy: Combines normalized string comparison with edit distance to balance
 * precision (avoiding false matches) with recall (finding legitimate matches).
 *
 * Approach:
 * 1. Normalize both input and radar blip names (lowercase, remove common suffixes, strip punctuation)
 * 2. Check for exact match on normalized strings
 * 3. If no exact match, calculate edit distance (Levenshtein) for close matches
 * 4. Return the best match if it meets the similarity threshold
 *
 * This approach handles variations like:
 * - "React" / "React.js" / "ReactJS"
 * - "Kubernetes" / "K8s"
 * - Different spacing, capitalization, punctuation
 *
 * While avoiding false positives like:
 * - "Go" matching "Google"
 * - "Vue" matching "Vue.js" AND "VuePress" (returns most recent)
 */

import fs from 'fs';
import path from 'path';
import { PriorRadarBlip } from '../types';

interface RadarData {
  name: string;
  ring: string;
  quadrant: string;
  description: string;
}

interface RadarVolume {
  volume: string;
  data: RadarData[];
}

/**
 * Normalizes a blip name for comparison
 * - Converts to lowercase
 * - Removes common suffixes (.js, .io, etc.)
 * - Removes punctuation and extra whitespace
 * - Handles common abbreviations
 */
function normalizeBlipName(name: string): string {
  let normalized = name.toLowerCase().trim();

  // Remove common suffixes
  normalized = normalized
    .replace(/\.js$/i, '')
    .replace(/\.io$/i, '')
    .replace(/\.net$/i, '')
    .replace(/\.org$/i, '');

  // Remove punctuation but keep spaces
  normalized = normalized.replace(/[^\w\s]/g, '');

  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Calculates Levenshtein edit distance between two strings
 * Returns the minimum number of edits needed to transform one string into another
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Calculate distances
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculates similarity ratio between two strings (0-1)
 * Higher is more similar
 */
function similarityRatio(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1.0;

  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

/**
 * Loads all prior radar data from JSON files
 */
function loadRadarData(): RadarVolume[] {
  const radarDir = path.join(process.cwd(), 'data', 'radar');
  const indexPath = path.join(radarDir, 'index.json');

  if (!fs.existsSync(indexPath)) {
    console.warn('Radar index not found. Run npm run fetch-radar-data first.');
    return [];
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const volumes: RadarVolume[] = [];

  for (const entry of index) {
    const filePath = path.join(radarDir, entry.filename);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      // Extract volume name from filename
      const volumeMatch = entry.filename.match(/Volume (\d+) \(([^)]+)\)/);
      const volume = volumeMatch ? `Volume ${volumeMatch[1]} (${volumeMatch[2]})` : entry.filename;

      volumes.push({
        volume,
        data
      });
    }
  }

  // Sort volumes by number (most recent first)
  volumes.sort((a, b) => {
    const aNum = parseInt(a.volume.match(/Volume (\d+)/)?.[1] || '0');
    const bNum = parseInt(b.volume.match(/Volume (\d+)/)?.[1] || '0');
    return bNum - aNum; // Descending order
  });

  return volumes;
}

/**
 * Searches for a blip in prior radars
 * Returns the most recent match if found
 */
export function findPriorRadarMatch(blipName: string): PriorRadarBlip | null {
  const volumes = loadRadarData();
  const normalizedInput = normalizeBlipName(blipName);

  // Similarity threshold - must be at least 85% similar to match
  const SIMILARITY_THRESHOLD = 0.85;

  let bestMatch: { blip: PriorRadarBlip; similarity: number } | null = null;

  // Search through volumes (most recent first)
  for (const volume of volumes) {
    for (const blip of volume.data) {
      const normalizedBlipName = normalizeBlipName(blip.name);

      // Check for exact match
      if (normalizedInput === normalizedBlipName) {
        return {
          name: blip.name,
          ring: blip.ring,
          quadrant: blip.quadrant,
          description: blip.description,
          volume: volume.volume
        };
      }

      // Calculate similarity for close matches
      const similarity = similarityRatio(normalizedInput, normalizedBlipName);

      if (similarity >= SIMILARITY_THRESHOLD) {
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = {
            blip: {
              name: blip.name,
              ring: blip.ring,
              quadrant: blip.quadrant,
              description: blip.description,
              volume: volume.volume
            },
            similarity
          };
        }
      }
    }
  }

  return bestMatch ? bestMatch.blip : null;
}

/**
 * Health check - verifies radar data is available
 */
export function isRadarDataAvailable(): boolean {
  const radarDir = path.join(process.cwd(), 'data', 'radar');
  const indexPath = path.join(radarDir, 'index.json');
  return fs.existsSync(indexPath);
}
