"use client";

import type React from "react";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  type SelectChangeEvent,
} from "@mui/material";
import { type Task, TaskStatus, TaskPriority } from "@/lib/types";

interface TaskFormProps {
  onSubmitAction: (task: Task) => void;
  initialData?: Task | null;
  onCancelAction: () => void;
}

export default function TaskForm({
  onSubmitAction,
  initialData,
  onCancelAction,
}: TaskFormProps) {
  const [task, setTask] = useState<Task>({
    id: initialData?.id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || TaskStatus.Todo,
    priority: initialData?.priority || TaskPriority.Medium,
    category: initialData?.category || "Work",
    dueDate: initialData?.dueDate || "",
  });

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setTask({ ...task, [name]: value });
    }
  };

  const handleStatusChange = (e: SelectChangeEvent<TaskStatus>) => {
    setTask({ ...task, status: e.target.value as TaskStatus });
  };

  const handlePriorityChange = (e: SelectChangeEvent<TaskPriority>) => {
    setTask({ ...task, priority: e.target.value as TaskPriority });
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setTask({ ...task, category: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    onSubmitAction(task);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{initialData ? "Edit Task" : "Add New Task"}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={task.title}
                onChange={handleTextChange}
                required
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={task.description}
                onChange={handleTextChange}
                multiline
                rows={3}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={task.status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value={TaskStatus.Todo}>To Do</MenuItem>
                  <MenuItem value={TaskStatus.InProgress}>In Progress</MenuItem>
                  <MenuItem value={TaskStatus.Completed}>Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={task.priority}
                  onChange={handlePriorityChange}
                  label="Priority"
                >
                  <MenuItem value={TaskPriority.Low}>Low</MenuItem>
                  <MenuItem value={TaskPriority.Medium}>Medium</MenuItem>
                  <MenuItem value={TaskPriority.High}>High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={task.category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="Work">Work</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Study">Study</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={task.dueDate}
                onChange={handleTextChange}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelAction}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? "Update Task" : "Create Task"}
        </Button>
      </DialogActions>
    </form>
  );
}
