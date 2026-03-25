// API base URL for FastAPI backend
const API_BASE = "http://127.0.0.1:8000";

/**
 * Predict PCOS using tabular data
 * @param {Object} payload - Model-ready JSON payload with all required fields
 * @returns {Promise<{ok: boolean, result?: Object, error?: string}>}
 */
export const predictTabular = async (payload) => {
  const url = `${API_BASE}/predict-pcos`;
  let attempt = 0;
  const maxRetries = 2;
  let delay = 500;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response?.json();

      // Do NOT retry on 4xx errors (client errors)
      if (response?.status >= 400 && response?.status < 500) {
        return { 
          ok: false, 
          error: data?.detail || data?.message || data?.error || `Client error: ${response?.status}` 
        };
      }

      // Success
      if (response?.ok && data?.success) {
        return { ok: true, result: data?.result };
      }

      // Server error (5xx) - will retry
      if (response?.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Other failures
      return { ok: false, error: data?.message || 'Prediction failed' };

    } catch (error) {
      console.error(`predictTabular attempt ${attempt + 1} failed:`, error);
      attempt++;

      // If max retries exceeded, return error
      if (attempt > maxRetries) {
        return { 
          ok: false, 
          error: error?.message || 'Network error after retries' 
        };
      }

      // Exponential backoff: 500ms, then 1000ms
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = 1000;
    }
  }

  return { ok: false, error: 'Unknown error' };
};

/**
 * Predict PCOS using ultrasound image
 * @param {File} file - Image file to upload
 * @returns {Promise<{ok: boolean, result?: Object, error?: string}>}
 */
export const predictImage = async (file) => {
  const url = `${API_BASE}/predict-image`;
  let attempt = 0;
  const maxRetries = 2;
  let delay = 500;

  while (attempt <= maxRetries) {
    try {
      const formData = new FormData();
      formData?.append('image', file);

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      const data = await response?.json();

      // Do NOT retry on 4xx errors (client errors)
      if (response?.status >= 400 && response?.status < 500) {
        return { 
          ok: false, 
          error: data?.detail || data?.message || data?.error || `Client error: ${response?.status}`
        };
      }

      // Success
      if (response?.ok && data?.success) {
        return { ok: true, result: data?.result };
      }

      // Server error (5xx) - will retry
      if (response?.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Other failures
      return { ok: false, error: data?.message || 'Image prediction failed' };

    } catch (error) {
      console.error(`predictImage attempt ${attempt + 1} failed:`, error);
      attempt++;

      // If max retries exceeded, return error
      if (attempt > maxRetries) {
        return { 
          ok: false, 
          error: error?.message || 'Network error after retries' 
        };
      }

      // Exponential backoff: 500ms, then 1000ms
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = 1000;
    }
  }

  return { ok: false, error: 'Unknown error' };
};