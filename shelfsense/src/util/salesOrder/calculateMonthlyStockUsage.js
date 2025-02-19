export const calculateMonthlyStockUsage = (
    salesOrders,
    products,
    components,
    selectedComponentIds,
    startDate,
    endDate
) => {
    const usageByMonthYear = {}; // Store component usage per month
    const productUsageByMonthYear = {}; // Store product usage per month

    salesOrders?.forEach((salesOrder) => {
        const date = new Date(salesOrder.createdDate);
        const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`;

        // Filter by date range if provided
        if ((startDate === null || date >= startDate) && (endDate === null || date <= endDate)) {
            if (!usageByMonthYear[monthYearKey]) {
                usageByMonthYear[monthYearKey] = 0;
            }
            if (!productUsageByMonthYear[monthYearKey]) {
                productUsageByMonthYear[monthYearKey] = 0;
            }

            salesOrder.salesOrderProducts?.forEach((sop) => {
                // Count total product usage
                productUsageByMonthYear[monthYearKey] += sop.quantity;

                // Get the product associated with the sales order
                const product = products.find((p) => p.id === sop.productId);

                if (product) {
                    // Get the components associated with the product
                    const productComponents = product.productComponentList;

                    productComponents.forEach((pc) => {
                        // If selectedComponentIds are provided, filter on them
                        const isComponentSelected =
                            selectedComponentIds.length === 0 ||
                            selectedComponentIds.some((component) => component.id === pc.componentId);

                        if (isComponentSelected) {
                            // Calculate the component usage
                            const componentUsage = sop.quantity * pc.quantity;
                            usageByMonthYear[monthYearKey] += componentUsage;
                        }
                    });
                }
            });
        }
    });

    // Convert data to an array and sort by month-year
    return Object.keys(usageByMonthYear)
        .map((monthYearKey) => {
            const [year, month] = monthYearKey.split('-').map(Number);
            return {
                date: new Date(year, month), // ✅ Store actual Date object for sorting
                month: new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' }),
                componentUsage: usageByMonthYear[monthYearKey],
                productUsage: productUsageByMonthYear[monthYearKey],
            };
        })
        .sort((a, b) => a.date - b.date) // ✅ Correct sorting by Date
        .map(({ date, ...rest }) => rest); // ✅ Remove `date` field after sorting
};