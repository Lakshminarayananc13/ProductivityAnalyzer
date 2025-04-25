import React, { useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Box, InputAdornment, IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import { getUsers } from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Swal.fire("Error", "Please enter both username and password", "error");
      return;
    }
  
    try {
      const { data: users } = await getUsers();
      const user = users.find((u) => u.username === username && u.password === password);
  
      if (user) {
        localStorage.setItem("username", username);
        localStorage.setItem("sheetApiUrl", user.sheetApiUrl); // Store the user's Sheet API URL
        Swal.fire("Welcome!", `Hello ${username}`, "success").then(() => {
          window.location.href = "/tasks"; // Redirect to the task list page
        });
      } else {
        Swal.fire("Error", "Invalid username or password", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to authenticate. Please try again later.", "error");
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
          <Typography variant="h5" mb={3}>Login</Typography>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" fullWidth onClick={handleLogin}>Login</Button>
          <Box mt={2} textAlign="center">
            <Button onClick={() => (window.location.href = "/register")}>
              Don't have an account? Register
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;