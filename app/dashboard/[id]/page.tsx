"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, setDoc } from "firebase/firestore"

export default function Editor() {

  const params = useParams<{ id: string }>()
  const id = params?.id || ""

  const rows = 12
  const columns = ["A","B","C","D","E","F"]

  const [cells,setCells] = useState<Record<string,string>>({})
  const [saving,setSaving] = useState(false)

  useEffect(() => {

    if(!id) return

    const ref = doc(db,"documents",id)

    const unsub = onSnapshot(ref,(snapshot)=>{
      const data = snapshot.data()
      if(data?.cells){
        setCells(data.cells)
      }
    })

    return () => unsub()

  },[id])

  async function handleChange(cellId:string,value:string){

    const updated={
      ...cells,
      [cellId]:value
    }

    setCells(updated)

    if(!id) return

    const ref = doc(db,"documents",id)

    setSaving(true)
    await setDoc(ref,{cells:updated})
    setSaving(false)
  }

  function getCellValue(id:string){
    return Number(cells[id]) || 0
  }

  function evaluateFormula(value:string){

    if(!value || !value.startsWith("=")) return value

    
    if(value.startsWith("=SUM(")){

      const range = value.slice(5,-1)

      if(!range.includes(":")) return "ERR"

      const parts = range.split(":")
      const start = parts[0]
      const end = parts[1]

      if(!start || !end) return "ERR"

      const col = start.charAt(0)

      const startRow = parseInt(start.substring(1))
      const endRow = parseInt(end.substring(1))

      if(isNaN(startRow) || isNaN(endRow)) return "ERR"

      let sum = 0

      for(let i=startRow;i<=endRow;i++){
        sum += getCellValue(col+i)
      }

      return String(sum)
    }

    
    if(value.startsWith("=AVG(")){

      const range = value.slice(5,-1)

      if(!range.includes(":")) return "ERR"

      const parts = range.split(":")
      const start = parts[0]
      const end = parts[1]

      if(!start || !end) return "ERR"

      const col = start.charAt(0)

      const startRow = parseInt(start.substring(1))
      const endRow = parseInt(end.substring(1))

      if(isNaN(startRow) || isNaN(endRow)) return "ERR"

      let sum = 0
      let count = 0

      for(let i=startRow;i<=endRow;i++){
        sum += getCellValue(col+i)
        count++
      }

      return count ? String(sum/count) : "0"
    }

    
    try{

      let expr = value.substring(1)

      columns.forEach(col=>{
        for(let r=1;r<=rows;r++){
          const key = col+r
          expr = expr.replaceAll(key,String(getCellValue(key)))
        }
      })

      return String(Function("return "+expr)())

    }catch{
      return "ERR"
    }
  }

  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-2">
        Document : {id}
      </h1>

      <div className="text-sm text-gray-500 mb-6">
        {saving ? "Saving..." : "Saved"}
      </div>

      <div className="overflow-auto border rounded">

        <table className="border-collapse">

          <thead>
            <tr>
              <th className="border p-2 bg-gray-200"></th>

              {columns.map(col=>(
                <th
                  key={col}
                  className="border p-2 bg-gray-200 w-28"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {Array.from({length:rows}).map((_,r)=>{

              const row=r+1

              return(

                <tr key={row}>

                  <td className="border bg-gray-100 text-center w-10">
                    {row}
                  </td>

                  {columns.map(col=>{

                    const cellId=col+row
                    const rawValue=cells[cellId] || ""

                    const displayValue=
                      rawValue.startsWith("=")
                        ? evaluateFormula(rawValue)
                        : rawValue

                    return(

                      <td key={cellId} className="border">

                        <input
                          id={cellId}
                          name={cellId}
                          className="w-full p-1 outline-none"
                          value={rawValue}
                          onChange={(e)=>
                            handleChange(cellId,e.target.value)
                          }
                        />

                        <div className="text-xs text-blue-600 px-1">
                          {rawValue.startsWith("=")
                            ? displayValue
                            : ""}
                        </div>

                      </td>

                    )

                  })}

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

    </div>

  )

}