// Sidebar.js
import { useState } from "react";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import ComponentOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { useNavigate } from 'react-router-dom';
import {UserModal} from "./UserModal.jsx";

export const drawerWidth = 180;
export const collapsedWidth = 60;

export const Sidebar = ({ open, toggleDrawer }) => {
    const navigate = useNavigate();
    const [userModalOpen, setUserModalOpen] = useState(false);

    const userItem = { text: 'Profile', icon: <AccountCircleOutlinedIcon/> }

    const mainMenuItems = [
        { text: 'Statistics', icon: <BarChartOutlinedIcon />, path: '/statistics' },
        { text: 'Products', icon: <InventoryOutlinedIcon />, path: '/products' },
        { text: 'Components', icon: <ComponentOutlinedIcon />, path: '/components' },
    ];

    const subMenuItems = [
        { text: 'About', icon: <InfoOutlinedIcon />, path: '/about' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const toggleUserModal = () => {
        setUserModalOpen((prev) => !prev);
    };


    return (
        <>
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
                    <ListItem key={userItem.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton onClick={() => toggleUserModal()}
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
                                {userItem.icon}
                            </ListItemIcon>
                            <ListItemText primary={userItem.text} sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s' }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <>
                        {mainMenuItems.map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
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
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </>
                </List>
                <Divider />
                <List>
                    <>
                        {subMenuItems.map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
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
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </>
                </List>
            </Drawer>
            <UserModal open={userModalOpen} onClose={toggleUserModal} />
        </>
    );
};