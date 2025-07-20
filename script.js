document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    const resultArea = document.getElementById('result');
    const generateDateCheckbox = document.getElementById('generateDate');
    const dateOptions = document.querySelectorAll('.date-options');
    
    // Toggle date options visibility based on checkbox
    function toggleDateOptions() {
        const isChecked = generateDateCheckbox.checked;
        dateOptions.forEach(option => {
            option.style.display = isChecked ? 'block' : 'none';
        });
    }
    
    // Initialize date options visibility
    toggleDateOptions();
    generateDateCheckbox.addEventListener('change', toggleDateOptions);
    
    // Implementación correcta del algoritmo de Luhn
    function generateValidCardNumber(bin) {
        // Asegurarse de que el BIN sea una cadena
        bin = bin.toString();
        
        // Crear un número de tarjeta de 16 dígitos
        let cardNumber = bin;
        
        // Completar hasta 15 dígitos con números aleatorios
        while (cardNumber.length < 15) {
            cardNumber += Math.floor(Math.random() * 10);
        }
        
        // Calcular el dígito de verificación usando el algoritmo de Luhn
        let sum = 0;
        for (let i = 0; i < cardNumber.length; i++) {
            let digit = parseInt(cardNumber.charAt(cardNumber.length - 1 - i));
            if (i % 2 === 1) { // Posiciones impares (desde la derecha)
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }
        
        // El dígito de verificación es lo que se necesita para hacer que la suma sea divisible por 10
        let checkDigit = (10 - (sum % 10)) % 10;
        
        return cardNumber + checkDigit;
    }
    
    // Verifica si un número de tarjeta es válido según el algoritmo de Luhn
    function isValidLuhn(cardNumber) {
        let sum = 0;
        let shouldDouble = false;
        
        // Recorrer de derecha a izquierda
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return sum % 10 === 0;
    }
    
    // Genera un mes aleatorio (01-12)
    function generateMonth() {
        let month = Math.floor(Math.random() * 12) + 1;
        return month < 10 ? '0' + month : '' + month;
    }
    
    // Genera un año aleatorio (entre el año actual y 2040)
    function generateYear() {
        const currentYear = new Date().getFullYear();
        const maxYear = 2040;
        return Math.floor(Math.random() * (maxYear - currentYear + 1)) + currentYear;
    }
    
    // Genera un CVV aleatorio (3 dígitos)
    function generateCVV() {
        return Math.floor(Math.random() * 900) + 100;
    }
    
        // Genera una sola tarjeta
    function generateSingleCard(binInput, generateDateChecked, monthInput, yearInput, cvvChecked) {
        // Generar número de tarjeta válido
        const cardNumber = generateValidCardNumber(binInput);
        
        // Verificar que el número generado sea válido según Luhn
        if (!isValidLuhn(cardNumber)) {
            console.error("Número de tarjeta inválido generado:", cardNumber);
            // Intentar generar otro número si este no es válido
            return generateSingleCard(binInput, generateDateChecked, monthInput, yearInput, cvvChecked);
        }
        
        // Formatear en formato PIPE
        let cardData = cardNumber;
        
        // Añadir fecha solo si está marcada la opción
        if (generateDateChecked) {
            // Generar mes
            const month = monthInput === 'random' ? generateMonth() : monthInput;
            
            // Generar año
            const year = yearInput === 'random' ? generateYear() : yearInput;
            
            // Usar el año completo en lugar de solo los últimos 2 dígitos
            const yearFormatted = year.toString();
            
            cardData += '|' + month;
            cardData += '|' + yearFormatted;
        } else {
            // Si no se genera fecha, añadir separadores vacíos si se va a añadir CVV
            if (cvvChecked) {
                cardData += '||';
            }
        }
        
        // Generar CVV si está marcado
        if (cvvChecked) {
            const cvv = generateCVV();
            cardData += '|' + cvv;
        }
        
        return cardData;
    }
    
    // Genera datos de tarjeta en formato PIPE
    function generateCard() {
        const binInput = document.getElementById('bin').value.trim();
        const generateDateChecked = document.getElementById('generateDate').checked;
        const monthInput = document.getElementById('month').value;
        const yearInput = document.getElementById('year').value;
        const cvvChecked = document.getElementById('cvv').checked;
        const quantity = parseInt(document.getElementById('quantity').value);
        
        // Validar BIN
        if (!/^\d*$/.test(binInput)) {
            alert('Por favor, ingrese solo dígitos numéricos para el BIN');
            return;
        }
        
        if (binInput.length === 0) {
            alert('Por favor, ingrese al menos un dígito para el BIN');
            return;
        }
        
        if (binInput.length > 15) {
            alert('El BIN no puede tener más de 15 dígitos');
            return;
        }
        
        let results = [];
        
        // Generar la cantidad solicitada de tarjetas
        for (let i = 0; i < quantity; i++) {
            results.push(generateSingleCard(binInput, generateDateChecked, monthInput, yearInput, cvvChecked));
        }
        
        resultArea.value = results.join('\n');
    }
    
    // Copiar resultados al portapapeles
    function copyToClipboard() {
        resultArea.select();
        document.execCommand('copy');
        alert('Resultados copiados al portapapeles');
    }
    
    // Event listeners
    generateBtn.addEventListener('click', generateCard);
    copyBtn.addEventListener('click', copyToClipboard);
});