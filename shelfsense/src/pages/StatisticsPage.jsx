import { Select, MenuItem, FormControl, InputLabel, Box, TextField} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar/sidebar.jsx";
import { fetchSalesOrders } from "../util/services/SalesOrdersService";
import { BarChart } from '@mui/x-charts';
import useComponentsStore from "../stores/useComponentsStore.js";
import useProductsStore from "../stores/useProductsStore.js";

const StatisticsPage = () => {

    const products = useProductsStore((state) => state.products);

    const components = useComponentsStore((state) => state.components);

    const [selectedProduct, setSelectedProduct] = useState('');

    const [open, setOpen] = useState(false);

    const [chartData, setChartData] = useState([]);

    const [startDate, setStartDate] = useState(null);

    const [endDate, setEndDate] = useState(null);

    const [salesOrders, setSalesOrders] = useState([]);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };



    useEffect(() => {
        const fetchData = async () => {
            const salesOrdersData = await fetchSalesOrders();
            setSalesOrders(salesOrdersData);
            // Calculate initial chart data with all products
            const monthlyEarnings = calculateMonthlyEarnings(salesOrdersData, '', null, null);
            setChartData(monthlyEarnings);
        };

        fetchData();
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        if (salesOrders.length > 0) {
            const monthlyEarnings = calculateMonthlyEarnings(
                salesOrders,
                selectedProduct,
                startDate,
                endDate
            );
            setChartData(monthlyEarnings);
        }
    }, [salesOrders, selectedProduct, startDate, endDate]);


    const calculateMonthlyEarnings = (data, selectedProduct, startDate, endDate) =>
    {
        const earningsByMonth = Array(12).fill(0); // Array for each month

        data.forEach((salesOrder) => {
            const date = new Date(salesOrder.createdDate);

            // Filter by selected product and date range if provided
            if (
                (selectedProduct === '' || salesOrder.productId === selectedProduct) &&
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

    const calculateMonthlyStockUsage = (
        salesOrders,
        products,
        components,
        selectedComponentId,
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
                        // If selectedComponentId is provided, filter on it
                        if (selectedComponentId === '' || pc.componentId === selectedComponentId) {
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


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex' }}>
                <Sidebar open={open} toggleDrawer={toggleDrawer} />
                <Box
                    sx={{
                        flexGrow: 1,
                        margin: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <FormControl sx={{ width: '200px', marginRight: 2 }}>
                            <InputLabel id="product-select-label">Product</InputLabel>
                            <Select
                                labelId="product-select-label"
                                id="product-select"
                                value={selectedProduct}
                                label="Product"
                                onChange={handleProductChange}
                            >
                                <MenuItem value="">All Products</MenuItem>
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params) => <TextField {...params} sx={{ marginRight: 2 }} />}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        <BarChart
                            xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                            series={[{ dataKey: 'revenue', label: 'Monthly Revenue' }]}
                            height={400}
                            dataset={chartData}
                            margin={{ left: 80 }}
                        />
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default StatisticsPage;
