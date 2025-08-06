// ULTRA-SIMPLE QUICK ACCESS SYSTEM
// Direct approach - no complex logic, just works

// Simple storage
let quickAccessItems = [];

// Load saved items
function loadQuickAccess() {
    try {
        const saved = localStorage.getItem('quickAccess');
        return saved ? JSON.parse(saved) : getDefaultItems();
    } catch (e) {
        return getDefaultItems();
    }
}

// Default items
function getDefaultItems() {
    return [
        { name: 'USD to EUR', from: 'USD', to: 'EUR', category: 'Currency (Real-time)' },
        { name: 'Meters to Feet', from: 'meters', to: 'feet', category: 'Length' },
        { name: 'Celsius to Fahrenheit', from: 'celsius', to: 'fahrenheit', category: 'Temperature' },
        { name: 'Kg to Pounds', from: 'kilograms', to: 'pounds', category: 'Weight' }
    ];
}

// Save items
function saveQuickAccess() {
    localStorage.setItem('quickAccess', JSON.stringify(quickAccessItems));
}

// Add new item
function addToQuickAccess(categoryName) {
    if (!categories[categoryName]) return;
    
    const units = Object.keys(categories[categoryName].units);
    if (units.length < 2) return;
    
    const newItem = {
        name: `${units[0]} to ${units[1]}`,
        from: units[0],
        to: units[1],
        category: categoryName
    };
    
    // Check if already exists
    const exists = quickAccessItems.find(item => item.category === categoryName);
    if (exists) {
        alert(`${categoryName} is already in quick access!`);
        return;
    }
    
    quickAccessItems.push(newItem);
    saveQuickAccess();
    renderQuickAccess();
    
    // Show success
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #10b981; color: white; padding: 15px; 
        border-radius: 8px; z-index: 10000; font-weight: bold;
    `;
    notification.textContent = `✅ Added ${categoryName} to quick access!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Render quick access
function renderQuickAccess() {
    const container = document.querySelector('.quick-access-section');
    if (!container) return;
    
    container.innerHTML = `
        <h3 style="color: #f093fb; margin: 20px 0 15px 0; font-size: 1.2rem;">
            ⭐ Quick Access
        </h3>
        <div class="quick-grid" style="
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 10px; 
            margin: 15px 0;
        ">
            ${quickAccessItems.map(item => `
                <div onclick="doQuickConvert('${item.from}', '${item.to}', '${item.category}')" 
                     style="
                         background: linear-gradient(135deg, #667eea, #f093fb);
                         color: white; padding: 15px; border-radius: 10px;
                         text-align: center; cursor: pointer; font-weight: bold;
                         transition: transform 0.2s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                     "
                     onmouseover="this.style.transform='translateY(-3px)'"
                     onmouseout="this.style.transform=''"
                >
                    ${item.name}
                </div>
            `).join('')}
        </div>
        <div style="
            background: rgba(240, 147, 251, 0.1); 
            padding: 10px; border-radius: 8px; 
            color: #f093fb; font-size: 0.9rem; text-align: center;
        ">
            💡 Drag categories here to add them to quick access
        </div>
    `;
}

// Do quick conversion
function doQuickConvert(from, to, category) {
    console.log('Quick convert:', from, to, category);
    
    // Select category
    if (typeof selectCategory === 'function') {
        selectCategory(category);
    }
    
    // Set values after a short delay
    setTimeout(() => {
        const fromSelect = document.getElementById('fromUnit');
        const toSelect = document.getElementById('toUnit');
        const valueInput = document.getElementById('valueInput');
        
        if (fromSelect && toSelect && valueInput) {
            fromSelect.value = from;
            toSelect.value = to;
            valueInput.value = 1;
            
            // Trigger conversion
            if (typeof convert === 'function') {
                convert();
                
                // Show success
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed; top: 20px; right: 20px; 
                    background: #10b981; color: white; padding: 15px; 
                    border-radius: 8px; z-index: 10000; font-weight: bold;
                `;
                notification.textContent = `✅ Converted ${from} to ${to}`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
            }
        }
    }, 300);
}

// Setup drag and drop
function setupDragDrop() {
    // Make categories draggable
    document.querySelectorAll('.category-card').forEach(card => {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', card.dataset.category);
            card.style.opacity = '0.5';
        });
        card.addEventListener('dragend', () => {
            card.style.opacity = '';
        });
    });
    
    // Make quick access area a drop zone
    const quickSection = document.querySelector('.quick-access-section');
    if (quickSection) {
        quickSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            quickSection.style.background = 'rgba(240, 147, 251, 0.1)';
        });
        
        quickSection.addEventListener('dragleave', () => {
            quickSection.style.background = '';
        });
        
        quickSection.addEventListener('drop', (e) => {
            e.preventDefault();
            quickSection.style.background = '';
            
            const category = e.dataTransfer.getData('text');
            if (category) {
                addToQuickAccess(category);
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ultra-simple quick access loaded!');
    quickAccessItems = loadQuickAccess();
    
    // Wait for categories to load, then setup
    setTimeout(() => {
        setupDragDrop();
    }, 1000);
});

// Override populateCategories
function populateCategories() {
    console.log('Setting up ultra-simple categories');
    
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = '';
    
    // Add quick access section
    const quickSection = document.createElement('div');
    quickSection.className = 'quick-access-section';
    quickSection.style.margin = '20px 0';
    categoryGrid.appendChild(quickSection);
    
    // Render quick access
    renderQuickAccess();
    
    // Add categories
    const categoriesSection = document.createElement('div');
    categoriesSection.innerHTML = '<h3 style="color: #f093fb; margin: 20px 0 15px 0;">All Categories</h3>';
    
    const categoriesGrid = document.createElement('div');
    categoriesGrid.style.cssText = `
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
        gap: 15px;
    `;
    
    const categoryOrder = [
        "Length", "Weight", "Temperature", "Currency (Real-time)", 
        "Volume", "Area", "Speed", "Time", "Cryptocurrency (Real-time)",
        "Digital Storage (Binary)", "Digital Storage (Decimal)", 
        "Energy", "Power", "Pressure", "Data Transfer", "Frequency",
        "Cooking Volume", "Cooking Weight", "Baking Temperature"
    ];
    
    categoryOrder.forEach(category => {
        if (categories[category]) {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.dataset.category = category;
            card.style.cssText = `
                background: linear-gradient(135deg, #667eea, #f093fb);
                color: white; padding: 20px; border-radius: 12px;
                text-align: center; cursor: pointer; font-weight: bold;
                transition: transform 0.2s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            `;
            card.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 10px;">${categories[category].icon}</div>
                <div>${category}</div>
            `;
            card.onclick = () => selectCategory(category);
            categoriesGrid.appendChild(card);
        }
    });
    
    categoriesSection.appendChild(categoriesGrid);
    categoryGrid.appendChild(categoriesSection);
    
    // Setup drag and drop after rendering
    setTimeout(setupDragDrop, 100);
} 