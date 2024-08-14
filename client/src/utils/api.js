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
                ...getAuthHeaders(),
                // Do not manually set 'Content-Type' when using FormData
            },
            credentials: 'include',
            body: formData,
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


// Function to fetch care schedules
export const fetchCareSchedules = async () => {
    const response = await fetch('/api/care-schedules');
    if (!response.ok) throw new Error('Failed to fetch care schedules');
    return response.json();
};

export const addCareSchedule = async (scheduleData) => {
    const response = await fetch('/api/care-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData),
    });
    if (!response.ok) throw new Error('Failed to add care schedule');
    return response.json();
};

export const updateCareSchedule = async (id, scheduleData) => {
    const response = await fetch(`/api/care-schedules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData),
    });
    if (!response.ok) throw new Error('Failed to update care schedule');
    return response.json();
};

export const deleteCareSchedule = async (id) => {
    const response = await fetch(`/api/care-schedules/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete care schedule');
};


export const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
};

export const fetchIntervals = async () => {
    const response = await fetch('/api/intervals');
    if (!response.ok) throw new Error('Failed to fetch intervals');
    return response.json();
};

// Function to get all garden layouts
export const getGardenLayouts = async () => {
    try {
        const response = await api.get('/garden-layouts');
        return response.data;
    } catch (error) {
        console.error('Error fetching garden layouts:', error);
        throw error;
    }
};

// Function to get a single garden layout by ID
export const getGardenLayoutById = async (id) => {
    try {
        const response = await api.get(`/garden-layouts/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching garden layout with ID ${id}:`, error);
        throw error;
    }
};

// Function to load layouts
export const loadLayouts = async () => {
    try {
        const response = await fetch('/api/layouts'); // Adjust the API endpoint as needed
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching layouts:', error);
        throw error;
    }
};

// Function to save a layout
export const saveLayout = async (layoutData) => {
    try {
        const response = await fetch('/api/layouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(layoutData)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error saving layout:', error);
        throw error;
    }
};





// Fetch forum posts
export async function fetchForumPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/posts`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching forum posts:', errorData);
            throw new Error('Failed to fetch forum posts');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        throw error;
    }
}

// Add a new forum post
export async function addForumPost(postData) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/posts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding forum post:', errorData);
            throw new Error('Failed to add forum post');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding forum post:', error);
        throw error;
    }
}

// Update an existing forum post
export async function updateForumPost(id, postData) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/posts/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating forum post:', errorData);
            throw new Error('Failed to update forum post');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating forum post:', error);
        throw error;
    }
}

// Delete a forum post
export async function deleteForumPost(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/posts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting forum post:', errorData);
            throw new Error('Failed to delete forum post');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting forum post:', error);
        throw error;
    }
}

// Fetch comments for a post
export async function fetchComments(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching comments:', errorData);
            throw new Error('Failed to fetch comments');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}

// Add a new comment to a post
export async function addComment(postId, commentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(commentData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding comment:', errorData);
            throw new Error('Failed to add comment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}

export const fetchTips = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching tips:', error);
        throw error;
    }
};

// Add a new tip
export const addTip = async (tipData) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tipData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding tip:', error);
        throw error;
    }
};

// Update an existing tip
export const updateTip = async (id, tipData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tipData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating tip:', error);
        throw error;
    }
};

// Delete a tip
export const deleteTip = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting tip:', error);
        throw error;
    }
};

// Function to fetch all garden layouts
export const fetchGardenLayouts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/garden-layouts`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch garden layouts');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching garden layouts:', error);
        throw error;
    }
};

// Function to fetch a single garden layout by ID
export const fetchGardenLayoutById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/garden-layouts/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch garden layout with ID ${id}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching garden layout with ID ${id}:`, error);
        throw error;
    }
};

// Function to create a new garden layout
export const createGardenLayout = async (layoutData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/garden-layouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(layoutData),
        });
        if (!response.ok) {
            throw new Error('Failed to create garden layout');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating garden layout:', error);
        throw error;
    }
};

// Function to update an existing garden layout
export const updateGardenLayout = async (id, layoutData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/garden-layouts/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(layoutData),
        });
        if (!response.ok) {
            throw new Error('Failed to update garden layout');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating garden layout:', error);
        throw error;
    }
};

// Function to delete a garden layout
export const deleteGardenLayout = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/garden-layouts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to delete garden layout');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting garden layout:', error);
        throw error;
    }
};