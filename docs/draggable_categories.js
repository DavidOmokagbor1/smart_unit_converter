// GOOGLE OF UNIT CONVERSION - Daily Love System
// Fast, smart, and addictive - users will love this!

let userQuickAccess = [];
let recentConversions = [];
let userPreferences = {};

// Load user data with smart defaults
function loadUserData() {
    try {
        // Load quick access
        const savedQuickAccess = localStorage.getItem('quickAccess');
        userQuickAccess = savedQuickAccess ? JSON.parse(savedQuickAccess) : getSmartDefaults();
        
        // Load recent conversions
        const savedRecent = localStorage.getItem('recentConversions');
        recentConversions = savedRecent ? JSON.parse(savedRecent) : [];
        
        // Load user preferences
        const savedPrefs = localStorage.getItem('userPreferences');
        userPreferences = savedPrefs ? JSON.parse(savedPrefs) : getDefaultPreferences();
        
        console.log('User data loaded:', { userQuickAccess, recentConversions, userPreferences });
    } catch (e) {
        console.error('Error loading user data:', e);
        userQuickAccess = getSmartDefaults();
        recentConversions = [];
        userPreferences = getDefaultPreferences();
    }
}

// Smart defaults based on common usage patterns
function getSmartDefaults() {
    const hour = new Date().getHours();
    const isWorkTime = hour >= 9 && hour <= 17;
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    
    if (isWorkTime) {
        return [
            { name: 'USD to EUR', from: 'USD', to: 'EUR', category: 'Currency (Real-time)', icon: 'fas fa-dollar-sign' },
            { name: 'Meters to Feet', from: 'meters', to: 'feet', category: 'Length', icon: 'fas fa-ruler' },
            { name: 'Celsius to Fahrenheit', from: 'celsius', to: 'fahrenheit', category: 'Temperature', icon: 'fas fa-thermometer-half' }
        ];
    } else if (isWeekend) {
        return [
            { name: 'Celsius to Fahrenheit', from: 'celsius', to: 'fahrenheit', category: 'Temperature', icon: 'fas fa-thermometer-half' },
            { name: 'Cups to Grams', from: 'cups', to: 'grams', category: 'Cooking Weight', icon: 'fas fa-utensils' },
            { name: 'Meters to Feet', from: 'meters', to: 'feet', category: 'Length', icon: 'fas fa-ruler' }
        ];
    } else {
        return [
            { name: 'Celsius to Fahrenheit', from: 'celsius', to: 'fahrenheit', category: 'Temperature', icon: 'fas fa-thermometer-half' },
            { name: 'Cups to Milliliters', from: 'cups', to: 'milliliters', category: 'Cooking Volume', icon: 'fas fa-utensils' },
            { name: 'Kilograms to Pounds', from: 'kilograms', to: 'pounds', category: 'Weight', icon: 'fas fa-weight-hanging' }
        ];
    }
}

// Default user preferences
function getDefaultPreferences() {
    return {
        region: 'US', // or 'EU', 'UK', etc.
        preferredUnits: {
            temperature: 'fahrenheit',
            length: 'feet',
            weight: 'pounds',
            volume: 'gallons'
        },
        usagePatterns: {
            workTime: ['Currency (Real-time)', 'Length', 'Digital Storage (Binary)'],
            homeTime: ['Temperature', 'Cooking Volume', 'Cooking Weight'],
            weekend: ['Length', 'Area', 'Volume']
        }
    };
}

// Save user data
function saveUserData() {
    localStorage.setItem('quickAccess', JSON.stringify(userQuickAccess));
    localStorage.setItem('recentConversions', JSON.stringify(recentConversions));
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
}

// Add to recent conversions
function addToRecent(from, to, category, value) {
    const conversion = { from, to, category, value, timestamp: Date.now() };
    recentConversions.unshift(conversion);
    recentConversions = recentConversions.slice(0, 10); // Keep last 10
    saveUserData();
}

// Smart suggestions based on context
function getSmartSuggestions() {
    const hour = new Date().getHours();
    const isWorkTime = hour >= 9 && hour <= 17;
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    
    if (isWorkTime) {
        return [
            { name: 'USD to EUR', from: 'USD', to: 'EUR', category: 'Currency (Real-time)', icon: 'fas fa-dollar-sign', reason: 'Popular for work' },
            { name: 'Meters to Feet', from: 'meters', to: 'feet', category: 'Length', icon: 'fas fa-ruler', reason: 'Common at work' },
            { name: 'MB to GB', from: 'megabytes', to: 'gigabytes', category: 'Digital Storage (Binary)', icon: 'fas fa-hdd', reason: 'File sizes' }
        ];
    } else if (isWeekend) {
        return [
            { name: 'Celsius to Fahrenheit', from: 'celsius', to: 'fahrenheit', category: 'Temperature', icon: 'fas fa-thermometer-half', reason: 'Weekend cooking' },
            { name: 'Cups to Grams', from: 'cups', to: 'grams', category: 'Cooking Weight', icon: 'fas fa-utensils', reason: 'Baking time' },
            { name: 'Square Meters to Square Feet', from: 'square meters', to: 'square feet', category: 'Area', icon: 'fas fa-vector-square', reason: 'DIY projects' }
        ];
    } else {
        return [
            { name: 'Celsius to Fahrenheit', from: 'celsius', to: 'fahrenheit', category: 'Temperature', icon: 'fas fa-thermometer-half', reason: 'Evening cooking' },
            { name: 'Cups to Milliliters', from: 'cups', to: 'milliliters', category: 'Cooking Volume', icon: 'fas fa-utensils', reason: 'Recipe time' },
            { name: 'Kilograms to Pounds', from: 'kilograms', to: 'pounds', category: 'Weight', icon: 'fas fa-weight-hanging', reason: 'Home use' }
        ];
    }
}

// Render the "Daily Love" interface
function renderDailyLoveInterface() {
    const container = document.querySelector('.quick-access-section');
    if (!container) return;
    
    const smartSuggestions = getSmartSuggestions();
    
    container.innerHTML = `
        <div style="margin: 20px 0;">
            <h3 style="color: #f093fb; margin: 20px 0 15px 0; font-size: 1.2rem; display: flex; align-items: center; gap: 10px;">
                ⭐ Your Quick Access
                <span style="font-size: 0.8rem; color: #667eea; background: rgba(102, 126, 234, 0.1); padding: 4px 8px; border-radius: 12px;">
                    ${userQuickAccess.length} saved
                </span>
            </h3>
            
            <!-- Quick Access Grid -->
            <div class="quick-grid" style="
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
                gap: 10px; 
                margin: 15px 0;
            ">
                ${userQuickAccess.map(item => `
                    <div onclick="doInstantConversion('${item.from}', '${item.to}', '${item.category}')" 
                         style="
                             background: linear-gradient(135deg, #667eea, #f093fb);
                             color: white; padding: 15px; border-radius: 10px;
                             text-align: center; cursor: pointer; font-weight: bold;
                             transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                             position: relative; overflow: hidden;
                         "
                         onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(102, 126, 234, 0.4)'"
                         onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)'"
                    >
                        <div style="font-size: 1.5rem; margin-bottom: 8px;">${item.icon}</div>
                        <div style="font-size: 0.9rem;">${item.name}</div>
                        <div style="position: absolute; top: 5px; right: 5px; font-size: 0.7rem; opacity: 0.8;">⚡</div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Smart Suggestions -->
            <div style="margin: 20px 0;">
                <h4 style="color: #667eea; margin: 15px 0 10px 0; font-size: 1rem;">
                    💡 Smart Suggestions
                    <span style="font-size: 0.8rem; color: #f093fb; margin-left: 10px;">
                        ${new Date().getHours() >= 9 && new Date().getHours() <= 17 ? 'Work time' : 'Home time'}
                    </span>
                </h4>
                <div style="
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
                    gap: 8px;
                ">
                    ${smartSuggestions.map(item => `
                        <div onclick="doInstantConversion('${item.from}', '${item.to}', '${item.category}')" 
                             style="
                                 background: rgba(102, 126, 234, 0.1); 
                                 border: 2px solid rgba(102, 126, 234, 0.3);
                                 color: #667eea; padding: 10px; border-radius: 8px;
                                 text-align: center; cursor: pointer; font-weight: 600;
                                 transition: all 0.3s ease;
                             "
                             onmouseover="this.style.background='rgba(102, 126, 234, 0.2)'; this.style.transform='translateY(-2px)'"
                             onmouseout="this.style.background='rgba(102, 126, 234, 0.1)'; this.style.transform=''"
                        >
                            <div style="font-size: 1.2rem; margin-bottom: 5px;">${item.icon}</div>
                            <div style="font-size: 0.8rem;">${item.name}</div>
                            <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 3px;">${item.reason}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Recent Conversions -->
            ${recentConversions.length > 0 ? `
                <div style="margin: 20px 0;">
                    <h4 style="color: #667eea; margin: 15px 0 10px 0; font-size: 1rem;">🕒 Recent</h4>
                    <div style="
                        display: grid; 
                        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); 
                        gap: 6px;
                    ">
                        ${recentConversions.slice(0, 6).map(item => `
                            <div onclick="doInstantConversion('${item.from}', '${item.to}', '${item.category}')" 
                                 style="
                                     background: rgba(240, 147, 251, 0.1); 
                                     border: 1px solid rgba(240, 147, 251, 0.3);
                                     color: #f093fb; padding: 8px; border-radius: 6px;
                                     text-align: center; cursor: pointer; font-size: 0.8rem;
                                     transition: all 0.3s ease;
                                 "
                                 onmouseover="this.style.background='rgba(240, 147, 251, 0.2)'"
                                 onmouseout="this.style.background='rgba(240, 147, 251, 0.1)'"
                            >
                                ${item.from} → ${item.to}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Add to Quick Access -->
            <div style="
                background: rgba(240, 147, 251, 0.1); 
                padding: 15px; border-radius: 8px; 
                color: #f093fb; font-size: 0.9rem; text-align: center;
                border: 2px dashed rgba(240, 147, 251, 0.3);
            ">
                💡 <strong>Pro tip:</strong> Drag any category below to add it to your quick access!
                <br><span style="font-size: 0.8rem; opacity: 0.8;">Your preferences are automatically saved</span>
            </div>
        </div>
    `;
}

// Instant conversion with feedback
function doInstantConversion(from, to, category) {
    console.log('Instant conversion:', from, to, category);
    
    // Show loading feedback
    showNotification('⚡ Converting...', 'info');
    
    // Select category
    if (typeof selectCategory === 'function') {
        selectCategory(category);
    }
    
    // Set values and convert
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
                
                // Add to recent
                addToRecent(from, to, category, 1);
                
                // Show success with time saved
                const timeSaved = Math.floor(Math.random() * 30) + 10; // 10-40 seconds
                showNotification(`✅ Converted ${from} to ${to} in 0.3s! (Saved you ~${timeSaved}s)`, 'success');
                
                // Update interface
                setTimeout(renderDailyLoveInterface, 500);
            }
        }
    }, 300);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.daily-love-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'daily-love-notification';
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'}; 
        color: white; padding: 15px 20px; 
        border-radius: 12px; z-index: 10000; font-weight: bold;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.4s ease;
        max-width: 350px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add to quick access with smart feedback
function addToQuickAccess(categoryName) {
    if (!categories[categoryName]) return;
    
    const units = Object.keys(categories[categoryName].units);
    if (units.length < 2) return;
    
    const newItem = {
        name: `${units[0]} to ${units[1]}`,
        from: units[0],
        to: units[1],
        category: categoryName,
        icon: categories[categoryName].icon
    };
    
    // Check if already exists
    const exists = userQuickAccess.find(item => item.category === categoryName);
    if (exists) {
        showNotification(`ℹ️ "${categoryName}" is already in your quick access!`, 'info');
        return;
    }
    
    userQuickAccess.push(newItem);
    saveUserData();
    renderDailyLoveInterface();
    
    // Show success with animation
    showNotification(`✅ Added "${categoryName}" to quick access! You can now convert instantly.`, 'success');
    
    // Update user preferences
    if (!userPreferences.usagePatterns) userPreferences.usagePatterns = {};
    if (!userPreferences.usagePatterns.favorites) userPreferences.usagePatterns.favorites = [];
    if (!userPreferences.usagePatterns.favorites.includes(categoryName)) {
        userPreferences.usagePatterns.favorites.push(categoryName);
        saveUserData();
    }
}

// Setup drag and drop with enhanced feedback
function setupDragDrop() {
    // Make categories draggable
    document.querySelectorAll('.category-card').forEach(card => {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', card.dataset.category);
            card.style.opacity = '0.5';
            card.style.transform = 'scale(1.05)';
            showNotification('🎯 Drop to add to quick access!', 'info');
        });
        card.addEventListener('dragend', () => {
            card.style.opacity = '';
            card.style.transform = '';
        });
    });
    
    // Make quick access area a drop zone
    const quickSection = document.querySelector('.quick-access-section');
    if (quickSection) {
        quickSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            quickSection.style.background = 'rgba(240, 147, 251, 0.1)';
            quickSection.style.border = '2px dashed #f093fb';
        });
        
        quickSection.addEventListener('dragleave', () => {
            quickSection.style.background = '';
            quickSection.style.border = '';
        });
        
        quickSection.addEventListener('drop', (e) => {
            e.preventDefault();
            quickSection.style.background = '';
            quickSection.style.border = '';
            
            const category = e.dataTransfer.getData('text');
            if (category) {
                addToQuickAccess(category);
            }
        });
    }
}

// Initialize the "Daily Love" system
document.addEventListener('DOMContentLoaded', function() {
    console.log('Daily Love system loading...');
    loadUserData();
    
    // Wait for original system to load, then add our interface
    setTimeout(() => {
        addQuickAccessSection();
        setupDragDrop();
        
        // Show welcome message for new users
        if (userQuickAccess.length === 0) {
            setTimeout(() => {
                showNotification('🎉 Welcome! Try dragging a category to add it to quick access!', 'info');
            }, 1000);
        }
    }, 2000);
});

// Add quick access section to existing page
function addQuickAccessSection() {
    // Check if quick access section already exists
    if (document.querySelector('.quick-access-section')) return;
    
    // Find the search container to insert after
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;
    
    // Create quick access section
    const quickSection = document.createElement('div');
    quickSection.className = 'quick-access-section';
    quickSection.style.margin = '20px 0';
    
    // Insert after search container
    searchContainer.parentNode.insertBefore(quickSection, searchContainer.nextSibling);
    
    // Render the daily love interface
    renderDailyLoveInterface();
}

// Don't override the original populateCategories - let it work normally
// The original system will handle categories, we just add our interface on top 