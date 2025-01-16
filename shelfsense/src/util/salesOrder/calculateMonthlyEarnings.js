
export const calculateMonthlyEarnings = (data, selectedProducts, startDate, endDate) => {
    const earningsByMonthYear = {}; // Object to store earnings per month and now year


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

            const monthYearKey = date.getFullYear() + '-' + date.getMonth();
            const revenue = salesOrder.price * salesOrder.quantity;
            if (!earningsByMonthYear[monthYearKey]) {
                earningsByMonthYear[monthYearKey] = 0;
            }
            earningsByMonthYear[monthYearKey] += revenue;        }


    });

    // Convert earningsByMonthYear object into an array, sort by date
    const earningsArray = Object.keys(earningsByMonthYear).map((monthYearKey) => {
        const [year, month] = monthYearKey.split('-').map(Number);
        const date = new Date(year, month);
        const monthYearName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        return {
            month: monthYearName,
            revenue: earningsByMonthYear[monthYearKey],
        };
    });

    // Sort the array by date
    earningsArray.sort((a, b) => new Date(a.month) - new Date(b.month));

    return earningsArray;
};
