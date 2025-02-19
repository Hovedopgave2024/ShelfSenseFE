export const calculateMonthlyEarnings = (data, startDate, endDate) => {
    const earningsByMonthYear = {}; // Store earnings per month & year

    data.forEach((salesOrder) => {
        const date = new Date(salesOrder.createdDate);

        // Only filter by date range
        if (
            (startDate === null || date >= startDate) &&
            (endDate === null || date <= endDate)
        ) {
            const monthYearKey = date.getFullYear() + '-' + date.getMonth();

            if (!earningsByMonthYear[monthYearKey]) {
                earningsByMonthYear[monthYearKey] = 0;
            }

            earningsByMonthYear[monthYearKey] += salesOrder.price; // ✅ Only sales order price
        }
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