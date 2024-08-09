import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Layout = () => {
  const [layouts, setLayouts] = useState([]);
  const [editingLayout, setEditingLayout] = useState(null);
  const [newLayout, setNewLayout] = useState({
    name: '',
    layout_data: '{"beds": [{"name": "", "plants": [""]}] }'
  });

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = () => {
    axios.get('http://127.0.0.1:5000/garden_layout')
      .then(response => setLayouts(response.data))
      .catch(error => console.error('Error fetching garden layouts:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLayout({
      ...newLayout,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingLayout) {
      axios.put(`/api/garden-layouts/${editingLayout.id}`, newLayout)
        .then(() => {
          fetchLayouts();
          resetForm();
        })
        .catch(error => console.error('Error updating garden layout:', error));
    } else {
      axios.post('/api/garden-layouts', newLayout)
        .then(() => {
          fetchLayouts();
          resetForm();
        })
        .catch(error => console.error('Error creating garden layout:', error));
    }
  };

  const handleEdit = (layout) => {
    setEditingLayout(layout);
    setNewLayout({
      name: layout.name,
      layout_data: layout.layout_data
    });
  };

  const resetForm = () => {
    setEditingLayout(null);
    setNewLayout({
      name: '',
      layout_data: '{"beds": [{"name": "", "plants": [""]}] }'
    });
  };

  return (
    <div>
      <h2>Garden Layouts</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Layout Name:</label>
          <input
            type="text"
            name="name"
            value={newLayout.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Layout Data (JSON):</label>
          <textarea
            name="layout_data"
            value={newLayout.layout_data}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{editingLayout ? 'Update Layout' : 'Add Layout'}</button>
        {editingLayout && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {layouts.map(layout => (
        <div key={layout.id} className="layout-card">
          <h3>{layout.name}</h3>
          <div className="layout-data">
            {JSON.parse(layout.layout_data).beds.map((bed, index) => (
              <div key={index}>
                <h4>{bed.name}</h4>
                <ul>
                  {bed.plants.map((plant, idx) => (
                    <li key={idx}>{plant}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button onClick={() => handleEdit(layout)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default Layout;
