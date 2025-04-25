import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Divider,
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getTasks } from "../api";
import { Add } from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Automatically register Chart.js components
import Swal from "sweetalert2";
import { Delete } from "@mui/icons-material"; // Import the Delete icon
import { deleteTask } from "../api"; // Import the deleteTask API function

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [efficiencyFilter, setEfficiencyFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [efficiencyData, setEfficiencyData] = useState({});
  const [priorityData, setPriorityData] = useState({});

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data.data);
    setFilteredTasks(data.data); // Initially, show all tasks
    calculateInsights(data.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const calculateEfficiency = (deadline, submission) => {
    const d = new Date(deadline);
    const s = new Date(submission);
    const diff = (d - s) / (1000 * 60 * 60 * 24); // Difference in days

    if (diff > 0) return "Before Deadline"; // Completed before the deadline
    if (diff === 0) return "On Time"; // Completed exactly on the deadline
    return "Late"; // Completed after the deadline
  };

  const calculateInsights = (tasks) => {
    const efficiencyCounts = { "Before Deadline": 0, "On Time": 0, Late: 0 };
    const priorityCounts = { High: 0, Medium: 0, Low: 0 };

    tasks.forEach((task) => {
      const efficiency = calculateEfficiency(task.deadline, task.submission_date);
      efficiencyCounts[efficiency] += 1;

      if (task.priority in priorityCounts) {
        priorityCounts[task.priority] += 1;
      }
    });

    setEfficiencyData(efficiencyCounts);

    setPriorityData(priorityCounts);
  };

  const handleFilterChange = () => {
    let filtered = tasks;

    if (efficiencyFilter !== "All") {
      filtered = filtered.filter(
        (task) => calculateEfficiency(task.deadline, task.submission_date) === efficiencyFilter
      );
    }

    if (priorityFilter !== "All") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [efficiencyFilter, priorityFilter]);

  const efficiencyChartData = {
    labels: ["Before Deadline", "On Time", "Late"], // Labels for the chart
    datasets: [
      {
        label: "Task Efficiency", // Descriptive label for the dataset
        data: [efficiencyData["Before Deadline"], efficiencyData["On Time"], efficiencyData["Late"]],
        backgroundColor: ["#2196f3", "#4caf50", "#f44336"], // Blue, Green, Red
      },
    ],
  };

  const efficiencyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Show the legend
        position: "top", // Position the legend at the top
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
  };

  const priorityChartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        // label: "Task  Distribution",
        data: Object.values(priorityData),
        backgroundColor: ["#ff5722", "#ffc107", "#8bc34a"], // Colors for High, Medium, Low
      },
    ],
  };

  return (
    <Container maxWidth="lg">
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          position: "fixed", // Fix the position
          top: "64px", // Adjust this based on the height of your navbar
          left: 0,
          right: 0,
          zIndex: 1000, // Ensure it stays above other elements
          backgroundColor: "#fff", // Add a background color to avoid overlap
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add a shadow for better visibility
          padding: "16px", // Add padding for spacing
        }}
      >
        <Box>
          <Typography variant="h5">Your Tasks</Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => (window.location.href = "/add")}
        >
          Add Task
        </Button>
      </Box>

      {/* Filters Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          position: "fixed", // Fix the position
          top: "128px", // Place it below the header
          left: 0,
          right: 0,
          zIndex: 1000, // Ensure it stays above other elements
          backgroundColor: "#fff", // Add a background color to avoid overlap
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add a shadow for better visibility
          padding: "16px", // Add padding for spacing
        }}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Efficiency</InputLabel>
          <Select
            value={efficiencyFilter}
            onChange={(e) => setEfficiencyFilter(e.target.value)}
            label="Filter by Efficiency"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Before Deadline">Before Deadline</MenuItem>
            <MenuItem value="On Time">On Time</MenuItem>
            <MenuItem value="Late">Late</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Priority</InputLabel>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            label="Filter by Priority"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setEfficiencyFilter("All");
            setPriorityFilter("All");
          }}
        >
          Reset Filters
        </Button>
      </Box>


      {/* Main Content */}
      <Box>
        {/* Charts Container */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 33 }}>
          <Typography variant="h6" fontWeight={"bold"} gutterBottom>
            Task Insights
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ gap: 2 }}>
            {/* Efficiency Bar Chart */}
            <Box sx={{ flex: 1, maxWidth: "50%" }}>
              <Typography variant="subtitle1" fontWeight={"bold"} gutterBottom>
                Task Efficiency
              </Typography>
              <Bar data={efficiencyChartData} options={efficiencyChartOptions} />
            </Box>

            {/* Priority Pie Chart */}
            <Box sx={{ flex: 1, maxWidth: "50%", textAlign: "center" }}>
              <Typography variant="subtitle1" fontWeight={"bold"} gutterBottom>
                Task Priority Distribution
              </Typography>
              <Box sx={{ width: 250, height: 250, margin: "auto" }}>
                <Pie
                  data={priorityChartData}
                  options={{
                    maintainAspectRatio: false, // Allow resizing
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>



        {/* Task List */}
        {filteredTasks.length ? (
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Task List
            </Typography>
            <Box
              sx={{
                maxHeight: "550px", // Set a fixed height (adjust as needed)
                overflowY: "auto", // Enable vertical scrolling
              }}
            >
              <List>
                {filteredTasks.map((task, i) => (
                  <React.Fragment key={i}>
                    <ListItem
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.02)",
                          backgroundColor: "#f1f8e9",
                        },
                      }}
                    >
                      {/* Task Icon */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          backgroundColor:
                            task.priority === "High"
                              ? "#ff5722"
                              : task.priority === "Medium"
                                ? "#ffc107"
                                : "#8bc34a",
                          color: "#fff",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        {task.priority[0]} {/* First letter of priority */}
                      </Box>

                      {/* Task Details */}
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#37474f" }}>
                            {task.task_name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                              {/* First Row: Description, Deadline, Submitted */}
                              <Grid item xs={6}>
                                <Typography component="span" sx={{ color: "#757575", fontWeight: "bold" }}>
                                  <strong>Description:</strong>
                                </Typography>
                                <Typography component="span" sx={{ color: "#616161", ml: 1 }}>
                                  {task.description}
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <Typography component="span" sx={{ color: "#757575", fontWeight: "bold" }}>
                                  <strong>Deadline:</strong>
                                </Typography>
                                <Typography component="span" sx={{ color: "#616161", ml: 1 }}>
                                  {task.deadline}
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <Typography component="span" sx={{ color: "#757575", fontWeight: "bold" }}>
                                  <strong>Submitted:</strong>
                                </Typography>
                                <Typography component="span" sx={{ color: "#616161", ml: 1 }}>
                                  {task.submission_date}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                              {/* Second Row: Priority, Efficiency */}
                              <Grid item xs={6}>
                                <Typography component="span" sx={{ color: "#757575", fontWeight: "bold" }}>
                                  <strong>Priority:</strong>
                                </Typography>
                                <Typography
                                  component="span"
                                  sx={{
                                    color:
                                      task.priority === "High"
                                        ? "#d32f2f"
                                        : task.priority === "Medium"
                                          ? "#fbc02d"
                                          : "#388e3c",
                                    fontWeight: "bold",
                                    ml: 1,
                                  }}
                                >
                                  {task.priority}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography component="span" sx={{ color: "#757575", fontWeight: "bold" }}>
                                  <strong>Efficiency:</strong>
                                </Typography>
                                <Typography
                                  component="span"
                                  sx={{
                                    color:
                                      calculateEfficiency(task.deadline, task.submission_date) ===
                                        "Before Deadline"
                                        ? "#2196f3"
                                        : calculateEfficiency(task.deadline, task.submission_date) ===
                                          "On Time"
                                          ? "#4caf50"
                                          : "#f44336",
                                    fontWeight: "bold",
                                    ml: 1,
                                  }}
                                >
                                  {calculateEfficiency(task.deadline, task.submission_date)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        }
                      />

                      {/* Delete Icon */}
                      <IconButton
                        color="error"
                        onClick={async () => {
                          const confirm = window.confirm(
                            `Are you sure you want to delete the task "${task.task_name}"?`
                          );
                          if (confirm) {
                            try {
                              await deleteTask(task.task_name); // Call the deleteTask API
                              Swal.fire("Deleted!", "The task has been deleted.", "success");
                              fetchTasks(); // Refresh the task list
                            } catch (error) {
                              Swal.fire("Error", "Failed to delete the task. Please try again.", "error");
                            }
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              No Tasks Found
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Add some tasks to get started!
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default TaskList;