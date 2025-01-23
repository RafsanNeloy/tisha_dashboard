export const englishToBengali = (number) => {
    if (number === undefined || number === null) return '০';
    
    // Handle large numbers by converting to string first
    const numStr = number.toString().replace(/^0+/, ''); // Remove leading zeros
    if (numStr === '') return '০';
    
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return numStr.split('').map(char => {
        return bengaliNumbers[char] || char;
    }).join('');
};

export const bengaliToEnglish = (str) => {
    if (!str) return '0';
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const result = str.toString().split('').map(char => {
        const index = bengaliNumbers.indexOf(char);
        return index === -1 ? char : index;
    }).join('');
    return result.replace(/^0+/, '') || '0'; // Remove leading zeros but keep single zero
};

// Helper function to format large numbers
export const formatLargeNumber = (number) => {
    if (!number) return '০';
    return number.toLocaleString('bn-BD');
}; 