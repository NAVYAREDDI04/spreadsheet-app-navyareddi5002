export interface DocumentItem {
  id: string
  title: string
  author: string
  lastModified: string
  color: string
}

export const documents: DocumentItem[] = [
  {
    id: "budget",
    title: "Budget Sheet",
    author: "Alice",
    lastModified: "2 hours ago",
    color: "bg-blue-500"
  },
  {
    id: "sales",
    title: "Sales Report",
    author: "Bob",
    lastModified: "Yesterday",
    color: "bg-green-500"
  },
  {
    id: "marketing",
    title: "Marketing Plan",
    author: "Emma",
    lastModified: "3 days ago",
    color: "bg-purple-500"
  }
]