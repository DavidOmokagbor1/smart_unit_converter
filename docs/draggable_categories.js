// Simplified User-Focused Quick Access System
// Built for what users actually want: fast, simple, intuitive

let userQuickAccess = [];
let popularConversions = [
    { from: 'USD', to: 'EUR', label: 'USD → EUR', icon: 'fas fa-dollar-sign', category: 'Currency (Real-time)' },
    { from: 'meters', to: 'feet', label: 'Meters → Feet', icon: 'fas fa-ruler', category: 'Length' },
    { from: 'celsius', to: 'fahrenheit', label: '°C → °F', icon: 'fas fa-thermometer-half', category: 'Temperature' },
    { from: 'kilograms', to: 'pounds', label: 'Kg → Lbs', icon: 'fas fa-weight-hanging', category: 'Weight' },
    { from: 'liters', to: 'gallons', label: 'L → Gal', icon: 'fas fa-tint', category: 'Volume' },
    { from: 'kilometers', to: 'miles', label: 'Km → Miles', icon: 'fas fa-road', category: 'Length' }
];

// Load user's saved quick access
function loadUserQuickAccess() {
    const saved = localStorage.getItem('userQuickAccess');
    if (saved) {
        return JSON.parse(saved);
    }
    // Start with popular conversions
    return [...popularConversions];
}

// Save user's quick access
function saveUserQuickAccess() {
    localStorage.setItem('userQuickAccess', JSON.stringify(userQuickAccess));
}

// Simple drag and drop - no edit mode needed
function setupSimpleDragAndDrop() {
    const categoryCards = document.querySelectorAll('.category-card');
    const quickAccessGrid = document.querySelector('.quick-access-grid');
    
    // Make categories draggable
    categoryCards.forEach(card => {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', handleCategoryDragStart);
    });
    
    // Make quick access area a drop zone
    if (quickAccessGrid) {
        quickAccessGrid.addEventListener('dragover', handleDragOver);
        quickAccessGrid.addEventListener('drop', handleDrop);
        quickAccessGrid.addEventListener('dragenter', handleDragEnter);
        quickAccessGrid.addEventListener('dragleave', handleDragLeave);
    }
}

function handleCategoryDragStart(e) {
    const categoryName = e.target.dataset.category;
    e.dataTransfer.setData('text/plain', categoryName);
    e.target.classList.add('dragging');
    showNotification('🎯 Drop the category to add it to quick access!', 'info');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.closest('.quick-access-grid')?.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.closest('.quick-access-grid')?.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const categoryName = e.dataTransfer.getData('text/plain');
    const dropZone = e.target.closest('.quick-access-grid');
    
    if (dropZone && categoryName && categories[categoryName]) {
        addCategoryToQuickAccess(categoryName);
    }
    
    // Remove drag classes
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('dragging');
    });
    dropZone?.classList.remove('drag-over');
}

// Add category to quick access (simplified)
function addCategoryToQuickAccess(categoryName) {
    const category = categories[categoryName];
    if (!category) return;
    
    // Check if already exists
    const exists = userQuickAccess.find(item => item.category === categoryName);
    if (exists) {
        showNotification(`"${categoryName}" is already in your quick access!`, 'info');
        return;
    }
    
    // Get first two units for default conversion
    const units = Object.keys(category.units);
    if (units.length < 2) {
        showNotification(`"${categoryName}" doesn't have enough units`, 'warning');
        return;
    }
    
    // Add to quick access
    const newItem = {
        from: units[0],
        to: units[1],
        label: `${units[0]} → ${units[1]}`,
        icon: category.icon,
        category: categoryName
    };
    
    userQuickAccess.push(newItem);
    saveUserQuickAccess();
    renderQuickAccess();
    
    // Show success with animation
    showNotification(`✅ Added "${categoryName}" to quick access!`, 'success');
    
    // Highlight the new item briefly
    setTimeout(() => {
        const newItem = document.querySelector('.quick-conversion:last-child');
        if (newItem) {
            newItem.style.transform = 'scale(1.1)';
            newItem.style.boxShadow = '0 8px 25px rgba(240, 147, 251, 0.5)';
            setTimeout(() => {
                newItem.style.transform = '';
                newItem.style.boxShadow = '';
            }, 1000);
        }
    }, 100);
}

// Render quick access (simplified)
function renderQuickAccess() {
    const quickAccessSection = document.querySelector('.quick-access-section');
    if (!quickAccessSection) return;
    
    quickAccessSection.innerHTML = `
        <h3 class="section-subtitle">
            <i class="fas fa-star"></i>
            Quick Access
        </h3>
        <div class="quick-access-grid">
            ${userQuickAccess.map(item => `
                <div class="quick-conversion" onclick="executeQuickConversion('${item.from}', '${item.to}', '${item.category}')">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </div>
            `).join('')}
        </div>
        <div class="quick-access-help">
            <i class="fas fa-info-circle"></i>
            <span>Drag categories here to add them to quick access</span>
        </div>
    `;
}

// Execute quick conversion (simplified and robust)
function executeQuickConversion(from, to, category) {
    console.log('Quick conversion:', { from, to, category });
    
    try {
        // Select category
        if (typeof selectCategory === 'function') {
            selectCategory(category, null);
        }
        
        // Set units and convert
        setTimeout(() => {
            const fromUnit = document.getElementById('fromUnit');
            const toUnit = document.getElementById('toUnit');
            const valueInput = document.getElementById('valueInput');
            
            if (fromUnit && toUnit && valueInput) {
                fromUnit.value = from;
                toUnit.value = to;
                valueInput.value = 1;
                
                // Trigger conversion
                if (typeof convert === 'function') {
                    convert();
                    showNotification(`✅ Quick conversion: ${from} → ${to}`, 'success');
                }
            }
        }, 200);
        
    } catch (error) {
        console.error('Quick conversion error:', error);
        showNotification('❌ Conversion failed', 'error');
    }
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
    }, 3000);
}

// Initialize with user-focused design
document.addEventListener('DOMContentLoaded', function() {
    console.log('User-focused quick access system loaded!');
    userQuickAccess = loadUserQuickAccess();
    
    // Add enhanced CSS for better UX
    const styles = `
        .quick-access-section {
            margin: 20px 0;
        }
        
        .quick-access-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin: 15px 0;
            min-height: 80px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 2px dashed transparent;
            transition: all 0.3s ease;
        }
        
        .quick-access-grid.drag-over {
            border-color: var(--accent);
            background: rgba(240, 147, 251, 0.1);
            transform: scale(1.02);
        }
        
        .quick-conversion {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            padding: 12px 8px;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .quick-conversion:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        
        .quick-conversion:active {
            transform: scale(0.95);
        }
        
        .quick-conversion i {
            display: block;
            font-size: 1.2rem;
            margin-bottom: 5px;
        }
        
        .quick-access-help {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--accent);
            font-size: 0.85rem;
            margin-top: 10px;
            padding: 8px 12px;
            background: rgba(240, 147, 251, 0.1);
            border-radius: 8px;
        }
        
        .category-card {
            cursor: grab;
            transition: all 0.3s ease;
        }
        
        .category-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
        }
        
        .category-card.dragging {
            opacity: 0.7;
            transform: rotate(3deg) scale(1.05);
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
        }
        .notification.error { 
            background: linear-gradient(135deg, var(--error), #dc2626);
        }
        .notification.info { 
            background: linear-gradient(135deg, var(--primary), #3b82f6);
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
        
        @media (max-width: 768px) {
            .quick-access-grid {
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 8px;
            }
            
            .quick-conversion {
                padding: 10px 6px;
                font-size: 0.8rem;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
});

// Override populateCategories to include simple drag-and-drop
function populateCategories() {
    console.log('Setting up user-focused categories');
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = '';
    
    // Smart category ordering
    const categoryOrder = [
        "Length", "Weight", "Temperature", "Currency (Real-time)", 
        "Volume", "Area", "Speed", "Time", "Cryptocurrency (Real-time)",
        "Digital Storage (Binary)", "Digital Storage (Decimal)", 
        "Energy", "Power", "Pressure", "Data Transfer", "Frequency",
        "Cooking Volume", "Cooking Weight", "Baking Temperature"
    ];

    // Add quick access section
    const quickAccessSection = document.createElement('div');
    quickAccessSection.className = 'quick-access-section';
    quickAccessSection.innerHTML = `
        <h3 class="section-subtitle">
            <i class="fas fa-star"></i>
            Quick Access
        </h3>
        <div class="quick-access-grid">
            ${userQuickAccess.map(item => `
                <div class="quick-conversion" onclick="executeQuickConversion('${item.from}', '${item.to}', '${item.category}')">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </div>
            `).join('')}
        </div>
        <div class="quick-access-help">
            <i class="fas fa-info-circle"></i>
            <span>Drag categories here to add them to quick access</span>
        </div>
    `;
    
    // Insert quick access section
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.parentNode.insertBefore(quickAccessSection, searchContainer.nextSibling);
    }

    // Add main categories
    const mainCategoriesSection = document.createElement('div');
    mainCategoriesSection.className = 'main-categories-section';
    mainCategoriesSection.innerHTML = '<h3 class="section-subtitle">All Categories</h3>';
    
    const mainCategoriesGrid = document.createElement('div');
    mainCategoriesGrid.className = 'category-grid';

    categoryOrder.forEach(category => {
        if (categories[category]) {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.setAttribute('data-category', category);
            card.onclick = () => selectCategory(category);
            card.innerHTML = `
                <div class="category-icon">
                    <i class="${categories[category].icon}"></i>
                </div>
                <div>${category}</div>
            `;
            mainCategoriesGrid.appendChild(card);
        }
    });

    mainCategoriesSection.appendChild(mainCategoriesGrid);
    categoryGrid.appendChild(mainCategoriesSection);
    
    // Setup simple drag and drop
    setTimeout(() => {
        setupSimpleDragAndDrop();
    }, 100);
} 