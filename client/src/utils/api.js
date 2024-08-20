const API_BASE_URL = 'http://127.0.0.1:5000';

// Helper function to set the Authorization header
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
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
            localStorage.setItem('token', data.access_token);
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
        localStorage.removeItem('token');
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
        localStorage.setItem('token', data.access_token);
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
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders(),
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

// Function to add a new care schedule
export async function addCareSchedule(careScheduleData) {
    try {
        const response = await fetch(`${API_BASE_URL}/care_schedules`, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(careScheduleData),
        });

        if (!response.ok) {
            throw new Error('Failed to add care schedule');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding care schedule:', error);
        throw error;
    }
}

// Function to fetch all care schedules
export async function fetchCareSchedules() {
    try {
        const response = await fetch(`${API_BASE_URL}/care_schedules`, {
            method: 'GET',
            credentials: 'include',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch care schedules');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching care schedules:', error);
        throw error;
    }
}

// Function to update an existing care schedule
export async function updateCareSchedule(scheduleId, careScheduleData) {
    try {
        const response = await fetch(`${API_BASE_URL}/care_schedules/${scheduleId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(careScheduleData),
        });

        if (!response.ok) {
            throw new Error('Failed to update care schedule');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating care schedule:', error);
        throw error;
    }
}

// Function to delete a care schedule
export async function deleteCareSchedule(scheduleId) {
    try {
        const response = await fetch(`${API_BASE_URL}/care_schedules/${scheduleId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete care schedule');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting care schedule:', error);
        throw error;
    }
}

// Function to add a new tip
export async function addTip(tipData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tips`, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(tipData),
        });

        if (!response.ok) {
            throw new Error('Failed to add tip');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding tip:', error);
        throw error;
    }
}

// Function to fetch all tips
export async function fetchTips() {
    try {
        const response = await fetch(`${API_BASE_URL}/tips`, {
            method: 'GET',
            credentials: 'include',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tips');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching tips:', error);
        throw error;
    }
}

// Function to update an existing tip
export async function updateTip(tipId, tipData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tips/${tipId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(tipData),
        });

        if (!response.ok) {
            throw new Error('Failed to update tip');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating tip:', error);
        throw error;
    }
}

// Function to delete a tip
export async function deleteTip(tipId) {
    try {
        const response = await fetch(`${API_BASE_URL}/tips/${tipId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete tip');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting tip:', error);
        throw error;
    }
}

// Function to add a new layout
export async function addLayout(layoutData) {
    try {
        const response = await fetch(`${API_BASE_URL}/layouts`, {
            method: 'POST',
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders(),
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



export const fetchForumPosts = async () => {
    const response = await fetch(`${API_BASE_URL}/forum/posts`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  };
  
  export const addForumPost = async (post) => {
    const response = await fetch(`${API_BASE_URL}/forum/posts`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error('Failed to add post');
    }
    return await response.json();
  };
  
  export const updateForumPost = async (postId, post) => {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    return await response.json();
  };
  
  export const deleteForumPost = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    return await response.json();
  };
  
  export const fetchComments = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return await response.json();
  };
  
  export const addComment = async (postId, comment) => {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    return await response.json();
  };
