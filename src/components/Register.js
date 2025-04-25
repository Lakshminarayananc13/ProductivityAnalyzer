import React, { useState } from "react";
import {
    Container, Paper, Typography, TextField, Button, Box, InputAdornment, IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import { getUsers, addUser } from "../api";
import { v4 as uuidv4 } from "uuid"; // Import uuid

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [sheetApiUrl, setSheetApiUrl] = useState(""); // State for Sheet API URL
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !password.trim() || !sheetApiUrl.trim()) {
            Swal.fire("Error", "Please fill in all fields", "error");
            return;
        }

        try {
            const { data: users } = await getUsers();
            const userExists = users.some((u) => u.username === username || u.email === email);

            if (userExists) {
                Swal.fire("Error", "Username or email already exists", "error");
                return;
            }

            const newUser = {
                id: uuidv4(), // Generate unique ID
                username,
                email,
                password,
                sheetApiUrl, // Include Sheet API URL
                created_at: new Date().toISOString(), // Use ISO string for consistency
            };

            await addUser(newUser);
            Swal.fire("Success!", "Account created successfully", "success").then(() => {
                window.location.href = "/"; // Redirect to the login page
            });
        } catch (error) {
            Swal.fire("Error", "Failed to register. Please try again later.", "error");
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
        >
            <Container maxWidth="sm">
                <Paper elevation={4} sx={{ p: 4, mt: 10 }}>
                    <Typography variant="h5" mb={3}>Register</Typography>
                    <TextField
                        label="Username"
                        fullWidth
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Sheet API URL"
                        fullWidth
                        variant="outlined"
                        value={sheetApiUrl}
                        onChange={(e) => setSheetApiUrl(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="Enter your Sheet API URL"
                    />
                    <Button variant="contained" fullWidth onClick={handleRegister}>Register</Button>
                    <Box mt={2} textAlign="center">
                        <Button onClick={() => (window.location.href = "/")}>
                            Already have an account? Login
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;