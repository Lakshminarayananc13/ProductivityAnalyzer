import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Avatar,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const NavBar = () => {
    const username = localStorage.getItem("username") || "User";
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        localStorage.removeItem("username");
        window.location.href = "/"; // Redirect to the login page
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <>
            {/* Set NavBar to fixed */}
            <AppBar position="fixed" sx={{ zIndex: 1201 }}> {/* Ensure it stays above other elements */}
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Task Manager
                    </Typography>
                    <Box>
                        <Avatar
                            sx={{ bgcolor: "#a3bf97", cursor: "pointer" }}
                            onClick={handleAvatarClick}
                        >
                            {username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer for navigation */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250, mt:7 }} role="presentation" onClick={toggleDrawer(false)}>
                    <List>
                        <ListItem button onClick={() => (window.location.href = "/tasks")}>
                            <ListItemText primary="Task List" />
                        </ListItem>
                        <ListItem button onClick={() => (window.location.href = "/add")}>
                            <ListItemText primary="Add Task" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default NavBar;