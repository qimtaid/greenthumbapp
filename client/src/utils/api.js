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

        // // Save token to localStorage and set as a cookie
        // if (data.access_token) {
        //     localStorage.setItem('access_token', data.access_token);
        //     // document.cookie = `access_token=${data.access_token}`;
            
        // }

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
        // document.cookie = 'access_token_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
        // document.cookie = `access_token_cookie=${data.access_token}; path=/;`;

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
    const data = {
    name: formData.name,
    description: formData.description,
    image_url: formData.image_url, // Send the image URL instead of the base64-encoded string
    };

    const response = await fetch(`${API_BASE_URL}/plants`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(data), // Send JSON data as the request body
    });

    if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(`Failed to add plant: ${errorDetail}`);
    }

    const result = await response.json();
    return result;
} catch (error) {
    console.error('Error adding plant:', error);
    throw error;
}
}


export const addReply = async (commentId, reply) => {
try {
    const response = await fetch(`/api/comments/${commentId}/replies`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(reply),
    });
    if (!response.ok) {
    throw new Error('Failed to add reply');
    }
    return response.json();
} catch (error) {
    console.error('Error adding reply:', error);
    throw error;
}
};




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

// For fetching care schedules
export const fetchCareSchedules = async (plantId) => {
    if (!plantId) throw new Error('plantId is required');
    try {
        const response = await fetch(`${API_BASE_URL}/plants/${plantId}/care_schedules`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            ...getAuthHeaders(),
        });
        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(errorResponse || 'Failed to fetch care schedules');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching care schedules:', error);
        throw error;
    }
};

// For adding care schedules
export const addCareSchedule = async (plantId, scheduleData) => {
    if (!plantId) throw new Error('plantId is required');
    try {
        const response = await fetch(`${API_BASE_URL}/plants/${plantId}/care_schedules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(scheduleData),
        });
        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(errorResponse || 'Failed to add care schedule');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding care schedule:', error);
        throw error;
    }
};




// Function to update a care schedule
export const updateCareSchedule = async (plantId, id, scheduleData) => {
    if (!plantId || !id) throw new Error('plantId and id are required');
    try {
        const response = await fetch(`${API_BASE_URL}/${plantId}/care_schedules/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scheduleData),
        });
        if (!response.ok) {
            const errorResponse = await response.text(); // Get text response for debugging
            throw new Error(errorResponse || 'Failed to update care schedule');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating care schedule:', error);
        throw error;
    }
};

// Function to delete a care schedule
export const deleteCareSchedule = async (plantId, id) => {
    if (!plantId || !id) throw new Error('plantId and id are required');
    try {
        const response = await fetch(`${API_BASE_URL}/${plantId}/care_schedules/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorResponse = await response.text(); // Get text response for debugging
            throw new Error(errorResponse || 'Failed to delete care schedule');
        }
    } catch (error) {
        console.error('Error deleting care schedule:', error);
        throw error;
    }
};



// Function to fetch forum posts
export async function fetchForumPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/forum`, {
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

// Function to add a new forum post
export async function addForumPost(postData) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
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

// Function to update an existing forum post
export async function updateForumPost(id, postData) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
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

// Function to delete a forum post

export const deleteForumPost = async (postId) => {
    const token = localStorage.getItem('authToken'); // Or get from context or other sources
    const response = await fetch(`http://127.0.0.1:5000/forum/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Add token if required
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.statusText}`);
    }
  
    return response.json();
  };
  



// Function to fetch comments for a forum post
export async function fetchComments(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/${postId}/comments`, {
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

// Function to add a new comment to a forum post
export async function addComment(postId, commentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
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

// Function to update an existing comment
export async function updateComment(postId, commentId, commentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/${postId}/comments/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(commentData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating comment:', errorData);
            throw new Error('Failed to update comment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
}

// Function to delete an existing comment
export async function deleteComment(postId, commentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/forum/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting comment:', errorData);
            throw new Error('Failed to delete comment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
}

// Function to fetch tips
export async function fetchTips() {
    try {
        const response = await fetch(`${API_BASE_URL}/tips`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching tips:', errorData);
            throw new Error('Failed to fetch tips');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching tips:', error);
        throw error;
    }
}

// Function to add a new tip
export async function addTip(tipData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(tipData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding tip:', errorData);
            throw new Error('Failed to add tip');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding tip:', error);
        throw error;
    }
}

// Function to update an existing tip
export async function updateTip(tipId, tipData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tips/${tipId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(tipData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating tip:', errorData);
            throw new Error('Failed to update tip');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating tip:', error);
        throw error;
    }
}

// Function to delete an existing tip
export async function deleteTip(tipId) {
    try {
        const response = await fetch(`${API_BASE_URL}/tips/${tipId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting tip:', errorData);
            throw new Error('Failed to delete tip');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting tip:', error);
        throw error;
    }
}

// Function to fetch garden layouts
export async function fetchGardenLayouts() {
    try {
        const response = await fetch(`${API_BASE_URL}/layout`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching garden layouts:', errorData);
            throw new Error('Failed to fetch garden layouts');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching garden layouts:', error);
        throw error;
    }
}

// Function to fetch garden layouts
export async function loadLayouts() {
    try {
        const response = await fetch(`${API_BASE_URL}/layout`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching garden layouts:', errorData);
            throw new Error('Failed to fetch garden layouts');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching garden layouts:', error);
        throw error;
    }
}

// Fetch a single layout by ID
export async function fetchLayoutById(layoutId) {
    try {
        const response = await fetch(`${API_BASE_URL}/layout/${layoutId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching layout by ID:', errorData);
            throw new Error('Failed to fetch layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching layout by ID:', error);
        throw error;
    }
}

// Update an existing layout
export async function updateLayout(layoutId, layoutData) {
    try {
        const response = await fetch(`${API_BASE_URL}/layout/${layoutId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(layoutData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating layout:', errorData);
            throw new Error('Failed to update layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating layout:', error);
        throw error;
    }
}


// Function to save a garden layout
export async function saveLayout(layoutData) {
    try {
        const response = await fetch(`${API_BASE_URL}/layout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(layoutData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error saving garden layout:', errorData);
            throw new Error('Failed to save garden layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving garden layout:', error);
        throw error;
    }
}


// Function to create a new garden layout
export async function createGardenLayout(layoutData) {
    try {
        const response = await fetch(`${API_BASE_URL}/layout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(layoutData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating garden layout:', errorData);
            throw new Error('Failed to create garden layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating garden layout:', error);
        throw error;
    }
}

// Function to update an existing garden layout
export async function updateGardenLayout(layoutId, layoutData) {
    try {
        const response = await fetch(`${API_BASE_URL}/layout/${layoutId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(layoutData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating garden layout:', errorData);
            throw new Error('Failed to update garden layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating garden layout:', error);
        throw error;
    }
}

// Function to delete a garden layout
export async function deleteGardenLayout(layoutId) {
    try {
        const response = await fetch(`${API_BASE_URL}/layout/${layoutId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting garden layout:', errorData);
            throw new Error('Failed to delete garden layout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting garden layout:', error);
        throw error;
    }
}


//Load user plants for FOrum
export async function loadUserPlants() {
    try {
        const response = await fetch(`${API_BASE_URL}/plants`, {
            method: 'GET',
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