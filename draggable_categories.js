// Draggable Categories System
// Allows users to drag and reorder category boxes according to their preferences

class DraggableCategories {
    constructor() {
        this.userCategoryOrder = this.loadUserCategoryOrder();
        this.isEditMode = false;
        this.init();
    }

    // Load user's saved category order from localStorage
    loadUserCategoryOrder() {
        const saved = localStorage.getItem('userCategoryOrder');
        if (saved) {
            return JSON.parse(saved);
        }
        // Default category order (all categories)
        return Object.keys(categories);
    }

    // Save user's category order to localStorage
    saveUserCategoryOrder() {
        localStorage.setItem('userCategoryOrder', JSON.stringify(this.userCategoryOrder));
    }

    // Initialize the draggable categories
    init() {
        this.setupEventListeners();
        this.renderCategories();
    }

    // Setup event listeners
    setupEventListeners() {
        // Add edit mode toggle button
        this.addEditModeButton();
    }

    // Add edit mode button to the sidebar
    addEditModeButton() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        // Check if edit button already exists
        if (document.querySelector('.category-edit-btn')) return;

        const editButton = document.createElement('button');
        editButton.className = 'category-edit-btn';
        editButton.innerHTML = `
            <i class="fas fa-edit"></i>
            <span>Edit Categories</span>
        `;
        editButton.onclick = () => this.toggleEditMode();
        
        // Insert after the search container
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.parentNode.insertBefore(editButton, searchContainer.nextSibling);
        } else {
            sidebar.insertBefore(editButton, sidebar.firstChild);
        }
    }

    // Toggle edit mode
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        this.renderCategories();
        
        const editBtn = document.querySelector('.category-edit-btn');
        if (editBtn) {
            editBtn.innerHTML = this.isEditMode ? 
                '<i class="fas fa-save"></i><span>Save Order</span>' : 
                '<i class="fas fa-edit"></i><span>Edit Categories</span>';
        }

        if (this.isEditMode) {
            this.showNotification('Drag categories to reorder them', 'info');
        } else {
            this.saveUserCategoryOrder();
            this.showNotification('Category order saved!', 'success');
        }
    }

    // Render categories in user's preferred order
    renderCategories() {
        const categoryGrid = document.querySelector('.category-grid');
        if (!categoryGrid) return;

        // Clear existing categories
        categoryGrid.innerHTML = '';

        // Render categories in user's order
        this.userCategoryOrder.forEach((categoryName, index) => {
            if (categories[categoryName]) {
                const categoryCard = this.createCategoryCard(categoryName, index);
                categoryGrid.appendChild(categoryCard);
            }
        });

        // Setup drag and drop if in edit mode
        if (this.isEditMode) {
            this.setupDragAndDrop();
        }
    }

    // Create individual category card
    createCategoryCard(categoryName, index) {
        const category = categories[categoryName];
        const dragHandle = this.isEditMode ? 
            `<div class="category-drag-handle" draggable="true" data-index="${index}">
                <i class="fas fa-grip-vertical"></i>
            </div>` : '';

        const removeBtn = this.isEditMode ? 
            `<button class="category-remove-btn" onclick="draggableCategories.removeCategory(${index})" title="Remove Category">
                <i class="fas fa-times"></i>
            </button>` : '';

        const card = document.createElement('div');
        card.className = `category-card ${this.isEditMode ? 'edit-mode' : ''}`;
        card.setAttribute('data-category', categoryName);
        card.setAttribute('data-index', index);
        
        card.innerHTML = `
            ${dragHandle}
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <div class="category-name">${categoryName}</div>
            ${removeBtn}
        `;

        // Add click handler for normal mode
        if (!this.isEditMode) {
            card.onclick = () => selectCategory(categoryName);
        }

        return card;
    }

    // Setup drag and drop functionality
    setupDragAndDrop() {
        const cards = document.querySelectorAll('.category-card');
        cards.forEach(card => {
            card.addEventListener('dragstart', this.handleDragStart.bind(this));
            card.addEventListener('dragover', this.handleDragOver.bind(this));
            card.addEventListener('drop', this.handleDrop.bind(this));
            card.addEventListener('dragenter', this.handleDragEnter.bind(this));
            card.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
        e.target.classList.add('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.target.closest('.category-card')?.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.target.closest('.category-card')?.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = parseInt(e.target.closest('.category-card').dataset.index);
        
        if (fromIndex !== toIndex) {
            // Reorder the array
            const item = this.userCategoryOrder.splice(fromIndex, 1)[0];
            this.userCategoryOrder.splice(toIndex, 0, item);
            
            // Re-render with new order
            this.renderCategories();
        }
        
        // Remove drag classes
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('dragging', 'drag-over');
        });
    }

    // Remove category from user's list
    removeCategory(index) {
        this.userCategoryOrder.splice(index, 1);
        this.renderCategories();
        this.showNotification('Category removed from your list', 'info');
    }

    // Add category back to user's list
    addCategory(categoryName) {
        if (!this.userCategoryOrder.includes(categoryName)) {
            this.userCategoryOrder.push(categoryName);
            this.renderCategories();
            this.showNotification('Category added to your list', 'success');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Reset to default order
    resetToDefault() {
        this.userCategoryOrder = Object.keys(categories);
        this.saveUserCategoryOrder();
        this.renderCategories();
        this.showNotification('Reset to default category order', 'info');
    }

    // Get current category order
    getCategoryOrder() {
        return this.userCategoryOrder;
    }
}

// Initialize the draggable categories
let draggableCategories;
document.addEventListener('DOMContentLoaded', function() {
    draggableCategories = new DraggableCategories();
});

// Add CSS styles for draggable categories
const draggableStyles = `
    .category-edit-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--accent);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 15px;
        margin: 10px 0;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        width: 100%;
        justify-content: center;
    }

    .category-edit-btn:hover {
        background: var(--primary);
        transform: translateY(-1px);
    }

    .category-card.edit-mode {
        position: relative;
        cursor: move;
        border: 2px dashed var(--accent);
        background: rgba(240, 147, 251, 0.1);
    }

    .category-card.edit-mode:hover {
        border-color: var(--primary);
        background: rgba(102, 126, 234, 0.1);
    }

    .category-drag-handle {
        position: absolute;
        top: 5px;
        right: 5px;
        color: var(--accent);
        cursor: grab;
        font-size: 0.8rem;
        z-index: 10;
    }

    .category-drag-handle:active {
        cursor: grabbing;
    }

    .category-remove-btn {
        position: absolute;
        top: 5px;
        left: 5px;
        background: var(--error);
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        font-size: 0.7rem;
        z-index: 10;
    }

    .category-card.dragging {
        opacity: 0.5;
        transform: rotate(5deg);
    }

    .category-card.drag-over {
        border-color: var(--success);
        background: rgba(79, 172, 254, 0.2);
        transform: scale(1.05);
    }

    .category-card.edit-mode .category-icon,
    .category-card.edit-mode .category-name {
        pointer-events: none;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        z-index: 10001;
        animation: slideIn 0.3s ease;
        font-size: 0.9rem;
    }

    .notification.success { background: var(--success); }
    .notification.error { background: var(--error); }
    .notification.warning { background: var(--warning); }
    .notification.info { background: var(--primary); }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    /* Mobile responsive adjustments */
    @media (max-width: 768px) {
        .category-edit-btn {
            padding: 8px 12px;
            font-size: 0.8rem;
        }
        
        .category-drag-handle {
            font-size: 0.7rem;
        }
        
        .category-remove-btn {
            width: 18px;
            height: 18px;
            font-size: 0.6rem;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = draggableStyles;
document.head.appendChild(styleSheet); 