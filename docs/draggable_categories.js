// Simplified Drag-and-Drop Quick Access System
// Users can drag categories to customize their quick access

let isEditMode = false;
let userQuickAccess = [];

// Load user's saved quick access
function loadUserQuickAccess() {
    const saved = localStorage.getItem('userQuickAccess');
    if (saved) {
        return JSON.parse(saved);
    }
    // Default quick access
    return [
        { from: 'USD', to: 'EUR', label: 'USD → EUR', icon: 'fas fa-dollar-sign', category: 'Currency (Real-time)' },
        { from: 'meters', to: 'feet', label: 'Meters → Feet', icon: 'fas fa-ruler', category: 'Length' },
        { from: 'celsius', to: 'fahrenheit', label: '°C → °F', icon: 'fas fa-thermometer-half', category: 'Temperature' },
        { from: 'kilograms', to: 'pounds', label: 'Kg → Lbs', icon: 'fas fa-weight-hanging', category: 'Weight' }
    ];
}

// Save user's quick access
function saveUserQuickAccess() {
    localStorage.setItem('userQuickAccess', JSON.stringify(userQuickAccess));
}

// Toggle edit mode for quick access
function toggleQuickAccessEditMode() {
    isEditMode = !isEditMode;
    userQuickAccess = loadUserQuickAccess();
    
    const editBtn = document.querySelector('.quick-access-edit-btn');
    if (editBtn) {
        if (isEditMode) {
            editBtn.innerHTML = '<i class="fas fa-save"></i> Save Quick Access';
            editBtn.className = 'quick-access-edit-btn save-mode';
            showNotification('🎯 Drag categories to your quick access! Click "Save Quick Access" when done.', 'info');
        } else {
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Customize Quick Access';
            editBtn.className = 'quick-access-edit-btn';
            saveUserQuickAccess();
            showNotification('✅ Your quick access has been saved!', 'success');
        }
    }
    
    renderQuickAccess();
}

// Render quick access with drag-and-drop functionality
function renderQuickAccess() {
    const quickAccessSection = document.querySelector('.quick-access-section');
    if (!quickAccessSection) return;
    
    quickAccessSection.innerHTML = '';
    
    // Add edit button
    const editButton = document.createElement('button');
    editButton.className = 'quick-access-edit-btn';
    editButton.innerHTML = '<i class="fas fa-edit"></i> Customize Quick Access';
    editButton.onclick = toggleQuickAccessEditMode;
    quickAccessSection.appendChild(editButton);
    
    // Add help text in edit mode
    if (isEditMode) {
        const helpText = document.createElement('div');
        helpText.className = 'edit-help-text';
        helpText.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Drag categories from the main list to add them to your quick access</span>
        `;
        quickAccessSection.appendChild(helpText);
    }
    
    // Create quick access grid
    const quickAccessGrid = document.createElement('div');
    quickAccessGrid.className = 'quick-access-grid';
    quickAccessGrid.id = 'quickAccessGrid';
    
    if (isEditMode) {
        // Show draggable quick access items
        userQuickAccess.forEach((item, index) => {
            const quickItem = createDraggableQuickItem(item, index);
            quickAccessGrid.appendChild(quickItem);
        });
        
        // Add drop zone for new items
        const dropZone = document.createElement('div');
        dropZone.className = 'quick-access-drop-zone';
        dropZone.innerHTML = `
            <i class="fas fa-plus"></i>
            <span>Drop categories here to add to quick access</span>
        `;
        quickAccessGrid.appendChild(dropZone);
        
        // Setup drag and drop
        setupQuickAccessDragAndDrop();
    } else {
        // Show normal quick access items
        userQuickAccess.forEach(item => {
            const quickItem = createQuickAccessItem(item);
            quickAccessGrid.appendChild(quickItem);
        });
    }
    
    quickAccessSection.appendChild(quickAccessGrid);
}

// Create draggable quick access item
function createDraggableQuickItem(item, index) {
    const quickItem = document.createElement('div');
    quickItem.className = 'quick-conversion draggable';
    quickItem.setAttribute('draggable', 'true');
    quickItem.setAttribute('data-index', index);
    quickItem.setAttribute('data-item', JSON.stringify(item));
    
    quickItem.innerHTML = `
        <div class="drag-handle">
            <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="quick-item-content">
            <i class="${item.icon}"></i>
            <span>${item.label}</span>
        </div>
        <button class="remove-btn" onclick="removeQuickAccessItem(${index})" title="Remove from quick access">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    return quickItem;
}

// Create normal quick access item
function createQuickAccessItem(item) {
    const quickItem = document.createElement('div');
    quickItem.className = 'quick-conversion';
    quickItem.onclick = () => executeQuickConversion(item.from, item.to, item.category);
    
    quickItem.innerHTML = `
        <i class="${item.icon}"></i>
        <span>${item.label}</span>
    `;
    
    return quickItem;
}

// Setup drag and drop for quick access
function setupQuickAccessDragAndDrop() {
    const quickItems = document.querySelectorAll('.quick-conversion.draggable');
    const dropZone = document.querySelector('.quick-access-drop-zone');
    
    quickItems.forEach(item => {
        item.addEventListener('dragstart', handleQuickAccessDragStart);
        item.addEventListener('dragover', handleQuickAccessDragOver);
        item.addEventListener('drop', handleQuickAccessDrop);
        item.addEventListener('dragenter', handleQuickAccessDragEnter);
        item.addEventListener('dragleave', handleQuickAccessDragLeave);
        item.addEventListener('dragend', handleQuickAccessDragEnd);
    });
    
    if (dropZone) {
        dropZone.addEventListener('dragover', handleQuickAccessDragOver);
        dropZone.addEventListener('drop', handleQuickAccessDrop);
        dropZone.addEventListener('dragenter', handleQuickAccessDragEnter);
        dropZone.addEventListener('dragleave', handleQuickAccessDragLeave);
    }
}

function handleQuickAccessDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('dragging');
}

function handleQuickAccessDragOver(e) {
    e.preventDefault();
}

function handleQuickAccessDragEnter(e) {
    e.preventDefault();
    e.target.closest('.quick-conversion, .quick-access-drop-zone')?.classList.add('drag-over');
}

function handleQuickAccessDragLeave(e) {
    e.target.closest('.quick-conversion, .quick-access-drop-zone')?.classList.remove('drag-over');
}

function handleQuickAccessDrop(e) {
    e.preventDefault();
    const dropTarget = e.target.closest('.quick-conversion, .quick-access-drop-zone');
    
    if (dropTarget && dropTarget.classList.contains('quick-access-drop-zone')) {
        // Handle category drop into quick access
        const categoryName = e.dataTransfer.getData('text/plain');
        if (categoryName && categories[categoryName]) {
            addCategoryToQuickAccess(categoryName);
        }
        return;
    }
    
    if (dropTarget && dropTarget.classList.contains('quick-conversion')) {
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = parseInt(dropTarget.dataset.index);
        
        if (fromIndex !== toIndex) {
            // Reorder the array
            const item = userQuickAccess.splice(fromIndex, 1)[0];
            userQuickAccess.splice(toIndex, 0, item);
            
            // Re-render with new order
            renderQuickAccess();
            showNotification('✅ Quick access item moved!', 'success');
        }
    }
    
    // Remove drag classes
    document.querySelectorAll('.quick-conversion, .quick-access-drop-zone').forEach(item => {
        item.classList.remove('dragging', 'drag-over');
    });
}

function handleQuickAccessDragEnd(e) {
    e.target.classList.remove('dragging');
}

// Remove quick access item
function removeQuickAccessItem(index) {
    const item = userQuickAccess[index];
    if (confirm(`Remove "${item.label}" from quick access?`)) {
        userQuickAccess.splice(index, 1);
        renderQuickAccess();
        showNotification(`🗑️ "${item.label}" removed from quick access`, 'info');
    }
}

// Execute quick conversion
function executeQuickConversion(from, to, category) {
    if (category) {
        selectCategory(category);
        setTimeout(() => {
            document.getElementById('fromUnit').value = from;
            document.getElementById('toUnit').value = to;
            document.getElementById('valueInput').value = 1;
            convert();
        }, 100);
    }
}

// Add category to quick access (called from category cards)
function addToQuickAccess(categoryName, fromUnit, toUnit) {
    if (!isEditMode) return;
    
    const category = categories[categoryName];
    if (!category) return;
    
    // Check if already in quick access
    const exists = userQuickAccess.find(item => 
        item.from === fromUnit && item.to === toUnit && item.category === categoryName
    );
    
    if (exists) {
        showNotification('This conversion is already in your quick access!', 'warning');
        return;
    }
    
    // Add to quick access
    const newItem = {
        from: fromUnit,
        to: toUnit,
        label: `${fromUnit} → ${toUnit}`,
        icon: category.icon,
        category: categoryName
    };
    
    userQuickAccess.push(newItem);
    renderQuickAccess();
    showNotification(`✅ Added "${newItem.label}" to quick access!`, 'success');
}

// Add category to quick access when dropped
function addCategoryToQuickAccess(categoryName) {
    const category = categories[categoryName];
    if (!category) return;
    
    // Check if category is already in quick access
    const exists = userQuickAccess.find(item => item.category === categoryName);
    
    if (exists) {
        showNotification(`"${categoryName}" is already in your quick access!`, 'warning');
        return;
    }
    
    // Get first two units from the category for default conversion
    const units = Object.keys(category.units);
    if (units.length < 2) {
        showNotification(`"${categoryName}" doesn't have enough units for conversion`, 'warning');
        return;
    }
    
    // Add to quick access with default conversion
    const newItem = {
        from: units[0],
        to: units[1],
        label: `${units[0]} → ${units[1]}`,
        icon: category.icon,
        category: categoryName
    };
    
    userQuickAccess.push(newItem);
    renderQuickAccess();
    showNotification(`✅ Added "${categoryName}" to quick access!`, 'success');
}

// Show notification
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

// Initialize with enhanced CSS
document.addEventListener('DOMContentLoaded', function() {
    console.log('Draggable categories system loaded!');
    userQuickAccess = loadUserQuickAccess();
    
    // Add enhanced CSS styles
    const styles = `
        .quick-access-edit-btn {
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

        .quick-access-edit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
        }

        .quick-access-edit-btn.save-mode {
            background: linear-gradient(135deg, var(--success), #22c55e);
            box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        .quick-access-edit-btn.save-mode:hover {
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

        .quick-conversion.draggable {
            position: relative;
            cursor: move;
            border: 2px dashed var(--accent);
            background: rgba(240, 147, 251, 0.05);
            transition: all 0.3s ease;
        }

        .quick-conversion.draggable:hover {
            border-color: var(--primary);
            background: rgba(102, 126, 234, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }

        .drag-handle {
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

        .drag-handle:hover {
            background: var(--accent);
            color: white;
            transform: scale(1.1);
        }

        .drag-handle:active {
            cursor: grabbing;
            transform: scale(0.95);
        }

        .remove-btn {
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

        .remove-btn:hover {
            background: #dc2626;
            transform: scale(1.1);
        }

        .quick-conversion.dragging {
            opacity: 0.7;
            transform: rotate(3deg) scale(1.05);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }

        .quick-conversion.drag-over,
        .quick-access-drop-zone.drag-over {
            border-color: var(--success);
            background: rgba(79, 172, 254, 0.15);
            transform: scale(1.08);
            box-shadow: 0 6px 20px rgba(79, 172, 254, 0.3);
        }

        .quick-access-drop-zone {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px dashed var(--accent);
            border-radius: 8px;
            color: var(--accent);
            font-size: 0.9rem;
            text-align: center;
            transition: all 0.3s ease;
            min-height: 80px;
        }

        .quick-access-drop-zone:hover {
            background: rgba(240, 147, 251, 0.1);
            border-color: var(--primary);
        }

        .quick-access-drop-zone i {
            font-size: 1.5rem;
            margin-bottom: 8px;
        }

        .quick-item-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            pointer-events: none;
        }

        .category-card[draggable="true"] {
            cursor: grab;
            transition: all 0.3s ease;
        }

        .category-card[draggable="true"]:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
        }

        .category-card[draggable="true"]:active {
            cursor: grabbing;
            transform: scale(0.95);
        }

        .category-card.dragging {
            opacity: 0.7;
            transform: rotate(3deg) scale(1.05);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
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
            .quick-access-edit-btn {
                padding: 10px 15px;
                font-size: 0.85rem;
            }
            
            .drag-handle {
                font-size: 0.8rem;
                padding: 3px;
            }
            
            .remove-btn {
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

// Override the original populateCategories function to add drag-to-quick-access functionality
function populateCategories() {
    console.log('Draggable populateCategories called!');
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) {
        console.error('categoryGrid not found!');
        return;
    }
    categoryGrid.innerHTML = '';

    // Smart category ordering by usage frequency
    const categoryOrder = [
        "Length", "Weight", "Temperature", "Currency (Real-time)", 
        "Volume", "Area", "Speed", "Time", "Cryptocurrency (Real-time)",
        "Digital Storage (Binary)", "Digital Storage (Decimal)", 
        "Energy", "Power", "Pressure", "Data Transfer", "Frequency",
        "Cooking Volume", "Cooking Weight", "Baking Temperature"
    ];

    // Add quick access section with drag-and-drop
    const quickAccessSection = document.createElement('div');
    quickAccessSection.className = 'quick-access-section';
    quickAccessSection.innerHTML = `
        <h3 class="section-subtitle">Quick Access</h3>
    `;
    
    // Insert quick access section right after the search container
    const searchContainer = document.querySelector('.search-container');
    searchContainer.parentNode.insertBefore(quickAccessSection, searchContainer.nextSibling);

    // Add main categories section
    const mainCategoriesSection = document.createElement('div');
    mainCategoriesSection.className = 'main-categories-section';
    mainCategoriesSection.innerHTML = '<h3 class="section-subtitle">All Categories</h3>';
    
    const mainCategoriesGrid = document.createElement('div');
    mainCategoriesGrid.className = 'category-grid';

    categoryOrder.forEach(category => {
        if (categories[category]) {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-category', category);
            card.onclick = () => selectCategory(category);
            card.innerHTML = `
                <div class="category-icon">
                    <i class="${categories[category].icon}"></i>
                </div>
                <div>${category}</div>
            `;
            
            // Add drag functionality for quick access
            card.addEventListener('dragstart', handleCategoryDragStart);
            mainCategoriesGrid.appendChild(card);
        }
    });

    mainCategoriesSection.appendChild(mainCategoriesGrid);
    categoryGrid.appendChild(mainCategoriesSection);
    
    // Initialize quick access
    renderQuickAccess();
}

// Handle category drag start for quick access
function handleCategoryDragStart(e) {
    if (isEditMode) {
        const categoryName = e.target.dataset.category;
        e.dataTransfer.setData('text/plain', categoryName);
        e.target.classList.add('dragging');
        showNotification('🎯 Drop the category into the quick access area!', 'info');
    }
} 