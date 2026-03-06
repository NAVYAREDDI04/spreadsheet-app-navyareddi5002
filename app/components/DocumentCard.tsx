import Link from "next/link"
import { DocumentItem } from "../data/documents"

interface Props {
  doc: DocumentItem
}

export default function DocumentCard({ doc }: Props) {
  return (
    <Link href={`/dashboard/${doc.id}`}>
      <div className="p-5 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer bg-white border">
        
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-md ${doc.color}`} />

          <div>
            <h3 className="font-semibold text-lg">{doc.title}</h3>
            <p className="text-sm text-gray-500">
              {doc.author}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Last modified: {doc.lastModified}
        </p>

      </div>
    </Link>
  )
}