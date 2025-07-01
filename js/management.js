// Management System Integration
function renderManagementSystem(container, initialCakes, onCakesUpdate) {
    let cakes = [...initialCakes];
    let filter = "all";
    let form = { name: "", category: "chocolate", price: "", stock: "" };
    let editId = null;

    function render() {
        const filteredCakes = filter === "all" ? cakes : cakes.filter((c) => c.category === filter);

        container.innerHTML = `
            <div class="management-container">
                <div class="management-header">
                    <h3>🍰 Cake Inventory Management</h3>
                    <p>Manage your cake inventory, prices, and stock levels</p>
                </div>

                <form class="management-form" id="cakeForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Cake Name *</label>
                            <input 
                                type="text" 
                                name="name" 
                                value="${form.name}" 
                                placeholder="Enter cake name" 
                                required 
                            />
                        </div>
                        <div class="form-group">
                            <label>Category *</label>
                            <select name="category" value="${form.category}">
                                <option value="chocolate" ${form.category === 'chocolate' ? 'selected' : ''}>Chocolate</option>
                                <option value="vanilla" ${form.category === 'vanilla' ? 'selected' : ''}>Vanilla</option>
                                <option value="fruit" ${form.category === 'fruit' ? 'selected' : ''}>Fruit</option>
                                <option value="special" ${form.category === 'special' ? 'selected' : ''}>Special</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Price (₹) *</label>
                            <input 
                                type="number" 
                                name="price" 
                                value="${form.price}" 
                                placeholder="Enter price" 
                                min="1" 
                                required 
                            />
                        </div>
                        <div class="form-group">
                            <label>Stock Quantity *</label>
                            <input 
                                type="number" 
                                name="stock" 
                                value="${form.stock}" 
                                placeholder="Enter stock" 
                                min="0" 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-${editId ? 'edit' : 'plus'}"></i>
                            ${editId ? "Update Cake" : "Add Cake"}
                        </button>
                        ${editId ? `
                            <button type="button" class="btn-secondary" onclick="cancelEdit()">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        ` : ''}
                    </div>
                </form>

                <div class="filter-section">
                    <h4>Filter by Category:</h4>
                    <div class="filter-buttons">
                        ${['all', 'chocolate', 'vanilla', 'fruit', 'special'].map(cat => `
                            <button 
                                class="filter-btn ${filter === cat ? 'active' : ''}" 
                                onclick="setFilter('${cat}')"
                            >
                                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="cakes-table-container">
                    <table class="cakes-table">
                        <thead>
                            <tr>
                                <th>Cake</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredCakes.map(cake => `
                                <tr class="cake-row ${cake.stock === 0 ? 'out-of-stock' : ''}">
                                    <td>
                                        <div class="cake-info">
                                            <span class="cake-emoji">${getCakeEmoji(cake.category)}</span>
                                            <span class="cake-name">${cake.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="category-badge category-${cake.category}">
                                            ${cake.category}
                                        </span>
                                    </td>
                                    <td class="price">₹${cake.price}</td>
                                    <td class="stock">
                                        <span class="stock-badge ${cake.stock === 0 ? 'out-of-stock' : cake.stock < 5 ? 'low-stock' : 'in-stock'}">
                                            ${cake.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="status-badge ${cake.stock === 0 ? 'unavailable' : 'available'}">
                                            ${cake.stock === 0 ? 'Out of Stock' : 'Available'}
                                        </span>
                                    </td>
                                    <td>
                                        <label class="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                ${cake.featured ? 'checked' : ''} 
                                                onchange="toggleFeatured(${cake.id})"
                                            />
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </td>
                                    <td class="actions">
                                        <button 
                                            class="btn-edit" 
                                            onclick="editCake(${cake.id})"
                                            title="Edit cake"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            class="btn-delete" 
                                            onclick="deleteCake(${cake.id})"
                                            title="Delete cake"
                                        >
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    ${filteredCakes.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-birthday-cake"></i>
                            <h3>No cakes found</h3>
                            <p>No cakes match the current filter. Try selecting a different category.</p>
                        </div>
                    ` : ''}
                </div>

                <div class="management-stats">
                    <div class="stat-card">
                        <i class="fas fa-birthday-cake"></i>
                        <div>
                            <h4>${cakes.length}</h4>
                            <p>Total Cakes</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-star"></i>
                        <div>
                            <h4>${cakes.filter(c => c.featured).length}</h4>
                            <p>Featured</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <h4>${cakes.filter(c => c.stock === 0).length}</h4>
                            <p>Out of Stock</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-boxes"></i>
                        <div>
                            <h4>${cakes.reduce((sum, c) => sum + c.stock, 0)}</h4>
                            <p>Total Stock</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        setupEventListeners();
    }

    function setupEventListeners() {
        const form = container.querySelector('#cakeForm');
        if (form) {
            form.addEventListener('submit', handleSubmit);
            
            // Add input event listeners for real-time form updates
            form.querySelectorAll('input, select').forEach(input => {
                input.addEventListener('input', (e) => {
                    form[e.target.name] = e.target.value;
                });
            });
        }

        // Make functions globally available for onclick handlers
        window.setFilter = setFilter;
        window.editCake = editCake;
        window.deleteCake = deleteCake;
        window.toggleFeatured = toggleFeatured;
        window.cancelEdit = cancelEdit;
    }

    function getCakeEmoji(category) {
        const emojis = {
            chocolate: '🍫',
            vanilla: '🍰',
            fruit: '🍓',
            special: '🎂'
        };
        return emojis[category] || '🍰';
    }

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const cakeData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseInt(formData.get('price')),
            stock: parseInt(formData.get('stock'))
        };

        if (!cakeData.name || !cakeData.price || cakeData.stock < 0) {
            alert('Please fill in all required fields with valid values.');
            return;
        }

        if (editId) {
            // Update existing cake
            const index = cakes.findIndex(c => c.id === editId);
            if (index !== -1) {
                cakes[index] = {
                    ...cakes[index],
                    ...cakeData,
                    emoji: getCakeEmoji(cakeData.category)
                };
            }
            editId = null;
        } else {
            // Add new cake
            const newCake = {
                ...cakeData,
                id: Date.now(),
                featured: false,
                emoji: getCakeEmoji(cakeData.category)
            };
            cakes.push(newCake);
        }

        // Reset form
        form = { name: "", category: "chocolate", price: "", stock: "" };
        
        // Update main website
        onCakesUpdate([...cakes]);
        
        // Re-render
        render();
        
        // Show success message
        showSuccessMessage(editId ? 'Cake updated successfully!' : 'Cake added successfully!', 'success');
    }

    function setFilter(newFilter) {
        filter = newFilter;
        render();
    }

    function editCake(id) {
        const cake = cakes.find(c => c.id === id);
        if (cake) {
            form = {
                name: cake.name,
                category: cake.category,
                price: cake.price.toString(),
                stock: cake.stock.toString()
            };
            editId = id;
            render();
            
            // Scroll to form
            container.querySelector('#cakeForm').scrollIntoView({ behavior: 'smooth' });
        }
    }

    function cancelEdit() {
        editId = null;
        form = { name: "", category: "chocolate", price: "", stock: "" };
        render();
    }

    function deleteCake(id) {
        const cake = cakes.find(c => c.id === id);
        if (cake && confirm(`Are you sure you want to delete "${cake.name}"?`)) {
            cakes = cakes.filter(c => c.id !== id);
            onCakesUpdate([...cakes]);
            render();
            showSuccessMessage('Cake deleted successfully!', 'info');
        }
    }

    function toggleFeatured(id) {
        const cake = cakes.find(c => c.id === id);
        if (cake) {
            cake.featured = !cake.featured;
            onCakesUpdate([...cakes]);
            render();
        }
    }

    // Initial render
    render();
}

// Add management-specific styles
const managementStyles = `
<style>
.management-container {
    max-width: 100%;
    margin: 0 auto;
}

.management-header {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    border-radius: var(--border-radius);
}

.management-header h3 {
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
}

.management-form {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    margin-bottom: 2rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: var(--transition);
    font-weight: bold;
}

.btn-primary:hover {
    background: #ff4081;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: var(--transition);
}

.btn-secondary:hover {
    background: #5a6268;
}

.filter-section {
    margin-bottom: 2rem;
}

.filter-section h4 {
    margin-bottom: 1rem;
    color: var(--text-color);
}

.cakes-table-container {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    margin-bottom: 2rem;
}

.cakes-table {
    width: 100%;
    border-collapse: collapse;
}

.cakes-table th {
    background: var(--primary-color);
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: bold;
}

.cakes-table td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
}

.cake-row:hover {
    background: rgba(255, 107, 157, 0.05);
}

.cake-row.out-of-stock {
    opacity: 0.6;
}

.cake-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.cake-emoji {
    font-size: 1.5rem;
}

.cake-name {
    font-weight: bold;
}

.category-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: capitalize;
}

.category-chocolate { background: #8B4513; color: white; }
.category-vanilla { background: #F5DEB3; color: #333; }
.category-fruit { background: #FF6B6B; color: white; }
.category-special { background: #9B59B6; color: white; }

.price {
    font-weight: bold;
    color: var(--primary-color);
}

.stock-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.9rem;
}

.stock-badge.in-stock { background: #d4edda; color: #155724; }
.stock-badge.low-stock { background: #fff3cd; color: #856404; }
.stock-badge.out-of-stock { background: #f8d7da; color: #721c24; }

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
}

.status-badge.available { background: #d4edda; color: #155724; }
.status-badge.unavailable { background: #f8d7da; color: #721c24; }

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 24px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
}

input:checked + .toggle-slider {
    background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
    transform: translateX(26px);
}

.actions {
    display: flex;
    gap: 0.5rem;
}

.btn-edit, .btn-delete {
    padding: 0.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: var(--transition);
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-edit {
    background: #17a2b8;
    color: white;
}

.btn-edit:hover {
    background: #138496;
}

.btn-delete {
    background: #dc3545;
    color: white;
}

.btn-delete:hover {
    background: #c82333;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
}

.empty-state i {
    font-size: 3rem;
    color: #ddd;
    margin-bottom: 1rem;
}

.management-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: var(--transition);
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-card i {
    font-size: 2rem;
    color: var(--primary-color);
}

.stat-card h4 {
    font-size: 1.8rem;
    margin: 0;
    color: var(--primary-color);
}

.stat-card p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .cakes-table-container {
        overflow-x: auto;
    }
    
    .cakes-table {
        min-width: 700px;
    }
    
    .management-form {
        padding: 1rem;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .management-stats {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
    
    .stat-card {
        padding: 1rem;
    }
}
</style>
`;

// Inject styles
if (!document.querySelector('#management-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'management-styles';
    styleElement.innerHTML = managementStyles;
    document.head.appendChild(styleElement);
}