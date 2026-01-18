import { Project } from "@/types/project"
import axios from "axios"
import { useEffect, useState } from "react"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("/api/add-projects")
      .then(res => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false))
  }, [])

  return { projects, loading }
}
