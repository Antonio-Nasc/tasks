export enum TaskStatus {
    Todo = "To Do",
    InProgress = "In Progress",
    Completed = "Completed",
  }
  
  export enum TaskPriority {
    Low = "Low",
    Medium = "Medium",
    High = "High",
  }
  
  export interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    category: string
    dueDate: string
  }
  
  