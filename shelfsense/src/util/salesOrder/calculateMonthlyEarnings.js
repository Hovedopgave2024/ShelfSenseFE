
export const calculateMonthlyEarnings = (data, selectedProducts, startDate, endDate) => {
    const earningsByMonth = Array(12).fill(0); // Array for each month

    data.forEach((salesOrder) => {
        const date = new Date(salesOrder.createdDate);

        // Filter by selected products and date range if provided
        const isProductSelected =
            selectedProducts.length === 0 ||
            selectedProducts.some((product) => product.id === salesOrder.productId);

        if (
            isProductSelected &&
            (startDate === null || date >= startDate) &&
            (endDate === null || date <= endDate)
        ) {
            const month = date.getMonth(); // 0 = January, 11 = December
            const revenue = salesOrder.price * salesOrder.quantity;
            earningsByMonth[month] += revenue;
        }
    });

    return earningsByMonth.map((value, index) => ({
        month: new Date(0, index).toLocaleString('default', { month: 'long' }),
        revenue: value,
    }));
};


