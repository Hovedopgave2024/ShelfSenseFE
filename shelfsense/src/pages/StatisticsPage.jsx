import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
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

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };

    const [salesOrders, setSalesOrders] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const salesOrdersData = await fetchSalesOrders();
            setSalesOrders(salesOrdersData);
            // Calculate initial chart data with all products
            const monthlyEarnings = calculateMonthlyEarnings(salesOrdersData, '');
            setChartData(monthlyEarnings);
        };

        fetchData();
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        if (salesOrders.length > 0) {
            const monthlyEarnings = calculateMonthlyEarnings(salesOrders, selectedProduct);
            setChartData(monthlyEarnings);
        }
    }, [salesOrders, selectedProduct]);


    const calculateMonthlyEarnings = (data, selectedProduct) => {
        const earningsByMonth = Array(12).fill(0); // Array for each month

        data.forEach((salesOrder) => {
            // Filter by selected product if one is selected
            if (selectedProduct === '' || salesOrder.productId === selectedProduct) {
                const date = new Date(salesOrder.createdDate);
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

    return (
        <Box>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box sx={{ margin: 4 }}>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="product-select-label">Product</InputLabel>
                    <Select
                        labelId="product-select-label"
                        id="product-select"
                        value={selectedProduct}
                        label="Product"
                        onChange={handleProductChange}
                    >
                        <MenuItem value=''>All Products</MenuItem>
                        {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <BarChart
                    xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                    series={[{ dataKey: 'revenue', label: 'Monthly Revenue' }]}
                    height={400}
                    dataset={chartData}
                />
            </Box>
        </Box>
    );

};

export default StatisticsPage;
