// src/api/authApi.js
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`; 

export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data; // { token, user, etc. }
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};
