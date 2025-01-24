export const englishToBengali = (number) => {
    if (number === undefined || number === null) return '০';
    
    // Convert number to string with proper decimal handling
    const numStr = typeof number === 'number' ? number.toString() : number;
    
    // Handle decimal numbers
    const parts = numStr.split('.');
    const integerPart = parts[0].replace(/^0+/, '') || '০';
    const decimalPart = parts[1] || '';

    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const convertPart = (part) => part.split('').map(char => bengaliNumbers[char] || char).join('');

    // Only add decimal part if it exists and is not all zeros
    return decimalPart && parseFloat('0.' + decimalPart) !== 0 
        ? `${convertPart(integerPart)}.${convertPart(decimalPart)}` 
        : convertPart(integerPart);
};

export const bengaliToEnglish = (str) => {
    if (!str) return '0';
    
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const result = str.toString().split('').map(char => {
        const index = bengaliNumbers.indexOf(char);
        return index === -1 ? char : index;
    }).join('');
    
    return result;
};

// Helper function to validate mixed number input
export const isValidMixedNumber = (value) => {
    // Allow both Bengali and English numbers with regular decimal point
    return /^[০-৯0-9]*[.]?[০-৯0-9]*$/.test(value);
};

// Helper function to convert mixed input to number
export const convertMixedInputToNumber = (value) => {
    if (!value) return 0;
    const englishNum = bengaliToEnglish(value);
    return parseFloat(englishNum);
};

// Format number with proper decimal places only if needed
export const formatNumber = (number, maxDecimals = 2) => {
    if (number === undefined || number === null) return '০';
    
    // Convert to number first
    const num = Number(number);
    
    // Check if number has decimal places
    if (num % 1 === 0) {
        // For whole numbers, don't show decimal places
        return englishToBengali(num.toString());
    } else {
        // For decimal numbers, show only necessary decimal places up to maxDecimals
        const decimalStr = num.toString();
        const [whole, decimal] = decimalStr.split('.');
        if (decimal) {
            // Remove trailing zeros from decimal part
            const cleanDecimal = decimal.replace(/0+$/, '');
            if (cleanDecimal) {
                // If we still have decimal places after removing zeros
                return englishToBengali(`${whole}.${cleanDecimal.slice(0, maxDecimals)}`);
            }
        }
        return englishToBengali(whole);
    }
};

// Helper function to format large numbers
export const formatLargeNumber = (number) => {
    if (!number) return '০';
    return number.toLocaleString('bn-BD');
}; 