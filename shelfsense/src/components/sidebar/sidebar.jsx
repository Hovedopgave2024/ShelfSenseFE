import { useState, useEffect } from "react";
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

import { AddShoppingCartOutlined, InfoOutlined, InventoryOutlined, ExtensionOutlined, BarChartOutlined, AccountCircleOutlined, LogoutOutlined } from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { UserModal } from "./UserModal.jsx";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import useThemeStore from "../../stores/useThemeStore.js";
import useSidebarStore from "../../stores/useSidebarStore.js"; // Import the Sidebar store
import { logout } from "../../services/user/logout.js";
import ConfirmDialog from "../confirmDialog/ConfirmDialog.jsx";

export const drawerWidth = 180;
export const collapsedWidth = 60;

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const mode = useThemeStore((state) => state.mode);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    const { isOpen, toggleSidebar, activePage, setActivePage } = useSidebarStore();
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const userItem = { text: 'Profile', icon: <AccountCircleOutlined /> };

    const mainMenuItems = [
        { text: 'Statistics', icon: <BarChartOutlined />, path: '/statistics' },
        { text: 'Sales Orders', icon: <AddShoppingCartOutlined />, path: '/salesorders' },
        { text: 'Products', icon: <InventoryOutlined />, path: '/products' },
        { text: 'Components', icon: <ExtensionOutlined />, path: '/components' },
        { text: 'About', icon: <InfoOutlined />, path: '/about' },
    ];

    const logoutItem = { text: "Logout", icon: <LogoutOutlined /> };

    const handleCloseLogoutDialog = () => setLogoutDialogOpen(false);

    useEffect(() => {
        // Set active page based on current route
        setActivePage(location.pathname);
    }, [location.pathname, setActivePage]);

    const handleNavigation = (path) => {
        setActivePage(path); // Update the active page in the store
        navigate(path); // Navigate to the new page
    };

    const toggleUserModal = () => {
        setUserModalOpen((prev) => !prev);
    };

    const handleLogout = () => {
        setLogoutDialogOpen(true);
    }

    const confirmLogout = async () => {
        setLogoutDialogOpen(false);
        const response = await logout();
        if (!response) {
            return;
        }
        handleNavigation("/");
    };

    return (
        <>
            <Drawer
                variant="permanent"
                anchor="left"
                open={isOpen}
                sx={{
                    width: isOpen ? drawerWidth : collapsedWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isOpen ? drawerWidth : collapsedWidth,
                        transition: 'width 0.3s',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Box display="flex" justifyContent="center" p={1}>
                    <IconButton onClick={toggleSidebar}>
                        {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    <ListItem key={logoutItem.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton onClick={() => handleLogout()}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: isOpen ? 'initial' : 'center',
                                            mx: 1,
                                            borderRadius: 2,
                                        }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isOpen ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {logoutItem.icon}
                            </ListItemIcon>
                            <ListItemText primary={logoutItem.text} sx={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s' }} />
                        </ListItemButton>
                    </ListItem>
                    <ConfirmDialog
                        open={logoutDialogOpen}
                        onClose={handleCloseLogoutDialog}
                        headline="Confirm Logout"
                        text="Are you sure you want to logout of the platform?"
                        onAccept={confirmLogout}
                        onDecline={handleCloseLogoutDialog}
                        acceptText="Logout"
                        declineText="Cancel"
                    />
                </List>
                <Divider />
                <List>
                    <ListItem key={userItem.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton onClick={() => toggleUserModal()}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: isOpen ? 'initial' : 'center',
                                            mx: 1,
                                            borderRadius: 2,
                                        }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isOpen ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {userItem.icon}
                            </ListItemIcon>
                            <ListItemText primary={userItem.text} sx={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s' }} />
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
                                    selected={activePage === item.path} // Highlight active page
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: isOpen ? 'initial' : 'center',
                                        mx: 1,
                                        backgroundColor: activePage === item.path ? 'primary' : 'inherit', // Highlight active page
                                        borderRadius: 2, // Rounded corners for the button
                                        '&:hover': {
                                            backgroundColor: 'error',
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: isOpen ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: activePage === item.path ? '' : 'inherit',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} sx={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </>
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={toggleTheme}
                            sx={{
                                minHeight: 48,
                                justifyContent: isOpen ? 'initial' : 'center',
                                mx: 1,
                                borderRadius: 2,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isOpen ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                            </ListItemIcon>
                            {isOpen && <ListItemText primary="Dark Mode" sx={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s' }} />}
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
            <UserModal open={userModalOpen} onClose={toggleUserModal} />
        </>
    );
};