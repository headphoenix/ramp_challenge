import {
  PaginatedRequestParams,
  PaginatedResponse,
  RequestByEmployeeParams,
  SetTransactionApprovalParams,
  Transaction,
  Employee,
} from "./types"
import mockData from "../mock-data.json"

const TRANSACTIONS_PER_PAGE = 5

const data: { employees: Employee[]; transactions: Transaction[] } = {
  employees: [],
  transactions: [],
}

// Get data from localStorage if it exists
const localStorageTransactions = localStorage.getItem("transactions")
if (localStorageTransactions !== null) {
  data.transactions = JSON.parse(localStorageTransactions)
} else {
  data.transactions = mockData.transactions
}
data.employees = mockData.employees

// Export the functions that use the modified `data` object
export const getEmployees = (): Employee[] => data.employees

export const getTransactionsPaginated = ({
  page,
}: PaginatedRequestParams): PaginatedResponse<Transaction[]> => {
  if (page === null) {
    throw new Error("Page cannot be null")
  }

  const start = page * TRANSACTIONS_PER_PAGE
  const end = start + TRANSACTIONS_PER_PAGE

  if (start > data.transactions.length) {
    throw new Error(`Invalid page ${page}`)
  }

  const nextPage = end < data.transactions.length ? page + 1 : null

  return {
    nextPage,
    data: data.transactions.slice(start, end),
  }
}

export const getTransactionsByEmployee = ({ employeeId }: RequestByEmployeeParams) => {
  if (!employeeId) {
    throw new Error("Employee id cannot be empty")
  }

  return data.transactions.filter((transaction) => transaction.employee.id === employeeId)
}

export const setTransactionApproval = ({ transactionId, value }: SetTransactionApprovalParams): void => {
  const index = data.transactions.findIndex(
    (transaction) => transaction.id === transactionId
  )

  if (index === -1) {
    throw new Error("Invalid transaction to approve")
  }

  data.transactions[index].approved = value
  
  localStorage.setItem("transactions", JSON.stringify(data.transactions))
}
