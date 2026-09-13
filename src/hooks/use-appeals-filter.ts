import { useCallback, useState, type ChangeEvent } from "react"

import { useOrgStore } from "@/stores/org-store"

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

export function useAppealsFilter() {
  const appeals = useOrgStore((state) => state.appeals)
  const searchQuery = useOrgStore((state) => state.searchQuery)
  const setSearchQuery = useOrgStore((state) => state.setSearchQuery)
  const statusFilter = useOrgStore((state) => state.statusFilter)
  const setStatusFilter = useOrgStore((state) => state.setStatusFilter)
  const departmentFilter = useOrgStore((state) => state.departmentFilter)
  const setDepartmentFilter = useOrgStore((state) => state.setDepartmentFilter)

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

  const handleStatusChange = useCallback(
    (status: string) => {
      setStatusFilter(status)
      setCurrentPage(1)
    },
    [setStatusFilter]
  )

  const handleDeptChange = useCallback(
    (department: string) => {
      setDepartmentFilter(department)
      setCurrentPage(1)
    },
    [setDepartmentFilter]
  )

  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value)
      setCurrentPage(1)
    },
    [setSearchQuery]
  )

  return {
    searchQuery,
    statusFilter,
    departmentFilter,
    currentPage,
    totalPages,
    paginatedAppeals,
    handlePageChange,
    handleStatusChange,
    handleDeptChange,
    handleSearch,
  }
}
