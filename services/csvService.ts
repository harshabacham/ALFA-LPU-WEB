
import Papa from 'papaparse';

/**
 * Fetches and parses CSV data from a URL with retry logic and cache-busting.
 * Simplified to use standard fetch which handles Google Sheets public CSVs more reliably.
 */
export const fetchCSV = async <T,>(url: string, retries = 3): Promise<T[]> => {
  // Add a cache-buster to prevent stale or failed responses from being cached by the browser
  const separator = url.includes('?') ? '&' : '?';
  const cacheBustedUrl = `${url}${separator}t=${Date.now()}`;

  for (let i = 0; i < retries; i++) {
    try {
      // Standard fetch is usually sufficient for published Google Sheets.
      // Explicit mode: 'cors' or cache: 'no-store' can sometimes fail preflight checks 
      // in certain sandboxed or restricted browser environments.
      const response = await fetch(cacheBustedUrl);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      
      // If the sheet is not public, Google often returns an HTML login page instead of CSV data.
      // We check for HTML markers to identify this specific failure case.
      if (csvText.includes('<!DOCTYPE html>') || csvText.includes('<html>') || csvText.includes('<script')) {
        throw new Error('Access Denied: The Google Sheet must be "Published to the web" as CSV and set to Public.');
      }

      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          // Normalize headers: lowercase and replace spaces/commas with underscores
          transformHeader: (header) => header.trim().toLowerCase().replace(/[\s,]+/g, '_'),
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn("CSV Parsing issues encountered:", results.errors);
            }
            resolve(results.data as T[]);
          },
          error: (error: Error) => reject(error),
        });
      });
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      console.warn(`Fetch attempt ${i + 1} for ${url} failed:`, error);
      
      if (isLastAttempt) {
        // Return empty array on final failure to allow the UI to continue rendering safely
        return [];
      }
      
      // Wait before retrying (exponential backoff: 1s, 2s, 3s...)
      await new Promise(res => setTimeout(res, 1000 * (i + 1)));
    }
  }
  
  return [];
};
