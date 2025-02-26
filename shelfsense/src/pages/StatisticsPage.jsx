import {Box, TextField, Autocomplete, Card, CardContent, Typography, Button} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar/sidebar.jsx";
import { calculateMonthlyEarnings } from "../util/salesOrder/calculateMonthlyEarnings.js";
import { calculateMonthlyStockUsage } from "../util/salesOrder/calculateMonthlyStockUsage.js";
import {BarChart, LineChart, PieChart} from '@mui/x-charts';
import useComponentsStore from "../stores/useComponentsStore.js";
import useProductsStore from "../stores/useProductsStore.js";
import useSalesOrdersStore from "../stores/useSalesOrdersStore.js";
import {calculateProductUsage} from "../util/salesOrder/calculateProductUsage.js";

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

    const [pieData, setPiaData] = useState([]);


    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    /* const handleProductChange = (event, newValue) => {
        setSelectedProducts(newValue);
    }; */

    const handleComponentChange = (event, newValue) => {
        setSelectedComponents(newValue);
    };



    useEffect(() => {
        const fetchData = async () => {
            setSalesOrders(salesOrdersData);

            const productUsage = calculateProductUsage(
                salesOrdersData,
                null,
                null,
                products
            )
            setPiaData(productUsage);

            // Calculate initial chart data with all products and components
            const monthlyEarnings = calculateMonthlyEarnings(
                salesOrdersData,
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
            let total = 0;
            salesOrdersData.forEach((salesOrder) => {
                const date = new Date(salesOrder.createdDate);
                const currentYear = new Date().getFullYear();

                if (date.getFullYear() === currentYear) {
                    total += salesOrder.price
                }
            });
            setTotalRevenue(total);
        };

        fetchData();
    }, [products, components]);


    useEffect(() => {
        if (salesOrders.length > 0) {
            const monthlyEarnings = calculateMonthlyEarnings(
                salesOrders,
                startDate,
                endDate
            );
            setChartData(monthlyEarnings);

            const productUsage = calculateProductUsage(
                salesOrdersData,
                startDate,
                endDate,
                products
            )
            setPiaData(productUsage);

            console.log(pieData)

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
                        <Card sx={{ width: '30%', borderRadius: "20px 0 0 20px" }}>
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
                        <Card sx={{ width: '30%', borderRadius: "0 20px 20px 0" }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>

                        {/* Left Side (Bigger & Centered Date Pickers) */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',  // Center Date Pickers
                            gap: 3,  // Add more spacing
                            width: '50%'
                        }}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={setStartDate}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            fontSize: '1.5rem',  // Bigger text
                                            width: '90%',  // Increase width
                                            backgroundColor: 'white',
                                            '& .MuiOutlinedInput-root': {
                                                height: '70px',  // Make input taller
                                                fontSize: '1.3rem',  // Bigger input text
                                                borderRadius: '12px', // Rounded corners
                                            },
                                        }}
                                    />
                                )}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={setEndDate}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            fontSize: '1.5rem',
                                            width: '90%',
                                            backgroundColor: 'white',
                                            '& .MuiOutlinedInput-root': {
                                                height: '70px',
                                                fontSize: '1.3rem',
                                                borderRadius: '12px',
                                            },
                                        }}
                                    />
                                )}
                            />
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                    setStartDate(null);
                                    setEndDate(null);
                                }}
                                sx={{
                                    width: '39%',
                                    height: '40px',
                                    fontSize: '1rem',
                                }}
                            >
                                Clear Dates
                            </Button>
                        </Box>

                        {/* Right Side (Pie Chart) */}
                        <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Headline */}
                            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', mr: 10 }}>
                                Yearly Product Usage
                            </Typography>

                            {/* Pie Chart */}
                            <PieChart
                                series={[
                                    {
                                        data: pieData,
                                        innerRadius: 5,
                                        outerRadius: 150,
                                        paddingAngle: 1,
                                        cornerRadius: 6,
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    },
                                ]}
                                height={300}
                            />
                        </Box>
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
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                        </Box>

                        <Box
                            sx={{
                                flexGrow: 1,
                                marginTop: 4,
                            }}
                        >
                            <LineChart
                                xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                                series={[
                                    { dataKey: 'componentUsage', label: 'Monthly Component Usage', color: '#1976d2' }, // Blue
                                    { dataKey: 'productUsage', label: 'Monthly Product Usage', color: '#d32f2f' }, // Red
                                ]}
                                height={400}
                                dataset={stockUsageData}
                                margin={{ left: 80 }}
                            />

                        </Box>
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default StatisticsPage;
