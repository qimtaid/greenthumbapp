const API_BASE_URL = 'http://127.0.0.1:5000';

// Function to log in a user
export async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Save token to localStorage if provided
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to register a user
export const register = async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });
    return response.json();
};

// Function to log out a user
export const logout = async () => {
    await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    localStorage.removeItem('access_token'); // Clear token from localStorage on logout
};

// Function to make authenticated API requests
export async function fetchProtectedData() {
    const token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/protected-route`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch protected data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching protected data:', error);
        throw error;
    }
}

// Function to refresh the access token
export async function refreshToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token); // Save refreshed token
        return data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}
