import Link from "next/link"

export default function Home() {
  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold">
        Collaborative Spreadsheet
      </h1>

      <Link href="/dashboard">
        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
          Open Dashboard
        </button>
      </Link>

    </div>
  )
}