export const calculateProductUsage = (data, startDate, endDate, products) => {
    const usageByMonthYear = {}; // Store product usage per month & year

    // Iterate through sales orders
    data.forEach((salesOrder) => {
        const date = new Date(salesOrder.createdDate);
        const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`;

        // Apply date filter
        if ((startDate === null || date >= startDate) && (endDate === null || date <= endDate)) {
            // Ensure this monthYearKey exists
            if (!usageByMonthYear[monthYearKey]) {
                usageByMonthYear[monthYearKey] = {};
            }

            // Iterate through sales order products
            salesOrder.salesOrderProducts.forEach((sop) => {
                if (!usageByMonthYear[monthYearKey][sop.productId]) {
                    usageByMonthYear[monthYearKey][sop.productId] = 0;
                }
                usageByMonthYear[monthYearKey][sop.productId] += sop.quantity;
            });
        }
    });

    // Convert `usageByMonthYear` into an array and sort by date
    return Object.keys(usageByMonthYear)
        .sort((a, b) => new Date(a) - new Date(b)) // Sort by date
        .flatMap((monthYearKey) => {
            const [year, month] = monthYearKey.split('-').map(Number); // 🔥 Ensure numbers
            return Object.keys(usageByMonthYear[monthYearKey]).map((productId) => {
                const product = products.find((p) => p.id === Number(productId));
                return {
                    month: new Date(year, month).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric'
                    }),
                    label: product ? product.name : `Unknown (${productId})`, // Map product name
                    value: usageByMonthYear[monthYearKey][productId], // Total quantity
                };
            });
        });
};