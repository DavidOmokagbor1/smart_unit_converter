// Customizable Quick Access System
// Allows users to personalize their quick access conversions

class CustomizableQuickAccess {
    constructor() {
        this.userQuickAccess = this.loadUserQuickAccess();
        this.maxQuickAccess = 6; // Maximum 6 quick access items
        this.isEditMode = false;
        this.init();
    }

    // Load user's saved quick access from localStorage
    loadUserQuickAccess() {
        const saved = localStorage.getItem('userQuickAccess');
        if (saved) {
            return JSON.parse(saved);
        }
        // Default quick access items
        return [
            { id: 'usd-eur', fromUnit: 'USD', toUnit: 'EUR', value: 1, icon: 'fas fa-dollar-sign', label: 'USD → EUR' },
            { id: 'meters-feet', fromUnit: 'meters', toUnit: 'feet', value: 1, icon: 'fas fa-ruler', label: 'Meters → Feet' },
            { id: 'celsius-fahrenheit', fromUnit: 'celsius', toUnit: 'fahrenheit', value: 25, icon: 'fas fa-thermometer-half', label: '°C → °F' },
            { id: 'kg-lbs', fromUnit: 'kilograms', toUnit: 'pounds', value: 1, icon: 'fas fa-weight-hanging', label: 'Kg → Lbs' },
            { id: 'liters-gallons', fromUnit: 'liters', toUnit: 'gallons', value: 1, icon: 'fas fa-tint', label: 'L → Gal' },
            { id: 'km-miles', fromUnit: 'kilometers', toUnit: 'miles', value: 1, icon: 'fas fa-road', label: 'Km → Miles' }
        ];
    }

    // Save user's quick access to localStorage
    saveUserQuickAccess() {
        localStorage.setItem('userQuickAccess', JSON.stringify(this.userQuickAccess));
    }

    // Initialize the customizable quick access
    init() {
        this.renderQuickAccess();
        this.setupEventListeners();
    }

    // Render the quick access section
    renderQuickAccess() {
        const quickAccessSection = document.querySelector('.quick-access-section');
        if (!quickAccessSection) return;

        quickAccessSection.innerHTML = `
            <div class="quick-access-header">
                <h3 class="section-subtitle">
                    <i class="fas fa-lightbulb"></i>
                    Quick Access
                </h3>
                <div class="quick-access-controls">
                    <button class="edit-btn" onclick="customizableQuickAccess.toggleEditMode()" title="Edit Quick Access">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="add-btn" onclick="customizableQuickAccess.showAddDialog()" title="Add New Quick Access">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="quick-access-grid" id="quickAccessGrid">
                ${this.userQuickAccess.map((item, index) => this.renderQuickAccessItem(item, index)).join('')}
            </div>
            <div class="quick-access-edit-tools" id="editTools" style="display: none;">
                <button class="save-btn" onclick="customizableQuickAccess.saveChanges()">
                    <i class="fas fa-save"></i> Save Changes
                </button>
                <button class="reset-btn" onclick="customizableQuickAccess.resetToDefault()">
                    <i class="fas fa-undo"></i> Reset to Default
                </button>
            </div>
        `;
    }

    // Render individual quick access item
    renderQuickAccessItem(item, index) {
        const dragHandle = this.isEditMode ? 
            `<div class="drag-handle" draggable="true" data-index="${index}">
                <i class="fas fa-grip-vertical"></i>
            </div>` : '';
        
        const removeBtn = this.isEditMode ? 
            `<button class="remove-btn" onclick="customizableQuickAccess.removeItem(${index})" title="Remove">
                <i class="fas fa-times"></i>
            </button>` : '';

        return `
            <div class="quick-conversion ${this.isEditMode ? 'edit-mode' : ''}" 
                 data-index="${index}" 
                 onclick="${this.isEditMode ? '' : `customizableQuickAccess.executeQuickConversion('${item.id}')`}">
                ${dragHandle}
                <div class="quick-conversion-content">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </div>
                ${removeBtn}
            </div>
        `;
    }

    // Toggle edit mode
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        this.renderQuickAccess();
        this.setupDragAndDrop();
        
        const editTools = document.getElementById('editTools');
        if (editTools) {
            editTools.style.display = this.isEditMode ? 'flex' : 'none';
        }
    }

    // Show dialog to add new quick access
    showAddDialog() {
        if (this.userQuickAccess.length >= this.maxQuickAccess) {
            this.showNotification('Maximum 6 quick access items allowed', 'warning');
            return;
        }

        const dialog = document.createElement('div');
        dialog.className = 'add-quick-access-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Add Quick Access</h3>
                <div class="form-group">
                    <label>Category:</label>
                    <select id="addCategory" onchange="customizableQuickAccess.updateUnitOptions()">
                        <option value="">Select Category</option>
                        ${Object.keys(categories).map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>From Unit:</label>
                    <select id="addFromUnit" disabled>
                        <option value="">Select Unit</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>To Unit:</label>
                    <select id="addToUnit" disabled>
                        <option value="">Select Unit</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Default Value:</label>
                    <input type="number" id="addValue" value="1" step="any">
                </div>
                <div class="dialog-buttons">
                    <button onclick="customizableQuickAccess.addQuickAccess()">Add</button>
                    <button onclick="customizableQuickAccess.closeDialog()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        this.setupDialogStyles();
    }

    // Update unit options when category is selected
    updateUnitOptions() {
        const category = document.getElementById('addCategory').value;
        const fromUnit = document.getElementById('addFromUnit');
        const toUnit = document.getElementById('addToUnit');
        
        if (category && categories[category]) {
            const units = Object.keys(categories[category].units);
            fromUnit.innerHTML = '<option value="">Select Unit</option>' + 
                units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
            toUnit.innerHTML = '<option value="">Select Unit</option>' + 
                units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
            
            fromUnit.disabled = false;
            toUnit.disabled = false;
        } else {
            fromUnit.innerHTML = '<option value="">Select Unit</option>';
            toUnit.innerHTML = '<option value="">Select Unit</option>';
            fromUnit.disabled = true;
            toUnit.disabled = true;
        }
    }

    // Add new quick access item
    addQuickAccess() {
        const category = document.getElementById('addCategory').value;
        const fromUnit = document.getElementById('addFromUnit').value;
        const toUnit = document.getElementById('addToUnit').value;
        const value = parseFloat(document.getElementById('addValue').value);

        if (!category || !fromUnit || !toUnit) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const newItem = {
            id: `${fromUnit}-${toUnit}`,
            fromUnit: fromUnit,
            toUnit: toUnit,
            value: value,
            icon: categories[category].icon,
            label: `${fromUnit} → ${toUnit}`
        };

        this.userQuickAccess.push(newItem);
        this.saveUserQuickAccess();
        this.renderQuickAccess();
        this.closeDialog();
        this.showNotification('Quick access added successfully!', 'success');
    }

    // Remove quick access item
    removeItem(index) {
        this.userQuickAccess.splice(index, 1);
        this.renderQuickAccess();
    }

    // Save changes
    saveChanges() {
        this.saveUserQuickAccess();
        this.isEditMode = false;
        this.renderQuickAccess();
        this.showNotification('Changes saved successfully!', 'success');
    }

    // Reset to default
    resetToDefault() {
        this.userQuickAccess = this.loadUserQuickAccess();
        this.saveUserQuickAccess();
        this.renderQuickAccess();
        this.showNotification('Reset to default quick access', 'info');
    }

    // Execute quick conversion
    executeQuickConversion(itemId) {
        const item = this.userQuickAccess.find(qa => qa.id === itemId);
        if (item) {
            // Find the appropriate category
            let category = null;
            for (const [catName, catData] of Object.entries(categories)) {
                if (catData.units[item.fromUnit] && catData.units[item.toUnit]) {
                    category = catName;
                    break;
                }
            }

            if (category) {
                selectCategory(category);
                setTimeout(() => {
                    document.getElementById('fromUnit').value = item.fromUnit;
                    document.getElementById('toUnit').value = item.toUnit;
                    document.getElementById('valueInput').value = item.value;
                    convert();
                }, 100);
            }
        }
    }

    // Setup drag and drop functionality
    setupDragAndDrop() {
        const grid = document.getElementById('quickAccessGrid');
        if (!grid) return;

        const items = grid.querySelectorAll('.quick-conversion');
        items.forEach(item => {
            item.addEventListener('dragstart', this.handleDragStart.bind(this));
            item.addEventListener('dragover', this.handleDragOver.bind(this));
            item.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = parseInt(e.target.closest('.quick-conversion').dataset.index);
        
        if (fromIndex !== toIndex) {
            const item = this.userQuickAccess.splice(fromIndex, 1)[0];
            this.userQuickAccess.splice(toIndex, 0, item);
            this.renderQuickAccess();
            this.setupDragAndDrop();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Add global event listeners if needed
    }

    // Close dialog
    closeDialog() {
        const dialog = document.querySelector('.add-quick-access-dialog');
        if (dialog) {
            dialog.remove();
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

    // Setup dialog styles
    setupDialogStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .add-quick-access-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .dialog-content {
                background: var(--glass);
                padding: 20px;
                border-radius: 12px;
                min-width: 300px;
                backdrop-filter: blur(10px);
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 600;
            }
            
            .form-group select,
            .form-group input {
                width: 100%;
                padding: 8px;
                border: 1px solid var(--glass);
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.1);
                color: var(--text);
            }
            
            .dialog-buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
            }
            
            .dialog-buttons button {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .dialog-buttons button:first-child {
                background: var(--accent);
                color: white;
            }
            
            .dialog-buttons button:last-child {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text);
            }
            
            .quick-access-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .quick-access-controls {
                display: flex;
                gap: 8px;
            }
            
            .edit-btn, .add-btn {
                background: none;
                border: none;
                color: var(--accent);
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .edit-btn:hover, .add-btn:hover {
                background: rgba(240, 147, 251, 0.2);
            }
            
            .quick-conversion.edit-mode {
                position: relative;
                cursor: move;
            }
            
            .drag-handle {
                position: absolute;
                top: 5px;
                right: 5px;
                color: var(--accent);
                cursor: grab;
            }
            
            .remove-btn {
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
            }
            
            .quick-access-edit-tools {
                display: flex;
                gap: 10px;
                margin-top: 10px;
                justify-content: center;
            }
            
            .save-btn, .reset-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.85rem;
            }
            
            .save-btn {
                background: var(--success);
                color: white;
            }
            
            .reset-btn {
                background: var(--warning);
                color: white;
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
            }
            
            .notification.success { background: var(--success); }
            .notification.error { background: var(--error); }
            .notification.warning { background: var(--warning); }
            .notification.info { background: var(--primary); }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the customizable quick access
let customizableQuickAccess;
document.addEventListener('DOMContentLoaded', function() {
    customizableQuickAccess = new CustomizableQuickAccess();
}); 