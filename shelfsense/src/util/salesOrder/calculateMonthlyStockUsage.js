export const calculateMonthlyStockUsage = (
    salesOrders,
    products,
    components,
    selectedComponentIds,
    startDate,
    endDate
) => {
    const usageByMonthYear = {};

    salesOrders.forEach((salesOrder) => {
        const date = new Date(salesOrder.createdDate);

        // Filter by date range if provided
        if (
            (startDate === null || date >= startDate) &&
            (endDate === null || date <= endDate)
        ) {

            const monthYearKey = date.getFullYear() + '-' + date.getMonth()

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
                        if (!usageByMonthYear[monthYearKey]) {
                            usageByMonthYear[monthYearKey] = 0;
                        }
                        // Accumulate the usage
                        usageByMonthYear[monthYearKey] += componentUsage;
                    }
                });
            }
        }
    });

    // Convert usageByMonthYear object into an array, sort by month-year
    const usageArray = Object.keys(usageByMonthYear).map((monthYearKey) => {
        const [year, month] = monthYearKey.split('-').map(Number);
        const date = new Date(year, month);
        const monthYearName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        return {
            month: monthYearName,
            usage: usageByMonthYear[monthYearKey],
        };
    });

    // Sort the array by date
    usageArray.sort((a, b) => new Date(a.month) - new Date(b.month));

    return usageArray;
};

