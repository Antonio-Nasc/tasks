"use client"

import type React from "react"

import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  type SelectChangeEvent,
  Stack,
  Divider,
  ChipProps,
} from "@mui/material"
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { useState } from "react"
import { type Task, TaskStatus, TaskPriority } from "@/lib/types"

interface TaskListProps {
  tasks: Task[]
  onEditAction: (task: Task) => void
  onDeleteAction: (id: string) => void
  onStatusChangeAction: (id: string, status: TaskStatus) => void
}
type ChipColor = ChipProps["color"]
export default function TaskList({ tasks, onEditAction, onDeleteAction, onStatusChangeAction }: TaskListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedTaskId(taskId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTaskId(null)
  }

  const handleEdit = () => {
    const task = tasks.find((t) => t.id === selectedTaskId)
    if (task) {
      onEditAction(task)
    }
    handleMenuClose()
  }

  const handleDelete = () => {
    if (selectedTaskId) {
      onDeleteAction(selectedTaskId)
    }
    handleMenuClose()
  }

  const handleStatusChange = (event: SelectChangeEvent, taskId: string) => {
    onStatusChangeAction(taskId, event.target.value as TaskStatus)
  }

  const getPriorityColor = (priority: TaskPriority): { color: ChipColor; bgcolor: string } => {
    switch (priority) {
      case TaskPriority.High:
        return { color: "error", bgcolor: "error.light" }
      case TaskPriority.Medium:
        return { color: "warning", bgcolor: "warning.light" }
      case TaskPriority.Low:
        return { color: "success", bgcolor: "success.light" }
      default:
        return { color: "default", bgcolor: "grey.300" }
    }
  }
  
  const getStatusColor = (status: TaskStatus): { color: ChipColor; bgcolor: string } => {
    switch (status) {
      case TaskStatus.Completed:
        return { color: "success", bgcolor: "success.light" }
      case TaskStatus.InProgress:
        return { color: "info", bgcolor: "info.light" }
      case TaskStatus.Todo:
        return { color: "default", bgcolor: "grey.300" }
      default:
        return { color: "default", bgcolor: "grey.300" }
    }
  }

  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
          border: "1px dashed grey.300",
          borderRadius: 1,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">No tasks found</Typography>
          <Typography variant="body2" color="textSecondary">
            Get started by creating a new task.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      {tasks.map((task) => (
        <Paper key={task.id} elevation={1} sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {task.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label={task.priority}
                  size="small"
                 color={getPriorityColor(task.priority).color}
                  sx={{ bgcolor: getPriorityColor(task.priority).bgcolor }}
                />
                <Chip
                  label={task.status}
                  size="small"
                  color={getStatusColor(task.status).color}
                  sx={{ bgcolor: getStatusColor(task.status).bgcolor }}
                />
                <Chip label={task.category} size="small" variant="outlined" />
                {task.dueDate && (
                  <Chip label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`} size="small" variant="outlined" />
                )}
              </Stack>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", ml: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                <Select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e as SelectChangeEvent, task.id)}
                  displayEmpty
                  variant="outlined"
                >
                  <MenuItem value={TaskStatus.Todo}>To Do</MenuItem>
                  <MenuItem value={TaskStatus.InProgress}>In Progress</MenuItem>
                  <MenuItem value={TaskStatus.Completed}>Completed</MenuItem>
                </Select>
              </FormControl>
              <IconButton aria-label="more" onClick={(e) => handleMenuOpen(e, task.id)} size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      ))}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  )
}

