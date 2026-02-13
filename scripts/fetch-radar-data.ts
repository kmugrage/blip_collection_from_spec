/**
 * Fetches prior Technology Radar data from GitHub repository
 * Data source: https://github.com/setchy/thoughtworks-tech-radar-volumes
 *
 * This script downloads JSON files containing historical radar data
 * and bundles them as a static asset for the application.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'setchy';
const REPO_NAME = 'thoughtworks-tech-radar-volumes';
const DATA_PATH = 'volumes/json';
const OUTPUT_DIR = './data/radar';

interface GitHubContentItem {
  name: string;
  path: string;
  download_url: string;
  type: string;
}

/**
 * Fetches JSON content from a URL
 */
function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'tech-radar-blip-submission',
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Downloads a file from a URL and saves it
 */
function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (error) => {
        fs.unlink(outputPath, () => {}); // Clean up partial file
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Main function to fetch radar data
 */
async function fetchRadarData() {
  console.log('📡 Fetching Technology Radar data from GitHub...\n');

  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`✅ Created output directory: ${OUTPUT_DIR}\n`);
    }

    // Fetch list of files from GitHub API
    const apiUrl = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}`;
    console.log(`Fetching file list from: ${apiUrl}`);

    const files = await fetchJson<GitHubContentItem[]>(apiUrl);

    // Filter for JSON files only
    const jsonFiles = files.filter(file =>
      file.type === 'file' && file.name.endsWith('.json')
    );

    console.log(`Found ${jsonFiles.length} JSON files\n`);

    // Download each JSON file
    for (const file of jsonFiles) {
      const outputPath = path.join(OUTPUT_DIR, file.name);
      console.log(`Downloading ${file.name}...`);

      await downloadFile(file.download_url, outputPath);
      console.log(`  ✅ Saved to ${outputPath}`);
    }

    // Create an index file that lists all available radar volumes
    const index = jsonFiles.map(file => ({
      filename: file.name,
      path: `radar/${file.name}`
    }));

    const indexPath = path.join(OUTPUT_DIR, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    console.log(`\n✅ Created index file: ${indexPath}`);

    console.log('\n🎉 Radar data fetch completed successfully!');
    console.log(`📊 Total files downloaded: ${jsonFiles.length}`);

  } catch (error) {
    console.error('\n❌ Error fetching radar data:', error);
    process.exit(1);
  }
}

// Run the script
fetchRadarData();
