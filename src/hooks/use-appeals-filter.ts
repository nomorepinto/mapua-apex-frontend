import { useCallback, useState, type ChangeEvent } from "react"

import type { Appeal } from "@/components/org-dashboard/types"

export const APPEAL_STATUSES = [
  "All",
  "Approved",
  "Under Review",
  "Pending",
  "Rejected",
] as const

export const APPEAL_DEPARTMENTS = [
  "All",
  "Dean",
  "OSAAR",
  "Adviser",
  "HR",
  "IT",
] as const

const ITEMS_PER_PAGE = 5
const EMPTY_APPEALS: Appeal[] = []

export function useAppealsFilter() {
  const appeals = EMPTY_APPEALS
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  const query = searchQuery.toLowerCase()
  const filteredAppeals = appeals.filter((appeal) => {
    const matchesSearch =
      appeal.id.toLowerCase().includes(query) ||
      appeal.title.toLowerCase().includes(query)
    const matchesStatus =
      statusFilter === "All" || appeal.status === statusFilter
    const matchesDept =
      departmentFilter === "All" || appeal.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDept
  })

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAppeals.length / ITEMS_PER_PAGE)
  )
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedAppeals = filteredAppeals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page)
    },
    [totalPages]
  )

  const handleStatusChange = useCallback((status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }, [])

  const handleDeptChange = useCallback((department: string) => {
    setDepartmentFilter(department)
    setCurrentPage(1)
  }, [])

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1)
  }, [])

  return {
    searchQuery,
    statusFilter,
    departmentFilter,
    currentPage,
    totalPages,
    paginatedAppeals,
    emptyMessage: "No appeal records are available yet.",
    handlePageChange,
    handleStatusChange,
    handleDeptChange,
    handleSearch,
  }
}
