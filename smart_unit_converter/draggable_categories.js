// Enhanced Draggable Categories System
// Makes it easy for users to customize their category preferences

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

// Toggle edit mode with better user guidance
function toggleCategoryEditMode() {
    isEditMode = !isEditMode;
    userCategoryOrder = loadUserCategoryOrder();
    
    const editBtn = document.querySelector('.category-edit-btn');
    if (editBtn) {
        if (isEditMode) {
            editBtn.innerHTML = '<i class="fas fa-save"></i><span>Save My Order</span>';
            editBtn.className = 'category-edit-btn save-mode';
            showNotification('🎯 Drag categories to reorder them! Click "Save My Order" when done.', 'info');
        } else {
            editBtn.innerHTML = '<i class="fas fa-edit"></i><span>Customize Categories</span>';
            editBtn.className = 'category-edit-btn';
            saveUserCategoryOrder();
            showNotification('✅ Your category order has been saved!', 'success');
        }
    }
    
    renderCategories();
}

// Render categories with better visual guidance
function renderCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = '';
    
    // Add edit button with better styling
    if (!document.querySelector('.category-edit-btn')) {
        const editButton = document.createElement('button');
        editButton.className = 'category-edit-btn';
        editButton.innerHTML = '<i class="fas fa-edit"></i><span>Customize Categories</span>';
        editButton.onclick = toggleCategoryEditMode;
        categoryGrid.parentNode.insertBefore(editButton, categoryGrid);
    }
    
    // Add help text in edit mode
    if (isEditMode) {
        const helpText = document.createElement('div');
        helpText.className = 'edit-help-text';
        helpText.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Drag categories to reorder • Click X to remove • Click Save when done</span>
        `;
        categoryGrid.parentNode.insertBefore(helpText, categoryGrid);
    } else {
        const helpText = document.querySelector('.edit-help-text');
        if (helpText) helpText.remove();
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

// Create individual category card with better visual cues
function createCategoryCard(categoryName, index) {
    const category = categories[categoryName];
    const dragHandle = isEditMode ? 
        `<div class="category-drag-handle" draggable="true" data-index="${index}" title="Drag to reorder">
            <i class="fas fa-grip-vertical"></i>
        </div>` : '';

    const removeBtn = isEditMode ? 
        `<button class="category-remove-btn" onclick="removeCategory(${index})" title="Remove this category">
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

// Setup drag and drop with better feedback
function setupDragAndDrop() {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('dragging');
    showNotification('🎯 Drop the category where you want it!', 'info');
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
        showNotification('✅ Category moved!', 'success');
    }
    
    // Remove drag classes
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('dragging', 'drag-over');
    });
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// Remove category with confirmation
function removeCategory(index) {
    const categoryName = userCategoryOrder[index];
    if (confirm(`Remove "${categoryName}" from your list?`)) {
        userCategoryOrder.splice(index, 1);
        renderCategories();
        showNotification(`🗑️ "${categoryName}" removed from your list`, 'info');
    }
}

// Show notification with better styling
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Reset to default order with confirmation
function resetCategoryOrder() {
    if (confirm('Reset to default category order? This will remove your custom arrangement.')) {
        userCategoryOrder = [
            "Length", "Weight", "Temperature", "Currency (Real-time)", 
            "Volume", "Area", "Speed", "Time", "Cryptocurrency (Real-time)",
            "Digital Storage (Binary)", "Digital Storage (Decimal)", 
            "Energy", "Power", "Pressure", "Data Transfer", "Frequency",
            "Cooking Volume", "Cooking Weight", "Baking Temperature"
        ];
        saveUserCategoryOrder();
        renderCategories();
        showNotification('🔄 Reset to default category order', 'info');
    }
}

// Initialize with better user experience
document.addEventListener('DOMContentLoaded', function() {
    userCategoryOrder = loadUserCategoryOrder();
    
    // Add enhanced CSS styles
    const styles = `
        .category-edit-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, var(--accent), var(--primary));
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            margin: 15px 0;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 600;
            transition: all 0.3s ease;
            width: 100%;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
        }

        .category-edit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
        }

        .category-edit-btn.save-mode {
            background: linear-gradient(135deg, var(--success), #22c55e);
            box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        .category-edit-btn.save-mode:hover {
            box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
        }

        .edit-help-text {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(240, 147, 251, 0.1);
            color: var(--accent);
            padding: 10px 15px;
            border-radius: 8px;
            margin: 10px 0;
            font-size: 0.85rem;
            border-left: 3px solid var(--accent);
        }

        .category-card.edit-mode {
            position: relative;
            cursor: move;
            border: 2px dashed var(--accent);
            background: rgba(240, 147, 251, 0.05);
            transition: all 0.3s ease;
        }

        .category-card.edit-mode:hover {
            border-color: var(--primary);
            background: rgba(102, 126, 234, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }

        .category-drag-handle {
            position: absolute;
            top: 8px;
            right: 8px;
            color: var(--accent);
            cursor: grab;
            font-size: 0.9rem;
            z-index: 10;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 4px;
            padding: 4px;
            transition: all 0.2s ease;
        }

        .category-drag-handle:hover {
            background: var(--accent);
            color: white;
            transform: scale(1.1);
        }

        .category-drag-handle:active {
            cursor: grabbing;
            transform: scale(0.95);
        }

        .category-remove-btn {
            position: absolute;
            top: 8px;
            left: 8px;
            background: var(--error);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 0.8rem;
            z-index: 10;
            transition: all 0.2s ease;
        }

        .category-remove-btn:hover {
            background: #dc2626;
            transform: scale(1.1);
        }

        .category-card.dragging {
            opacity: 0.7;
            transform: rotate(3deg) scale(1.05);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }

        .category-card.drag-over {
            border-color: var(--success);
            background: rgba(79, 172, 254, 0.15);
            transform: scale(1.08);
            box-shadow: 0 6px 20px rgba(79, 172, 254, 0.3);
        }

        .category-card.edit-mode .category-icon,
        .category-card.edit-mode .category-name {
            pointer-events: none;
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 12px;
            color: white;
            z-index: 10001;
            animation: slideIn 0.4s ease;
            font-size: 0.9rem;
            max-width: 350px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .notification.success { 
            background: linear-gradient(135deg, var(--success), #22c55e);
            border-left: 4px solid #22c55e;
        }
        .notification.error { 
            background: linear-gradient(135deg, var(--error), #dc2626);
            border-left: 4px solid #dc2626;
        }
        .notification.warning { 
            background: linear-gradient(135deg, var(--warning), #f59e0b);
            border-left: 4px solid #f59e0b;
        }
        .notification.info { 
            background: linear-gradient(135deg, var(--primary), #3b82f6);
            border-left: 4px solid #3b82f6;
        }

        .notification.fade-out {
            animation: slideOut 0.3s ease forwards;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
            .category-edit-btn {
                padding: 10px 15px;
                font-size: 0.85rem;
            }
            
            .category-drag-handle {
                font-size: 0.8rem;
                padding: 3px;
            }
            
            .category-remove-btn {
                width: 22px;
                height: 22px;
                font-size: 0.7rem;
            }

            .edit-help-text {
                font-size: 0.8rem;
                padding: 8px 12px;
            }

            .notification {
                max-width: 300px;
                font-size: 0.85rem;
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