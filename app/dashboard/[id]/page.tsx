"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, setDoc } from "firebase/firestore"

export default function Editor() {

  const params = useParams<{ id: string }>()
  const id = params.id

  const rows = 12
  const columns = ["A","B","C","D","E","F"]

  const [cells,setCells] = useState<Record<string,string>>({})
  const [saving,setSaving] = useState(false)

  // realtime firestore listener
  useEffect(() => {

    const ref = doc(db,"documents",id)

    const unsub = onSnapshot(ref,(snapshot)=>{

      const data = snapshot.data()

      if(data?.cells){
        setCells(data.cells)
      }

    })

    return () => unsub()

  },[id])

  // update cell
  async function handleChange(cellId:string,value:string){

    const updated={
      ...cells,
      [cellId]:value
    }

    setCells(updated)

    const ref = doc(db,"documents",id)

    setSaving(true)

    await setDoc(ref,{cells:updated})

    setSaving(false)

  }

  function getCellValue(id:string){
    return Number(cells[id]) || 0
  }

  function evaluateFormula(value:string){

    if(!value.startsWith("=")) return value

    // SUM
    if(value.startsWith("=SUM(")){

      const range=value.slice(5,-1)
      const [start,end]=range.split(":")

      const col=start[0]
      const startRow=parseInt(start.slice(1))
      const endRow=parseInt(end.slice(1))

      let sum=0

      for(let i=startRow;i<=endRow;i++){
        sum+=getCellValue(col+i)
      }

      return String(sum)
    }

    // AVG
    if(value.startsWith("=AVG(")){

      const range=value.slice(5,-1)
      const [start,end]=range.split(":")

      const col=start[0]
      const startRow=parseInt(start.slice(1))
      const endRow=parseInt(end.slice(1))

      let sum=0
      let count=0

      for(let i=startRow;i<=endRow;i++){
        sum+=getCellValue(col+i)
        count++
      }

      return String(sum/count)
    }

    // arithmetic
    try{

      let expr=value.slice(1)

      columns.forEach(col=>{
        for(let r=1;r<=rows;r++){

          const key=col+r
          expr=expr.replaceAll(key,String(getCellValue(key)))

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