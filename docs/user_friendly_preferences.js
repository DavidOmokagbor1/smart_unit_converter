// User-Friendly Preferences System
// Makes it super easy for users to customize their experience

let userPreferences = {
    quickAccess: [],
    categoryOrder: [],
    theme: 'auto',
    favoriteCategories: []
};

// Load user preferences
function loadUserPreferences() {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
        userPreferences = { ...userPreferences, ...JSON.parse(saved) };
    }
    return userPreferences;
}

// Save user preferences
function saveUserPreferences() {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
}

// Initialize user-friendly preferences
function initializeUserPreferences() {
    loadUserPreferences();
    createPreferencePanel();
    setupQuickAccess();
    setupCategoryOrder();
}

// Create a simple preference panel
function createPreferencePanel() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || document.querySelector('.preference-panel')) return;

    const preferencePanel = document.createElement('div');
    preferencePanel.className = 'preference-panel';
    preferencePanel.innerHTML = `
        <div class="preference-header">
            <h3><i class="fas fa-cog"></i> Personalize Your Experience</h3>
            <p>Make this converter work best for you!</p>
        </div>
        
        <div class="preference-section">
            <h4><i class="fas fa-star"></i> Quick Access Setup</h4>
            <p>Choose your most-used conversions (up to 6)</p>
            <div class="quick-setup-grid" id="quickSetupGrid">
                <!-- Will be populated with conversion options -->
            </div>
            <button class="setup-btn" onclick="showQuickAccessSetup()">
                <i class="fas fa-magic"></i> Setup My Quick Access
            </button>
        </div>

        <div class="preference-section">
            <h4><i class="fas fa-th-large"></i> Category Organization</h4>
            <p>Arrange categories in your preferred order</p>
            <button class="setup-btn" onclick="showCategorySetup()">
                <i class="fas fa-sort"></i> Organize My Categories
            </button>
        </div>

        <div class="preference-section">
            <h4><i class="fas fa-heart"></i> Favorite Categories</h4>
            <p>Mark your most-used categories</p>
            <button class="setup-btn" onclick="showFavoriteSetup()">
                <i class="fas fa-heart"></i> Choose My Favorites
            </button>
        </div>
    `;

    // Insert after search container
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.parentNode.insertBefore(preferencePanel, searchContainer.nextSibling);
    } else {
        sidebar.insertBefore(preferencePanel, sidebar.firstChild);
    }
}

// Show quick access setup with simple choices
function showQuickAccessSetup() {
    const modal = createModal('Choose Your Quick Access Conversions');
    
    const popularConversions = [
        { from: 'USD', to: 'EUR', label: 'USD → EUR', icon: 'fas fa-dollar-sign' },
        { from: 'meters', to: 'feet', label: 'Meters → Feet', icon: 'fas fa-ruler' },
        { from: 'celsius', to: 'fahrenheit', label: '°C → °F', icon: 'fas fa-thermometer-half' },
        { from: 'kilograms', to: 'pounds', label: 'Kg → Lbs', icon: 'fas fa-weight-hanging' },
        { from: 'liters', to: 'gallons', label: 'L → Gal', icon: 'fas fa-tint' },
        { from: 'kilometers', to: 'miles', label: 'Km → Miles', icon: 'fas fa-road' },
        { from: 'GBP', to: 'USD', label: 'GBP → USD', icon: 'fas fa-pound-sign' },
        { from: 'inches', to: 'centimeters', label: 'Inches → Cm', icon: 'fas fa-ruler-combined' },
        { from: 'pounds', to: 'kilograms', label: 'Lbs → Kg', icon: 'fas fa-weight-hanging' },
        { from: 'fahrenheit', to: 'celsius', label: '°F → °C', icon: 'fas fa-thermometer-empty' },
        { from: 'gallons', to: 'liters', label: 'Gal → L', icon: 'fas fa-tint' },
        { from: 'miles', to: 'kilometers', label: 'Miles → Km', icon: 'fas fa-road' }
    ];

    const content = document.createElement('div');
    content.className = 'quick-setup-content';
    content.innerHTML = `
        <div class="setup-instructions">
            <p><i class="fas fa-info-circle"></i> Click on the conversions you use most often. You can select up to 6.</p>
        </div>
        
        <div class="conversion-options">
            ${popularConversions.map((conv, index) => `
                <div class="conversion-option" onclick="toggleQuickAccess('${conv.from}', '${conv.to}', '${conv.label}', '${conv.icon}')" data-from="${conv.from}" data-to="${conv.to}">
                    <div class="option-icon">
                        <i class="${conv.icon}"></i>
                    </div>
                    <div class="option-label">${conv.label}</div>
                    <div class="option-checkbox">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="setup-actions">
            <button class="action-btn secondary" onclick="closeModal()">Cancel</button>
            <button class="action-btn primary" onclick="saveQuickAccess()">
                <i class="fas fa-save"></i> Save My Quick Access
            </button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);
}

// Toggle quick access selection
function toggleQuickAccess(from, to, label, icon) {
    const option = document.querySelector(`[data-from="${from}"][data-to="${to}"]`);
    const isSelected = option.classList.contains('selected');
    
    if (isSelected) {
        option.classList.remove('selected');
        userPreferences.quickAccess = userPreferences.quickAccess.filter(qa => qa.from !== from || qa.to !== to);
    } else {
        if (userPreferences.quickAccess.length < 6) {
            option.classList.add('selected');
            userPreferences.quickAccess.push({ from, to, label, icon });
        } else {
            showNotification('You can only select up to 6 quick access items', 'warning');
        }
    }
}

// Save quick access preferences
function saveQuickAccess() {
    saveUserPreferences();
    setupQuickAccess();
    closeModal();
    showNotification('✅ Your quick access has been saved!', 'success');
}

// Show category setup with simple drag and drop
function showCategorySetup() {
    const modal = createModal('Organize Your Categories');
    
    const content = document.createElement('div');
    content.className = 'category-setup-content';
    content.innerHTML = `
        <div class="setup-instructions">
            <p><i class="fas fa-info-circle"></i> Drag categories to arrange them in your preferred order. The most important ones should be at the top.</p>
        </div>
        
        <div class="category-list" id="categorySetupList">
            ${Object.keys(categories).map((catName, index) => `
                <div class="category-setup-item" draggable="true" data-category="${catName}">
                    <div class="drag-handle">
                        <i class="fas fa-grip-vertical"></i>
                    </div>
                    <div class="category-info">
                        <i class="${categories[catName].icon}"></i>
                        <span>${catName}</span>
                    </div>
                    <div class="category-actions">
                        <button class="action-btn small" onclick="toggleFavorite('${catName}')" title="Mark as favorite">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="setup-actions">
            <button class="action-btn secondary" onclick="resetCategoryOrder()">Reset to Default</button>
            <button class="action-btn primary" onclick="saveCategoryOrder()">
                <i class="fas fa-save"></i> Save My Order
            </button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);
    setupCategoryDragAndDrop();
}

// Setup category drag and drop
function setupCategoryDragAndDrop() {
    const items = document.querySelectorAll('.category-setup-item');
    items.forEach(item => {
        item.addEventListener('dragstart', handleCategoryDragStart);
        item.addEventListener('dragover', handleCategoryDragOver);
        item.addEventListener('drop', handleCategoryDrop);
        item.addEventListener('dragenter', handleCategoryDragEnter);
        item.addEventListener('dragleave', handleCategoryDragLeave);
    });
}

function handleCategoryDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.category);
    e.target.classList.add('dragging');
}

function handleCategoryDragOver(e) {
    e.preventDefault();
}

function handleCategoryDragEnter(e) {
    e.preventDefault();
    e.target.closest('.category-setup-item')?.classList.add('drag-over');
}

function handleCategoryDragLeave(e) {
    e.target.closest('.category-setup-item')?.classList.remove('drag-over');
}

function handleCategoryDrop(e) {
    e.preventDefault();
    const fromCategory = e.dataTransfer.getData('text/plain');
    const toCategory = e.target.closest('.category-setup-item').dataset.category;
    
    if (fromCategory !== toCategory) {
        reorderCategories(fromCategory, toCategory);
    }
    
    document.querySelectorAll('.category-setup-item').forEach(item => {
        item.classList.remove('dragging', 'drag-over');
    });
}

function reorderCategories(from, to) {
    const list = document.getElementById('categorySetupList');
    const items = Array.from(list.children);
    const fromIndex = items.findIndex(item => item.dataset.category === from);
    const toIndex = items.findIndex(item => item.dataset.category === to);
    
    if (fromIndex !== -1 && toIndex !== -1) {
        const item = items[fromIndex];
        list.removeChild(item);
        list.insertBefore(item, items[toIndex]);
    }
}

// Save category order
function saveCategoryOrder() {
    const items = document.querySelectorAll('.category-setup-item');
    userPreferences.categoryOrder = Array.from(items).map(item => item.dataset.category);
    saveUserPreferences();
    setupCategoryOrder();
    closeModal();
    showNotification('✅ Your category order has been saved!', 'success');
}

// Reset category order
function resetCategoryOrder() {
    if (confirm('Reset to default category order?')) {
        userPreferences.categoryOrder = [];
        saveUserPreferences();
        setupCategoryOrder();
        showNotification('🔄 Reset to default order', 'info');
    }
}

// Toggle favorite category
function toggleFavorite(categoryName) {
    const index = userPreferences.favoriteCategories.indexOf(categoryName);
    if (index > -1) {
        userPreferences.favoriteCategories.splice(index, 1);
    } else {
        userPreferences.favoriteCategories.push(categoryName);
    }
    saveUserPreferences();
}

// Setup quick access based on user preferences
function setupQuickAccess() {
    const quickAccessSection = document.querySelector('.quick-access-section');
    if (!quickAccessSection) return;

    if (userPreferences.quickAccess.length === 0) {
        // Show default quick access with setup prompt
        quickAccessSection.innerHTML = `
            <div class="quick-access-header">
                <h3 class="section-subtitle">
                    <i class="fas fa-star"></i>
                    Quick Access
                </h3>
                <button class="setup-prompt-btn" onclick="showQuickAccessSetup()">
                    <i class="fas fa-plus"></i> Setup My Quick Access
                </button>
            </div>
            <div class="quick-access-grid">
                <div class="setup-prompt">
                    <i class="fas fa-magic"></i>
                    <p>Choose your most-used conversions for quick access!</p>
                </div>
            </div>
        `;
    } else {
        // Show user's quick access
        quickAccessSection.innerHTML = `
            <div class="quick-access-header">
                <h3 class="section-subtitle">
                    <i class="fas fa-star"></i>
                    My Quick Access
                </h3>
                <button class="edit-btn" onclick="showQuickAccessSetup()">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
            <div class="quick-access-grid">
                ${userPreferences.quickAccess.map(item => `
                    <div class="quick-conversion" onclick="executeQuickConversion('${item.from}', '${item.to}')">
                        <i class="${item.icon}"></i>
                        <span>${item.label}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Setup category order based on user preferences
function setupCategoryOrder() {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;

    categoryGrid.innerHTML = '';
    
    const categoryOrder = userPreferences.categoryOrder.length > 0 
        ? userPreferences.categoryOrder 
        : Object.keys(categories);

    categoryOrder.forEach(categoryName => {
        if (categories[categoryName]) {
            const categoryCard = createCategoryCard(categoryName);
            categoryGrid.appendChild(categoryCard);
        }
    });
}

// Create category card with favorite indicator
function createCategoryCard(categoryName) {
    const category = categories[categoryName];
    const isFavorite = userPreferences.favoriteCategories.includes(categoryName);
    
    const card = document.createElement('div');
    card.className = `category-card ${isFavorite ? 'favorite' : ''}`;
    card.onclick = () => selectCategory(categoryName);
    
    card.innerHTML = `
        <div class="category-icon">
            <i class="${category.icon}"></i>
        </div>
        <div class="category-name">${categoryName}</div>
        ${isFavorite ? '<div class="favorite-indicator"><i class="fas fa-heart"></i></div>' : ''}
    `;

    return card;
}

// Execute quick conversion
function executeQuickConversion(from, to) {
    // Find the appropriate category
    let category = null;
    for (const [catName, catData] of Object.entries(categories)) {
        if (catData.units[from] && catData.units[to]) {
            category = catName;
            break;
        }
    }

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

// Create modal for setup dialogs
function createModal(title) {
    const modal = document.createElement('div');
    modal.className = 'setup-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body"></div>
        </div>
    `;
    return modal;
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.setup-modal');
    if (modal) {
        modal.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
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
    initializeUserPreferences();
    
    // Add enhanced CSS for user-friendly preferences
    const styles = `
        .preference-panel {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            margin: 15px 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .preference-header h3 {
            color: var(--accent);
            margin-bottom: 5px;
            font-size: 1.1rem;
        }

        .preference-header p {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 15px;
        }

        .preference-section {
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
        }

        .preference-section h4 {
            color: var(--accent);
            margin-bottom: 8px;
            font-size: 1rem;
        }

        .preference-section p {
            color: var(--text-secondary);
            font-size: 0.85rem;
            margin-bottom: 12px;
        }

        .setup-btn {
            background: linear-gradient(135deg, var(--accent), var(--primary));
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            width: 100%;
        }

        .setup-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
        }

        .setup-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
            background: var(--glass);
            border-radius: 16px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header h3 {
            color: var(--accent);
            margin: 0;
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 1.2rem;
            padding: 5px;
        }

        .modal-body {
            padding: 20px;
        }

        .setup-instructions {
            background: rgba(240, 147, 251, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 3px solid var(--accent);
        }

        .conversion-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }

        .conversion-option {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .conversion-option:hover {
            background: rgba(240, 147, 251, 0.2);
            transform: translateY(-2px);
        }

        .conversion-option.selected {
            background: rgba(79, 172, 254, 0.2);
            border-color: var(--success);
        }

        .option-icon {
            color: var(--accent);
            font-size: 1.2rem;
        }

        .option-label {
            flex: 1;
            font-weight: 500;
        }

        .option-checkbox {
            color: var(--success);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .conversion-option.selected .option-checkbox {
            opacity: 1;
        }

        .setup-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        .action-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .action-btn.primary {
            background: var(--success);
            color: white;
        }

        .action-btn.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text);
        }

        .action-btn.small {
            padding: 5px 10px;
            font-size: 0.8rem;
        }

        .category-setup-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            margin-bottom: 8px;
            cursor: move;
            transition: all 0.3s ease;
        }

        .category-setup-item:hover {
            background: rgba(240, 147, 251, 0.1);
        }

        .category-setup-item.dragging {
            opacity: 0.5;
            transform: rotate(2deg);
        }

        .category-setup-item.drag-over {
            background: rgba(79, 172, 254, 0.2);
            transform: scale(1.02);
        }

        .drag-handle {
            color: var(--accent);
            cursor: grab;
        }

        .category-info {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }

        .category-card.favorite {
            border: 2px solid var(--accent);
            background: rgba(240, 147, 251, 0.1);
        }

        .favorite-indicator {
            position: absolute;
            top: 5px;
            right: 5px;
            color: var(--accent);
            font-size: 0.8rem;
        }

        .setup-prompt-btn {
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 0.8rem;
        }

        .setup-prompt {
            text-align: center;
            padding: 20px;
            color: var(--text-secondary);
        }

        .setup-prompt i {
            font-size: 2rem;
            color: var(--accent);
            margin-bottom: 10px;
        }

        @media (max-width: 768px) {
            .conversion-options {
                grid-template-columns: 1fr;
            }
            
            .modal-content {
                width: 95%;
                margin: 10px;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}); 