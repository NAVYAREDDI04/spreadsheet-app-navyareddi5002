"use client"

import { useState } from "react"
import { documents } from "../data/documents"
import DocumentCard from "../components/DocumentCard"
import SearchBar from "../components/SearchBar"

export default function Dashboard() {

  const [search, setSearch] = useState("")

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-6">
        Document Dashboard
      </h1>

      <SearchBar search={search} setSearch={setSearch} />

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {filteredDocs.map(doc => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>

    </div>
  )
}