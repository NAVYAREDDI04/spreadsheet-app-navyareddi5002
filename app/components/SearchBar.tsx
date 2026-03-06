interface Props {
  search: string
  setSearch: (value: string) => void
}

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <input
      type="text"
      placeholder="Search documents..."
      className="w-full p-3 border rounded-lg mb-6"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  )
}