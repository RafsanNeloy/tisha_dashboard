import React, { useState } from 'react';

const [additionalPrice, setAdditionalPrice] = useState(0);
const [discountPercentage, setDiscountPercentage] = useState(0);
const [discountAmount, setDiscountAmount] = useState(0);

const billData = {
    customer,
    items,
    total,
    paid,
    due,
    additionalPrice: Number(additionalPrice),
    discountPercentage: Number(discountPercentage),
    discountAmount: Number(discountAmount)
}; 