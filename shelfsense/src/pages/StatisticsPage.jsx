import {  Box, TextField, Autocomplete, Card, CardContent, Typography} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar/sidebar.jsx";
import { calculateMonthlyStockUsage, calculateMonthlyEarnings } from "../util/services/SalesOrdersService";
import { BarChart, LineChart } from '@mui/x-charts';
import useComponentsStore from "../stores/useComponentsStore.js";
import useProductsStore from "../stores/useProductsStore.js";
import useSalesOrdersStore from "../stores/useSalesOrdersStore.js";

const StatisticsPage = () => {

    const products = useProductsStore((state) => state.products);

    const components = useComponentsStore((state) => state.components);

    const salesOrdersData= useSalesOrdersStore((state) => state.salesOrders);


    const [selectedProducts, setSelectedProducts] = useState([]);

    const [open, setOpen] = useState(false);

    const [chartData, setChartData] = useState([]);

    const [startDate, setStartDate] = useState(null);

    const [endDate, setEndDate] = useState(null);

    const [salesOrders, setSalesOrders] = useState([]);

    const [selectedComponents, setSelectedComponents] = useState([]);

    const [stockUsageData, setStockUsageData] = useState([]);

    const [totalRevenue, setTotalRevenue] = useState(0);



    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleProductChange = (event, newValue) => {
        setSelectedProducts(newValue);
    };

    const handleComponentChange = (event, newValue) => {
        setSelectedComponents(newValue);
    };



    useEffect(() => {
        const fetchData = async () => {
            setSalesOrders(salesOrdersData);
            // Calculate initial chart data with all products and components
            const monthlyEarnings = calculateMonthlyEarnings(
                salesOrdersData,
                [],
                null,
                null
            );
            setChartData(monthlyEarnings);

            const monthlyStockUsage = calculateMonthlyStockUsage(
                salesOrdersData,
                products,
                components,
                [],
                null,
                null
            );
            setStockUsageData(monthlyStockUsage);

            // Calculate total yearly revenue
            const total = salesOrdersData.reduce((accumulator, salesOrder) => {
                const date = new Date(salesOrder.createdDate);
                const currentYear = new Date().getFullYear();
                if (date.getFullYear() === currentYear) {
                    return accumulator + salesOrder.price * salesOrder.quantity;
                }
                return accumulator;
            }, 0);
            setTotalRevenue(total);
        };

        fetchData();
    }, [products, components]);


    useEffect(() => {
        if (salesOrders.length > 0) {
            const monthlyEarnings = calculateMonthlyEarnings(
                salesOrders,
                selectedProducts,
                startDate,
                endDate
            );
            setChartData(monthlyEarnings);

            const monthlyStockUsage = calculateMonthlyStockUsage(
                salesOrders,
                products,
                components,
                selectedComponents,
                startDate,
                endDate
            );
            setStockUsageData(monthlyStockUsage);
        }
    }, [salesOrders, selectedProducts, selectedComponents, startDate, endDate]);

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
                    {/* Cards Container */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Card sx={{ width: '30%' }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Total Yearly Revenue
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    ${totalRevenue.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ width: '30%' }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Total Products
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {products.length}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ width: '30%' }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Total Components
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {components.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Filters */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <Autocomplete
                            multiple
                            options={products}
                            getOptionLabel={(option) => option.name}
                            value={selectedProducts}
                            onChange={handleProductChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Products" placeholder="Select products" />
                            )}
                            sx={{ width: 300, marginRight: 2 }}
                        />
                        <Autocomplete
                            multiple
                            options={components}
                            getOptionLabel={(option) => option.name}
                            value={selectedComponents}
                            onChange={handleComponentChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Components" placeholder="Select components" />
                            )}
                            sx={{ width: 300, marginRight: 2 }}
                        />
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} sx={{ marginRight: 2 }} />
                            )}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Box>

                    {/* Charts */}
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
                    <Box
                        sx={{
                            flexGrow: 1,
                            marginTop: 4,
                        }}
                    >
                        <LineChart
                            xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                            series={[{ dataKey: 'usage', label: 'Monthly Stock Usage' }]}
                            height={400}
                            dataset={stockUsageData}
                            margin={{ left: 80 }}
                        />
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default StatisticsPage;
