"use client"

import { useEffect, useRef } from "react"
import { Box, Typography, CircularProgress, Divider, Grid } from "@mui/material"
import { type Task, TaskStatus } from "@/lib/types"

interface TaskStatsProps {
  tasks: Task[]
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const categories = [...new Set(tasks.map((task) => task.category))]
    const categoryData = categories.map((category) => {
      const categoryTasks = tasks.filter((task) => task.category === category)
      const completed = categoryTasks.filter((task) => task.status === TaskStatus.Completed).length
      const total = categoryTasks.length
      return {
        category,
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      }
    })

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const barWidth = (canvasRef.current.width - 40) / categories.length
    const maxBarHeight = canvasRef.current.height - 60

    const colors = [
      "rgba(25, 118, 210, 0.8)", // primary blue
      "rgba(56, 142, 60, 0.8)", // green
      "rgba(245, 124, 0, 0.8)", // orange
      "rgba(156, 39, 176, 0.8)", // purple
      "rgba(211, 47, 47, 0.8)", // red
      "rgba(0, 151, 167, 0.8)", // teal
    ]

    categoryData.forEach((data, index) => {
      const x = 20 + index * barWidth
      const barHeight = (data.percentage / 100) * maxBarHeight
      const y = canvasRef.current!.height - 40 - barHeight

      ctx.fillStyle = colors[index % colors.length]
      ctx.fillRect(x, y, barWidth - 10, barHeight)

      ctx.fillStyle = "#757575" // text-gray-500
      ctx.font = "12px Roboto"
      ctx.textAlign = "center"
      ctx.fillText(data.category, x + (barWidth - 10) / 2, canvasRef.current!.height - 20)

      ctx.fillStyle = "#212121" // text-gray-800
      ctx.font = "bold 12px Roboto"
      ctx.textAlign = "center"
      ctx.fillText(`${Math.round(data.percentage)}%`, x + (barWidth - 10) / 2, y - 5)
    })
  }, [tasks])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === TaskStatus.Completed).length
  const inProgressTasks = tasks.filter((task) => task.status === TaskStatus.InProgress).length
  const todoTasks = tasks.filter((task) => task.status === TaskStatus.Todo).length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress variant="determinate" value={completionRate} size={80} thickness={4} color="primary" />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" component="div" color="text.secondary">
              {`${completionRate}%`}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Overall completion rate
        </Typography>
      </Box>

      <Box sx={{ height: 200, width: "100%", mb: 3 }}>
        <canvas ref={canvasRef} width={300} height={200} style={{ width: "100%", height: "100%" }}></canvas>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} textAlign="center">
        <Grid size={{xs:4}}>
          <Typography variant="body2" color="text.secondary">
            To Do
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {todoTasks}
          </Typography>
        </Grid>
        <Grid size={{xs:4}}>
          <Typography variant="body2" color="text.secondary">
            In Progress
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {inProgressTasks}
          </Typography>
        </Grid>
        <Grid size={{xs:4}}>
          <Typography variant="body2" color="text.secondary">
            Completed
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {completedTasks}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

