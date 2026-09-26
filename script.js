document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('converter-form');
    const inputField = document.getElementById('temperature-input');
    const unitSelect = document.getElementById('unit-select');
    const errorMessage = document.getElementById('error-message');

    // Output Display Elements
    const resCelsius = document.getElementById('res-celsius');
    const resFahrenheit = document.getElementById('res-fahrenheit');
    const resKelvin = document.getElementById('res-kelvin');

    // Card Containers for Active Unit Highlighting
    const cardCelsius = document.getElementById('card-celsius');
    const cardFahrenheit = document.getElementById('card-fahrenheit');
    const cardKelvin = document.getElementById('card-kelvin');

    // Absolute Zero Limits (in respective units)
    const ABSOLUTE_ZERO = {
        celsius: -273.15,
        fahrenheit: -459.67,
        kelvin: 0
    };

    /**
     * Converts an input temperature value to Celsius, Fahrenheit, and Kelvin.
     * @param {number} value - The numerical temperature value.
     * @param {string} fromUnit - 'celsius' | 'fahrenheit' | 'kelvin'
     * @returns {Object} { celsius, fahrenheit, kelvin }
     */
    function convertTemperature(value, fromUnit) {
        let celsius, fahrenheit, kelvin;

        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                fahrenheit = (value * 9 / 5) + 32;
                kelvin = value + 273.15;
                break;

            case 'fahrenheit':
                celsius = (value - 32) * 5 / 9;
                fahrenheit = value;
                kelvin = celsius + 273.15;
                break;

            case 'kelvin':
                celsius = value - 273.15;
                fahrenheit = (celsius * 9 / 5) + 32;
                kelvin = value;
                break;
        }

        return { celsius, fahrenheit, kelvin };
    }

    /**
     * Highlights the selected input unit card visually.
     * @param {string} selectedUnit 
     */
    function updateActiveCardHighlight(selectedUnit) {
        cardCelsius.classList.toggle('active-unit', selectedUnit === 'celsius');
        cardFahrenheit.classList.toggle('active-unit', selectedUnit === 'fahrenheit');
        cardKelvin.classList.toggle('active-unit', selectedUnit === 'kelvin');
    }

    /**
     * Formats numbers to max 2 decimal places if needed.
     * @param {number} val 
     * @returns {string}
     */
    function formatValue(val) {
        return Number.isInteger(val) ? val.toString() : val.toFixed(2);
    }

    /**
     * Clears all output display values.
     */
    function clearResults() {
        resCelsius.textContent = '--';
        resFahrenheit.textContent = '--';
        resKelvin.textContent = '--';
    }

    /**
     * Validates input and performs temperature calculations.
     */
    function handleConversion() {
        const rawInput = inputField.value.trim();
        const selectedUnit = unitSelect.value;

        // Reset error message
        errorMessage.textContent = '';

        // Highlight selected input unit
        updateActiveCardHighlight(selectedUnit);

        // 1. Validation: Check if input is empty
        if (rawInput === '') {
            errorMessage.textContent = 'Please enter a temperature value.';
            clearResults();
            return;
        }

        // 2. Validation: Check if input is a valid number
        const numericValue = Number(rawInput);
        if (isNaN(numericValue)) {
            errorMessage.textContent = 'Invalid input: Please enter a valid number.';
            clearResults();
            return;
        }

        // 3. Validation: Absolute Zero Check
        const minAllowed = ABSOLUTE_ZERO[selectedUnit];
        if (numericValue < minAllowed) {
            const unitSymbol = selectedUnit === 'celsius' ? '°C' : selectedUnit === 'fahrenheit' ? '°F' : 'K';
            errorMessage.textContent = `Value below Absolute Zero (${minAllowed} ${unitSymbol}).`;
            clearResults();
            return;
        }

        // 4. Calculations & Output Display
        const results = convertTemperature(numericValue, selectedUnit);
        
        resCelsius.textContent = formatValue(results.celsius);
        resFahrenheit.textContent = formatValue(results.fahrenheit);
        resKelvin.textContent = formatValue(results.kelvin);
    }

    // Event Listeners
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleConversion();
    });

    // Real-time update on input typing
    inputField.addEventListener('input', handleConversion);

    // Update highlights/values when unit select changes
    unitSelect.addEventListener('change', handleConversion);

    // Initial highlight setting on page load
    updateActiveCardHighlight(unitSelect.value);
});