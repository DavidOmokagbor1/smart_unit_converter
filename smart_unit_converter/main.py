import tkinter as tk
from tkinter import ttk, messagebox
import math

class SmartUnitConverter:
    def __init__(self, root):
        self.root = root
        self.root.title("Smart Unit Converter")
        self.root.geometry("800x900")
        self.root.configure(bg='#1a1a2e')
        self.root.resizable(True, True)
        
        # Modern color scheme
        self.colors = {
            'bg_dark': '#1a1a2e',
            'bg_medium': '#16213e',
            'bg_light': '#0f3460',
            'accent': '#e94560',
            'text_light': '#ffffff',
            'text_gray': '#b8b8b8',
            'success': '#4ade80',
            'warning': '#fbbf24',
            'error': '#f87171'
        }
        
        # Conversion categories and their units
        self.categories = {
            "Length": {
                "meters": 1.0,
                "kilometers": 1000.0,
                "centimeters": 0.01,
                "millimeters": 0.001,
                "miles": 1609.34,
                "yards": 0.9144,
                "feet": 0.3048,
                "inches": 0.0254,
                "nautical_miles": 1852.0
            },
            "Weight": {
                "kilograms": 1.0,
                "grams": 0.001,
                "pounds": 0.453592,
                "ounces": 0.0283495,
                "tons": 1000.0,
                "metric_tons": 1000.0
            },
            "Temperature": {
                "celsius": "C",
                "fahrenheit": "F",
                "kelvin": "K"
            },
            "Volume": {
                "liters": 1.0,
                "milliliters": 0.001,
                "cubic_meters": 1000.0,
                "gallons": 3.78541,
                "quarts": 0.946353,
                "pints": 0.473176,
                "cups": 0.236588
            },
            "Area": {
                "square_meters": 1.0,
                "square_kilometers": 1000000.0,
                "square_feet": 0.092903,
                "square_yards": 0.836127,
                "acres": 4046.86,
                "hectares": 10000.0
            },
            "Speed": {
                "meters_per_second": 1.0,
                "kilometers_per_hour": 0.277778,
                "miles_per_hour": 0.44704,
                "knots": 0.514444,
                "feet_per_second": 0.3048
            },
            "Time": {
                "seconds": 1.0,
                "minutes": 60.0,
                "hours": 3600.0,
                "days": 86400.0,
                "weeks": 604800.0,
                "years": 31536000.0
            },
            "Digital Storage": {
                "bytes": 1.0,
                "kilobytes": 1024.0,
                "megabytes": 1048576.0,
                "gigabytes": 1073741824.0,
                "terabytes": 1099511627776.0
            }
        }
        
        self.setup_ui()
        
    def create_rounded_frame(self, parent, bg_color, **kwargs):
        """Create a frame with rounded corners effect"""
        frame = tk.Frame(parent, bg=bg_color, **kwargs)
        return frame
        
    def create_modern_button(self, parent, text, command, bg_color, fg_color='white', **kwargs):
        """Create a modern styled button"""
        btn = tk.Button(
            parent,
            text=text,
            command=command,
            bg=bg_color,
            fg=fg_color,
            font=("Segoe UI", 11, "bold"),
            relief='flat',
            borderwidth=0,
            padx=20,
            pady=10,
            cursor='hand2',
            **kwargs
        )
        
        # Hover effects
        def on_enter(e):
            btn['bg'] = self.lighten_color(bg_color, 20)
            
        def on_leave(e):
            btn['bg'] = bg_color
            
        btn.bind('<Enter>', on_enter)
        btn.bind('<Leave>', on_leave)
        
        return btn
        
    def lighten_color(self, color, amount):
        """Lighten a hex color by given amount"""
        # Simple color lightening - in a real app you'd use a proper color library
        return color
        
    def setup_ui(self):
        # Main container
        main_container = tk.Frame(self.root, bg=self.colors['bg_dark'])
        main_container.pack(fill='both', expand=True, padx=20, pady=20)
        
        # Header section
        header_frame = self.create_rounded_frame(main_container, self.colors['bg_medium'])
        header_frame.pack(fill='x', pady=(0, 20))
        
        # Title with icon
        title_frame = tk.Frame(header_frame, bg=self.colors['bg_medium'])
        title_frame.pack(pady=20)
        
        title_label = tk.Label(
            title_frame, 
            text="🔧 Smart Unit Converter", 
            font=("Segoe UI", 28, "bold"),
            bg=self.colors['bg_medium'],
            fg=self.colors['text_light']
        )
        title_label.pack()
        
        subtitle_label = tk.Label(
            title_frame,
            text="Convert between any units with precision",
            font=("Segoe UI", 12),
            bg=self.colors['bg_medium'],
            fg=self.colors['text_gray']
        )
        subtitle_label.pack(pady=(5, 0))
        
        # Category selection section
        category_frame = self.create_rounded_frame(main_container, self.colors['bg_medium'])
        category_frame.pack(fill='x', pady=(0, 20))
        
        category_label = tk.Label(
            category_frame, 
            text="📊 Select Conversion Category", 
            font=("Segoe UI", 14, "bold"),
            bg=self.colors['bg_medium'],
            fg=self.colors['text_light']
        )
        category_label.pack(pady=(20, 10))
        
        self.category_var = tk.StringVar()
        category_combo = ttk.Combobox(
            category_frame,
            textvariable=self.category_var,
            values=list(self.categories.keys()),
            state="readonly",
            font=("Segoe UI", 12),
            width=25
        )
        category_combo.pack(pady=(0, 20))
        category_combo.bind('<<ComboboxSelected>>', self.on_category_change)
        
        # Conversion section
        conversion_frame = self.create_rounded_frame(main_container, self.colors['bg_medium'])
        conversion_frame.pack(fill='x', pady=(0, 20))
        
        conversion_label = tk.Label(
            conversion_frame,
            text="🔄 Conversion",
            font=("Segoe UI", 14, "bold"),
            bg=self.colors['bg_medium'],
            fg=self.colors['text_light']
        )
        conversion_label.pack(pady=(20, 15))
        
        # Input section with better layout
        input_container = tk.Frame(conversion_frame, bg=self.colors['bg_medium'])
        input_container.pack(pady=(0, 20))
        
        # From section
        from_frame = tk.Frame(input_container, bg=self.colors['bg_medium'])
        from_frame.pack(side='left', padx=20, pady=10)
        
        from_label = tk.Label(
            from_frame, 
            text="From", 
            font=("Segoe UI", 12, "bold"),
            bg=self.colors['bg_medium'],
            fg=self.colors['text_light']
        )
        from_label.pack()
        
        self.from_var = tk.StringVar()
        self.from_combo = ttk.Combobox(
            from_frame,
            textvariable=self.from_var,
            state="readonly",
            font=("Segoe UI", 11),
            width=18
        )
        self.from_combo.pack(pady=(5, 10))
        
        # Value input
        value_label = tk.Label(
            from_frame,
            text="Value",
            font=("Segoe UI", 12, "bold"),
            bg=self.colors['bg_medium'],
            fg=self.colors['text_light']
        )
        value_label.pack()
        
        self.value_var = tk.StringVar()
        value_entry = tk.Entry(
            from_frame,
            textvariable=self.value_var,
            font=("Segoe UI", 16),
            width=15,
            justify='center',
            relief='flat',
            bg=self.colors['bg_light'],
            fg=self.colors['text_light'],
            insertbackground=self.colors['text_light']
        )
        value_entry.pack(pady=(5, 0))
        value_entry.bind('<KeyRelease>', self.on_value_change)
        
        # Arrow
        arrow_label = tk.Label(
            input_container,
            text="➜",
            font=("Segoe UI", 24, "bold"),
            bg=self.colors['bg_medium'],
            fg=self.colors['accent']
        )
        arrow_label.pack(side='left', padx=20, pady=20)
        
        # To section
        to_frame = tk.Frame(input_container, bg=self.colors['bg_medium'])
        to_frame.pack(side='left', padx=20, pady=10)
        
        to_label = tk.Label(
            to_frame, 
            text="To", 
            font=("Segoe UI", 12, "bold"),
            bg=self.colors['bg_medium'],
            fg=self.colors['text_light']
        )
        to_label.pack()
        
        self.to_var = tk.StringVar()
        self.to_combo = ttk.Combobox(
            to_frame,
            textvariable=self.to_var,
            state="readonly",
            font=("Segoe UI", 11),
            width=18
        )
        self.to_combo.pack(pady=(5, 10))
        
        # Result display
        result_frame = self.create_rounded_frame(conversion_frame, self.colors['bg_light'])
        result_frame.pack(fill='x', padx=20, pady=(0, 20))
        
        self.result_var = tk.StringVar()
        self.result_var.set("Enter a value to see the conversion result")
        
        result_label = tk.Label(
            result_frame,
            textvariable=self.result_var,
            font=("Segoe UI", 16, "bold"),
            bg=self.colors['bg_light'],
            fg=self.colors['text_light'],
            pady=20
        )
        result_label.pack()
        
        # Buttons section
        button_frame = tk.Frame(conversion_frame, bg=self.colors['bg_medium'])
        button_frame.pack(pady=(0, 20))
        
        # Convert button
        convert_btn = self.create_modern_button(
            button_frame,
            "🔄 Convert",
            self.convert,
            self.colors['accent']
        )
        convert_btn.pack(side='left', padx=5)
        
        # Clear button
        clear_btn = self.create_modern_button(
            button_frame,
            "🗑️ Clear",
            self.clear_all,
            self.colors['error']
        )
        clear_btn.pack(side='left', padx=5)
        
        # Swap button
        swap_btn = self.create_modern_button(
            button_frame,
            "🔄 Swap",
            self.swap_units,
            self.colors['warning']
        )
        swap_btn.pack(side='left', padx=5)
        
        # History section
        history_frame = self.create_rounded_frame(main_container, self.colors['bg_medium'])
        history_frame.pack(fill='both', expand=True, pady=(0, 20))
        
        history_label = tk.Label(
            history_frame,
            text="📝 Conversion History",
            font=("Segoe UI", 14, "bold"),
            bg=self.colors['bg_medium'],
            fg=self.colors['text_light']
        )
        history_label.pack(pady=(20, 10))
        
        # History text area with scrollbar
        history_container = tk.Frame(history_frame, bg=self.colors['bg_medium'])
        history_container.pack(fill='both', expand=True, padx=20, pady=(0, 20))
        
        self.history_text = tk.Text(
            history_container,
            height=8,
            font=("Segoe UI", 10),
            bg=self.colors['bg_light'],
            fg=self.colors['text_light'],
            relief='flat',
            borderwidth=0,
            insertbackground=self.colors['text_light']
        )
        self.history_text.pack(side='left', fill='both', expand=True)
        
        # Scrollbar for history
        scrollbar = tk.Scrollbar(history_container, command=self.history_text.yview)
        scrollbar.pack(side='right', fill='y')
        self.history_text.config(yscrollcommand=scrollbar.set)
        
    def on_category_change(self, event=None):
        category = self.category_var.get()
        if category:
            units = list(self.categories[category].keys())
            self.from_combo['values'] = units
            self.to_combo['values'] = units
            
            if units:
                self.from_var.set(units[0])
                self.to_var.set(units[1] if len(units) > 1 else units[0])
                
    def on_value_change(self, event=None):
        self.convert()
        
    def convert(self):
        try:
            category = self.category_var.get()
            from_unit = self.from_var.get()
            to_unit = self.to_var.get()
            value = float(self.value_var.get())
            
            if not all([category, from_unit, to_unit]):
                return
                
            if category == "Temperature":
                result = self.convert_temperature(value, from_unit, to_unit)
            else:
                result = self.convert_standard(value, from_unit, to_unit, category)
                
            self.result_var.set(f"{value} {from_unit} = {result:.6f} {to_unit}")
            self.add_to_history(f"{value} {from_unit} = {result:.6f} {to_unit}")
            
        except ValueError:
            self.result_var.set("Please enter a valid number")
        except Exception as e:
            self.result_var.set(f"Error: {str(e)}")
            
    def convert_standard(self, value, from_unit, to_unit, category):
        units = self.categories[category]
        base_value = value * units[from_unit]
        result = base_value / units[to_unit]
        return result
        
    def convert_temperature(self, value, from_unit, to_unit):
        # Convert to Celsius first
        if from_unit == "fahrenheit":
            celsius = (value - 32) * 5/9
        elif from_unit == "kelvin":
            celsius = value - 273.15
        else:  # celsius
            celsius = value
            
        # Convert from Celsius to target unit
        if to_unit == "fahrenheit":
            return celsius * 9/5 + 32
        elif to_unit == "kelvin":
            return celsius + 273.15
        else:  # celsius
            return celsius
            
    def clear_all(self):
        self.value_var.set("")
        self.result_var.set("Enter a value to see the conversion result")
        
    def swap_units(self):
        from_unit = self.from_var.get()
        to_unit = self.to_var.get()
        self.from_var.set(to_unit)
        self.to_var.set(from_unit)
        self.convert()
        
    def add_to_history(self, conversion):
        self.history_text.insert('1.0', conversion + '\n')
        
if __name__ == "__main__":
    root = tk.Tk()
    app = SmartUnitConverter(root)
    root.mainloop() 