import React, { useState } from "react";
import { TextField, Button, MenuItem, Paper, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";
import { ArrowBack } from "@mui/icons-material";
import { addTask } from "../api"; // Import the addTask function from your API file

const AddTask = () => {
  const [task, setTask] = useState({
    task_name: "",
    description: "",
    deadline: "",
    priority: "",
    submission_date: "",
  });

  const handleChange = (field) => (e) => {
    setTask({ ...task, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation: Check if required fields are filled
    if (
      !task.task_name.trim() ||
      !task.description.trim() ||
      !task.deadline.trim() ||
      !task.priority.trim() ||
      !task.submission_date.trim()
    ) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    try {
      await addTask(task);

      Swal.fire("Success!", "Task added successfully", "success").then(() => {
        window.location.href = "/tasks"; // Redirect to the Task List page
      });
    } catch (error) {
      Swal.fire("Error", "Failed to add task. Please try again later.", "error");
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />} // Add the left arrow icon
        onClick={() => (window.location.href = "/tasks")} // Back button
        sx={{ mt: 10, ml: 2, mb: 2, color: "#a3bf97", borderColor: "#a3bf97" }}
      >
        Back
      </Button>
      <Paper elevation={3} sx={{ maxWidth: 500, margin: "auto", mt: 15, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>Add New Task</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Task Name"
            fullWidth
            required
            onChange={handleChange("task_name")}
          />
          <TextField
            label="Description"
            fullWidth
            required
            onChange={handleChange("description")}
          />
          <TextField
            label="Deadline"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            onChange={handleChange("deadline")}
          />
          <TextField
            label="Priority"
            select
            fullWidth
            required
            value={task.priority}
            onChange={handleChange("priority")}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>
          <TextField
            label="Submission Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            onChange={handleChange("submission_date")}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default AddTask;