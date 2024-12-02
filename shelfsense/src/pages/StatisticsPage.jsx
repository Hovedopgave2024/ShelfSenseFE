import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar/sidebar.jsx";
import { fetchSalesOrders } from "../util/services/SalesOrdersService";
import { BarChart } from '@mui/x-charts';
import useComponentsStore from "../stores/useComponentsStore.js";

const StatisticsPage = () => {
    const [open, setOpen] = useState(false);
    const [chartData, setChartData] = useState([]);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            const salesOrders = await fetchSalesOrders();
            const monthlyEarnings = calculateMonthlyEarnings(salesOrders);
            setChartData(monthlyEarnings);
        };

        fetchData();
    }, []);

    const calculateMonthlyEarnings = (data) => {
        const earningsByMonth = Array(12).fill(0); // Array for each month

        data.forEach((salesOrder) => {
            const date = new Date(salesOrder.createdDate);
            const month = date.getMonth(); // 0 = January, 11 = December
            const revenue = salesOrder.price * salesOrder.quantity;
            earningsByMonth[month] += revenue;
        });

        return earningsByMonth.map((value, index) => ({
            month: new Date(0, index).toLocaleString('default', { month: 'long' }),
            revenue: value,
        }));
    };
    return (
        <Box>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box sx={{ margin: 4 }}>
                <BarChart
                    xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                    series={[{ dataKey: 'revenue', label: 'Monthly revenue' }]}
                    height={400}
                    dataset={chartData}
                />
            </Box>
        </Box>
    );
};

export default StatisticsPage;
