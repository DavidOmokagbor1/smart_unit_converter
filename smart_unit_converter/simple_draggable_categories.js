// Simple Draggable Categories System
// Allows users to drag and reorder category boxes

let isEditMode = false;
let userCategoryOrder = [];

// Load user's saved category order
function loadUserCategoryOrder() {
    const saved = localStorage.getItem('userCategoryOrder');
    if (saved) {
        return JSON.parse(saved);
    }
    // Default order
    return [
        "Length", "Weight", "Temperature", "Currency (Real-time)", 
        "Volume", "Area", "Speed", "Time", "Cryptocurrency (Real-time)",
        "Digital Storage (Binary)", "Digital Storage (Decimal)", 
        "Energy", "Power", "Pressure", "Data Transfer", "Frequency",
        "Cooking Volume", "Cooking Weight", "Baking Temperature"
    ];
}

// Save user's category order
function saveUserCategoryOrder() {
    localStorage.setItem('userCategoryOrder', JSON.stringify(userCategoryOrder));
}

// Toggle edit mode
function toggleCategoryEditMode() {
    isEditMode = !isEditMode;
    userCategoryOrder = loadUserCategoryOrder();
    
    const editBtn = document.querySelector('.category-edit-btn');
    if (editBtn) {
        editBtn.innerHTML = isEditMode ? 
            '<i class="fas fa-save"></i><span>Save Order</span>' : 
            '<i class="fas fa-edit"></i><span>Edit Categories</span>';
    }
    
    renderCategories();
    
    if (isEditMode) {
        showNotification('Drag categories to reorder them', 'info');
    } else {
        saveUserCategoryOrder();
        showNotification('Category order saved!', 'success');
    }
}

// Render categories in user's preferred order
function renderCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = '';
    
    // Add edit button if not exists
    if (!document.querySelector('.category-edit-btn')) {
        const editButton = document.createElement('button');
        editButton.className = 'category-edit-btn';
        editButton.innerHTML = '<i class="fas fa-edit"></i><span>Edit Categories</span>';
        editButton.onclick = toggleCategoryEditMode;
        categoryGrid.parentNode.insertBefore(editButton, categoryGrid);
    }
    
    // Render categories
    userCategoryOrder.forEach((categoryName, index) => {
        if (categories[categoryName]) {
            const categoryCard = createCategoryCard(categoryName, index);
            categoryGrid.appendChild(categoryCard);
        }
    });
    
    // Setup drag and drop if in edit mode
    if (isEditMode) {
        setupDragAndDrop();
    }
}

// Create individual category card
function createCategoryCard(categoryName, index) {
    const category = categories[categoryName];
    const dragHandle = isEditMode ? 
        `<div class="category-drag-handle" draggable="true" data-index="${index}">
            <i class="fas fa-grip-vertical"></i>
        </div>` : '';

    const removeBtn = isEditMode ? 
        `<button class="category-remove-btn" onclick="removeCategory(${index})" title="Remove Category">
            <i class="fas fa-times"></i>
        </button>` : '';

    const card = document.createElement('div');
    card.className = `category-card ${isEditMode ? 'edit-mode' : ''}`;
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
    if (!isEditMode) {
        card.onclick = () => selectCategory(categoryName);
    }

    return card;
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.closest('.category-card')?.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.closest('.category-card')?.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const toIndex = parseInt(e.target.closest('.category-card').dataset.index);
    
    if (fromIndex !== toIndex) {
        // Reorder the array
        const item = userCategoryOrder.splice(fromIndex, 1)[0];
        userCategoryOrder.splice(toIndex, 0, item);
        
        // Re-render with new order
        renderCategories();
    }
    
    // Remove drag classes
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('dragging', 'drag-over');
    });
}

// Remove category from user's list
function removeCategory(index) {
    userCategoryOrder.splice(index, 1);
    renderCategories();
    showNotification('Category removed from your list', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Reset to default order
function resetCategoryOrder() {
    userCategoryOrder = [
        "Length", "Weight", "Temperature", "Currency (Real-time)", 
        "Volume", "Area", "Speed", "Time", "Cryptocurrency (Real-time)",
        "Digital Storage (Binary)", "Digital Storage (Decimal)", 
        "Energy", "Power", "Pressure", "Data Transfer", "Frequency",
        "Cooking Volume", "Cooking Weight", "Baking Temperature"
    ];
    saveUserCategoryOrder();
    renderCategories();
    showNotification('Reset to default category order', 'info');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    userCategoryOrder = loadUserCategoryOrder();
    
    // Add CSS styles
    const styles = `
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
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
});

// Override the original populateCategories function
function populateCategories() {
    renderCategories();
} 