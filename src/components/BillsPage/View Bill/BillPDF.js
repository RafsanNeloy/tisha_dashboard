const generateBillPDF = (bill, customer) => {
    // ... existing code ...
    
    // Add these lines to your PDF document content where you're displaying totals
    const subtotal = bill.items.reduce((sum, item) => sum + item.subTotal, 0);
    const additionalPrice = bill.additionalPrice || 0;
    
    // Calculate the discount by comparing subtotal and total, accounting for additional price
    const discountAmount = subtotal > (bill.total - additionalPrice) ? 
        subtotal - (bill.total - additionalPrice) : 0;
    
    // Add this to your PDF document structure
    // The actual implementation depends on the PDF library you're using (jsPDF, react-pdf, etc.)
    
    // Example with react-pdf:
    <View style={styles.row}>
        <Text style={styles.label}>সাবটোটাল:</Text>
        <Text style={styles.value}>৳{englishToBengali(subtotal)}</Text>
    </View>
    
    {discountAmount > 0 && (
        <View style={styles.row}>
            <Text style={styles.label}>(-) কমিশন:</Text>
            <Text style={styles.value}>৳{englishToBengali(discountAmount)}</Text>
        </View>
    )}
    
    {additionalPrice > 0 && (
        <View style={styles.row}>
            <Text style={styles.label}>(+) ট্রাঃ খরচ:</Text>
            <Text style={styles.value}>৳{englishToBengali(additionalPrice)}</Text>
        </View>
    )}
    
    <View style={styles.row}>
        <Text style={styles.labelBold}>মোট টাকা:</Text>
        <Text style={styles.valueBold}>৳{englishToBengali(bill.total)}</Text>
    </View>
    
    // ... rest of your PDF content
} 