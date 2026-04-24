"use client"

import { use } from "react"
import { redirect } from "next/navigation"
import EbookPage from "../page"

interface EbookIdPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function EbookIdPage({ params, searchParams }: EbookIdPageProps) {
  const { id } = use(params)
  const search = use(searchParams)

  // Validate id is a number between 1-20
  const idNum = parseInt(id, 10)
  if (isNaN(idNum) || idNum < 1 || idNum > 20) {
    redirect("/ebook")
  }

  // Pass marketer ID to the ebook page via context
  return <EbookPage marketerId={id} />
}
