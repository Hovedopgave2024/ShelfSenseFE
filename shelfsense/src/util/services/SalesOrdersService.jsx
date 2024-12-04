const calculateMonthlyStockUsage = (
    salesOrders,
    products,
    components,
    selectedComponentIds,
    startDate,
    endDate
) => {
    const usageByMonth = {}; // Object to store usage per month

    salesOrders.forEach((salesOrder) => {
        const orderDate = new Date(salesOrder.createdDate);

        // Filter by date range if provided
        if (
            (startDate === null || orderDate >= startDate) &&
            (endDate === null || orderDate <= endDate)
        ) {
            const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`; // e.g., '2023-7' for August 2023

            // Get the product associated with the sales order
            const product = products.find((p) => p.id === salesOrder.productId);

            if (product) {
                // Get the components associated with the product
                const productComponents = product.productComponentList;

                productComponents.forEach((pc) => {
                    // If selectedComponentIds are provided, filter on them
                    const isComponentSelected =
                        selectedComponentIds.length === 0 ||
                        selectedComponentIds.some((component) => component.id === pc.componentId);

                    if (isComponentSelected) {
                        // Calculate the usage
                        const componentUsage = salesOrder.quantity * pc.quantity;

                        // Initialize the usage for this month if not already
                        if (!usageByMonth[monthKey]) {
                            usageByMonth[monthKey] = 0;
                        }
                        // Accumulate the usage
                        usageByMonth[monthKey] += componentUsage;
                    }
                });
            }
        }
    });

    // Convert usageByMonth object into an array, sort by month
    const usageArray = Object.keys(usageByMonth).map((monthKey) => {
        const [year, month] = monthKey.split('-').map(Number);
        const date = new Date(year, month);
        const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        return {
            month: monthName,
            usage: usageByMonth[monthKey],
        };
    });

    // Sort the array by date
    usageArray.sort((a, b) => new Date(a.month) - new Date(b.month));

    return usageArray;
};


const calculateMonthlyEarnings = (data, selectedProducts, startDate, endDate) => {
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


export { calculateMonthlyStockUsage, calculateMonthlyEarnings };


