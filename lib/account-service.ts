"use client"

export interface NetworkAccount {
  name: string
  logo: string
  status: "connected" | "not_connected" | "connecting" | "error"
  stations: string
  accountEmail: string | null
  lastConnected?: string
  errorMessage?: string
}

// Local storage key for account data
const ACCOUNTS_STORAGE_KEY = "chargehub_accounts"

// Default network accounts
const DEFAULT_ACCOUNTS: NetworkAccount[] = [
  { name: "Virta", logo: "⚡", status: "not_connected", stations: "2,400+", accountEmail: null },
  { name: "Helen", logo: "🔋", status: "not_connected", stations: "800+", accountEmail: null },
  { name: "K-Lataus", logo: "🏪", status: "not_connected", stations: "1,200+", accountEmail: null },
  { name: "ABC Lataus", logo: "⛽", status: "not_connected", stations: "600+", accountEmail: null },
  { name: "Fortum", logo: "🌿", status: "not_connected", stations: "38,000+", accountEmail: null },
  { name: "Recharge", logo: "🔌", status: "not_connected", stations: "15,000+", accountEmail: null },
]

export function getStoredAccounts(): NetworkAccount[] {
  if (typeof window === "undefined") return DEFAULT_ACCOUNTS

  try {
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY)
    if (stored) {
      const accounts = JSON.parse(stored)
      // Merge with defaults to ensure all networks are present
      return DEFAULT_ACCOUNTS.map((defaultAccount) => {
        const storedAccount = accounts.find((acc: NetworkAccount) => acc.name === defaultAccount.name)
        return storedAccount || defaultAccount
      })
    }
  } catch (error) {
    console.error("Failed to load stored accounts:", error)
  }

  return DEFAULT_ACCOUNTS
}

export function saveAccounts(accounts: NetworkAccount[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts))
  } catch (error) {
    console.error("Failed to save accounts:", error)
  }
}

export function connectAccount(networkName: string, email: string): NetworkAccount[] {
  const accounts = getStoredAccounts()
  const updatedAccounts = accounts.map((account) => {
    if (account.name === networkName) {
      return {
        ...account,
        status: "connected" as const,
        accountEmail: email,
        lastConnected: new Date().toISOString(),
        errorMessage: undefined,
      }
    }
    return account
  })

  saveAccounts(updatedAccounts)
  return updatedAccounts
}

export function disconnectAccount(networkName: string): NetworkAccount[] {
  const accounts = getStoredAccounts()
  const updatedAccounts = accounts.map((account) => {
    if (account.name === networkName) {
      return {
        ...account,
        status: "not_connected" as const,
        accountEmail: null,
        lastConnected: undefined,
        errorMessage: undefined,
      }
    }
    return account
  })

  saveAccounts(updatedAccounts)
  return updatedAccounts
}

export function isAccountConnected(networkName: string): boolean {
  const accounts = getStoredAccounts()
  const account = accounts.find((acc) => acc.name === networkName)
  return account?.status === "connected"
}

export function getConnectedAccountsCount(): number {
  const accounts = getStoredAccounts()
  return accounts.filter((acc) => acc.status === "connected").length
}
