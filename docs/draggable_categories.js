// SIMPLE & RELIABLE QUICK ACCESS SYSTEM
// Focus on core functionality that works

let quickAccessItems = [];

// Load saved items
function loadQuickAccess() {
    try {
        const saved = localStorage.getItem('quickAccess');
        return saved ? JSON.parse(saved) : getDefaultItems();
    } catch (e) {
        console.error('Error loading quick access:', e);
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
    if (!categories[categoryName]) {
        console.error('Category not found:', categoryName);
        return;
    }
    
    const units = Object.keys(categories[categoryName].units);
    if (units.length < 2) {
        console.error('Not enough units in category:', categoryName);
        return;
    }
    
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
    alert(`✅ Added ${categoryName} to quick access!`);
}

// Render quick access
function renderQuickAccess() {
    const container = document.querySelector('.quick-access-section');
    if (!container) {
        console.error('Quick access container not found');
        return;
    }
    
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
    
    try {
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
                    alert(`✅ Converted ${from} to ${to}!`);
                } else {
                    console.error('convert function not found');
                }
            } else {
                console.error('Form elements not found');
            }
        }, 300);
        
    } catch (error) {
        console.error('Quick conversion error:', error);
        alert('❌ Conversion failed: ' + error.message);
    }
}

// Setup drag and drop
function setupDragDrop() {
    console.log('Setting up drag and drop...');
    
    // Make categories draggable
    const categoryCards = document.querySelectorAll('.category-card');
    console.log('Found category cards:', categoryCards.length);
    
    categoryCards.forEach(card => {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', (e) => {
            console.log('Drag start:', card.dataset.category);
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
        console.log('Quick access section found, setting up drop zone');
        
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
            console.log('Dropped category:', category);
            
            if (category) {
                addToQuickAccess(category);
            }
        });
    } else {
        console.error('Quick access section not found');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple quick access system loading...');
    quickAccessItems = loadQuickAccess();
    
    // Wait for original system to load, then add our interface
    setTimeout(() => {
        addQuickAccessSection();
        setupDragDrop();
    }, 2000);
});

// Add quick access section to existing page
function addQuickAccessSection() {
    console.log('Adding quick access section...');
    
    // Check if quick access section already exists
    if (document.querySelector('.quick-access-section')) {
        console.log('Quick access section already exists');
        return;
    }
    
    // Find the search container to insert after
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) {
        console.error('Search container not found');
        return;
    }
    
    // Create quick access section
    const quickSection = document.createElement('div');
    quickSection.className = 'quick-access-section';
    quickSection.style.margin = '20px 0';
    
    // Insert after search container
    searchContainer.parentNode.insertBefore(quickSection, searchContainer.nextSibling);
    
    // Render quick access
    renderQuickAccess();
    
    console.log('Quick access section added successfully');
}

// Don't override the original populateCategories - let it work normally
// The original system will handle categories, we just add our interface on top 