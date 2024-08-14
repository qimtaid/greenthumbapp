const API_BASE_URL = 'http://127.0.0.1:5000';

// Helper function to set the Authorization header
function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
        'Authorization': `Bearer ${token}`,
    };
}

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
            const errorData = await response.json();
            console.error('Login failed:', errorData);
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Save token to localStorage and set as a cookie
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            document.cookie = `access_token_cookie=${data.access_token}; path=/;`;
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to register a user
export const register = async (username, email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};

// Function to log out a user
export const logout = async () => {
    try {
        await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        localStorage.removeItem('access_token');
        document.cookie = 'access_token_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

// Function to fetch protected data
export async function fetchProtectedData() {
    try {
        const response = await fetch(`${API_BASE_URL}/protected-route`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch protected data');
        }

        return await response.json();
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
        localStorage.setItem('access_token', data.access_token);
        document.cookie = `access_token_cookie=${data.access_token}; path=/;`;

        return data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

// Function to fetch all plants
export async function fetchPlants() {
    try {
        const response = await fetch(`${API_BASE_URL}/plants`, {
            method: 'GET',
            credentials: 'include',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching plants:', errorData);
            throw new Error('Failed to fetch plants');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching plants:', error);
        throw error;
    }
}

// Function to add a new plant
export async function addPlant(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/plants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            credentials: 'include',
            body: JSON.stringify(formData),  // Send as JSON instead of FormData
        });

        if (!response.ok) {
            throw new Error('Failed to add plant');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding plant:', error);
        throw error;
    }
}



// Function to update an existing plant
export async function updatePlant(plantId, plantData) {
    try {
        const response = await fetch(`${API_BASE_URL}/plants/${plantId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            credentials: 'include',
            body: JSON.stringify(plantData),
        });

        if (!response.ok) {
            throw new Error('Failed to update plant');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating plant:', error);
        throw error;
    }
}

// Function to delete a plant
export async function deletePlant(plantId) {
    try {
        const response = await fetch(`${API_BASE_URL}/plants/${plantId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete plant');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting plant:', error);
        throw error;
    }
}

// Function to add a new layout
export async function addLayout(layoutData) {
    try {
        const response = await fetch(`${API_BASE_URL}/layouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            credentials: 'include',
            body: JSON.stringify(layoutData),
        });

        if (!response.ok) {
            throw new Error('Failed to add layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding layout:', error);
        throw error;
    }
}

// Function to fetch all layouts
export async function fetchLayouts() {
    try {
        const response = await fetch(`${API_BASE_URL}/layouts`, {
            method: 'GET',
            credentials: 'include',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch layouts');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching layouts:', error);
        throw error;
    }
}

// Function to update an existing layout
export async function updateLayout(layoutId, layoutData) {
    try {
        const response = await fetch(`${API_BASE_URL}/layouts/${layoutId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            credentials: 'include',
            body: JSON.stringify(layoutData),
        });

        if (!response.ok) {
            throw new Error('Failed to update layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating layout:', error);
        throw error;
    }
}

// Function to delete a layout
export async function deleteLayout(layoutId) {
    try {
        const response = await fetch(`${API_BASE_URL}/layouts/${layoutId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting layout:', error);
        throw error;
    }
}

// Function to fetch a specific layout
export async function fetchLayout(layoutId) {
    try {
        const response = await fetch(`${API_BASE_URL}/layouts/${layoutId}`, {
            method: 'GET',
            credentials: 'include',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching layout:', error);
        throw error;
    }
}
