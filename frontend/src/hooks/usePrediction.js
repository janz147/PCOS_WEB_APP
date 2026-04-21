// frontend/src/hooks/usePrediction.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Safely parse response as JSON.
 */
async function parseResponse(response) {
  const text = await response.text();

  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return {
      ok: false,
      error: `Response was not JSON: ${text.slice(0, 200)}`,
    };
  }
}

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
        body: JSON.stringify(payload),
      });

      const parsed = await parseResponse(response);
      if (!parsed.ok) {
        return { ok: false, error: parsed.error };
      }

      const data = parsed.data;

      if (response.status >= 400 && response.status < 500) {
        return {
          ok: false,
          error: data?.detail || data?.message || data?.error || `Client error: ${response.status}`,
        };
      }

      if (response.ok && data?.success) {
        return { ok: true, result: data?.result };
      }

      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      return { ok: false, error: data?.message || 'Prediction failed' };
    } catch (error) {
      console.error(`predictTabular attempt ${attempt + 1} failed:`, error);
      attempt++;

      if (attempt > maxRetries) {
        return { ok: false, error: error?.message || 'Network error after retries' };
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
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
      formData.append('image', file);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const parsed = await parseResponse(response);
      if (!parsed.ok) {
        return { ok: false, error: parsed.error };
      }

      const data = parsed.data;

      if (response.status >= 400 && response.status < 500) {
        return {
          ok: false,
          error: data?.detail || data?.message || data?.error || `Client error: ${response.status}`,
        };
      }

      if (response.ok && data?.success) {
        return { ok: true, result: data?.result };
      }

      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }

      return { ok: false, error: data?.message || 'Image prediction failed' };
    } catch (error) {
      console.error(`predictImage attempt ${attempt + 1} failed:`, error);
      attempt++;

      if (attempt > maxRetries) {
        return { ok: false, error: error?.message || 'Network error after retries' };
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = 1000;
    }
  }

  return { ok: false, error: 'Unknown error' };
};