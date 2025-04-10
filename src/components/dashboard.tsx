"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
} from "@mui/material"
import {
  Add as AddIcon,
} from "@mui/icons-material"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import TaskStats from "@/components/task-stats"
import { type Task, TaskStatus } from "@/lib/types"
import { axiosInstance } from "@/services/TaskService"
import { Header } from "./ui/header"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `task-tab-${index}`,
    "aria-controls": `task-tabpanel-${index}`,
  }
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const resp = await axiosInstance.get('Tasks');
        if (resp) {
          setTasks(resp.data);
        }
      } catch {
        
      }
    };

    fetchTasks();
  }, []);

  const addTask = (task: Task) => {
    setTasks([...tasks, { ...task, id: Date.now().toString() }])
    setIsFormOpen(false)
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
    setIsFormOpen(false)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const completedTasksCount = tasks.filter((task) => task.status === TaskStatus.Completed).length
  const completionRate = tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0
  const inProgressTasksCount = tasks.filter((task) => task.status === TaskStatus.InProgress).length
  const todoTasksCount = tasks.filter((task) => task.status === TaskStatus.Todo).length

  const drawerWidth = 240

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        <Grid container spacing={3}>
          <Grid size={{xs:12, sm:6, md:3}} >
            <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h4" component="div">
                {tasks.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid  size={{xs:12, sm:6, md:3}}>
            <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" component="div">
                {completedTasksCount}
              </Typography>
              <Box sx={{ width: "100%", mt: 1 }}>
                <LinearProgress variant="determinate" value={completionRate} />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{xs:12, sm:6, md:3}}>
            <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4" component="div">
                {inProgressTasksCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {inProgressTasksCount} tasks currently active
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs:12, sm:6, md:3}}>
            <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" component="div">
                {todoTasksCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {todoTasksCount} tasks waiting
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{xs:12, lg:9, md:8}}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <div>
                  <Typography variant="h6" component="h2">
                    Tasks
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Manage your tasks and track progress
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingTask(null)
                    setIsFormOpen(true)
                  }}
                >
                  Add Task
                </Button>
              </Box>

              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="task tabs">
                  <Tab label="All Tasks" {...a11yProps(0)} />
                  <Tab label="To Do" {...a11yProps(1)} />
                  <Tab label="In Progress" {...a11yProps(2)} />
                  <Tab label="Completed" {...a11yProps(3)} />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <TaskList
                  tasks={tasks}
                  onEditAction={handleEditTask}
                  onDeleteAction={deleteTask}
                  onStatusChangeAction={(id, status) => {
                    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)))
                  }}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TaskList
                  tasks={tasks.filter((task) => task.status === TaskStatus.Todo)}
                  onEditAction={handleEditTask}
                  onDeleteAction={deleteTask}
                  onStatusChangeAction={(id, status) => {
                    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)))
                  }}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <TaskList
                  tasks={tasks.filter((task) => task.status === TaskStatus.InProgress)}
                  onEditAction={handleEditTask}
                  onDeleteAction={deleteTask}
                  onStatusChangeAction={(id, status) => {
                    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)))
                  }}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <TaskList
                  tasks={tasks.filter((task) => task.status === TaskStatus.Completed)}
                  onEditAction={handleEditTask}
                  onDeleteAction={deleteTask}
                  onStatusChangeAction={(id, status) => {
                    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)))
                  }}
                />
              </TabPanel>
            </Paper>
          </Grid>

          <Grid size={{xs:12, lg:3, md:4}}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Task Statistics
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Task completion by category
              </Typography>
              <TaskStats tasks={tasks} />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingTask(null)
        }}
        fullWidth
        maxWidth="sm"
      >
        <TaskForm
          onSubmitAction={editingTask ? updateTask : addTask}
          initialData={editingTask}
          onCancelAction={() => {
            setIsFormOpen(false)
            setEditingTask(null)
          }}
        />
      </Dialog>
    </Box>
  )
}

