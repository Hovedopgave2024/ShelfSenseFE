import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { fetchProducts } from '../../services/productService';
import ProductsCard from "./ProductsCard";

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 180;
const collapsedWidth = 60;

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const productsData = await fetchProducts();
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await loadProducts();
        })();
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                anchor="left"
                open={open}
                sx={{
                    width: open ? drawerWidth : collapsedWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : collapsedWidth,
                        transition: 'width 0.3s',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Box display="flex" justifyContent="center" p={1}>
                    <IconButton onClick={toggleDrawer}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    <>
                        {['Dashboard', 'Products', 'Components', 'Stastistics'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </>
                </List>
                <Divider />
                <List>
                    <>
                        {['Contact', 'About'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </>
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginLeft: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
                    transition: 'margin-left 0.3s',
                }}
            >
                <Grid container spacing={2}>
                    {loading ? (
                        <>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Stack spacing={1}>
                                        <Skeleton animation="wave" variant="rectangular" width={210} height={120} />
                                        <Skeleton variant="text" width={120} />
                                        <Skeleton variant="circular" width={30} height={30} />
                                    </Stack>
                                </Grid>
                            ))}
                        </>
                    ) : (
                        products.map((product) => (
                            <Grid item xs={12} md={6} lg={3} key={product.id}>
                                <ProductsCard product={product} />
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default ProductsList;