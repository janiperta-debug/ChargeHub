"use client"

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Simulate authentication service
export class AuthService {
  private static instance: AuthService
  private users: User[] = []

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    // Load users from localStorage
    const savedUsers = localStorage.getItem("chargehub-users")
    if (savedUsers) {
      this.users = JSON.parse(savedUsers)
    }
  }

  private saveUsers() {
    localStorage.setItem("chargehub-users", JSON.stringify(this.users))
  }

  async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = this.users.find((u) => u.email === email)
    if (existingUser) {
      return { user: null, error: "Käyttäjä tällä sähköpostilla on jo olemassa" }
    }

    // Create new user
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date().toISOString(),
    }

    this.users.push(user)
    this.saveUsers()

    // Save current session
    localStorage.setItem("chargehub-current-user", JSON.stringify(user))

    return { user, error: null }
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user
    const user = this.users.find((u) => u.email === email)
    if (!user) {
      return { user: null, error: "Käyttäjää ei löytynyt" }
    }

    // In a real app, you'd verify the password here
    // For demo purposes, we'll just accept any password

    // Save current session
    localStorage.setItem("chargehub-current-user", JSON.stringify(user))

    return { user, error: null }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem("chargehub-current-user")
  }

  getCurrentUser(): User | null {
    const savedUser = localStorage.getItem("chargehub-current-user")
    if (savedUser) {
      return JSON.parse(savedUser)
    }
    return null
  }

  async updateProfile(
    updates: Partial<Pick<User, "name" | "email">>,
  ): Promise<{ user: User | null; error: string | null }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { user: null, error: "Ei kirjautunutta käyttäjää" }
    }

    // Update user in users array
    const userIndex = this.users.findIndex((u) => u.id === currentUser.id)
    if (userIndex === -1) {
      return { user: null, error: "Käyttäjää ei löytynyt" }
    }

    const updatedUser = { ...this.users[userIndex], ...updates }
    this.users[userIndex] = updatedUser
    this.saveUsers()

    // Update current session
    localStorage.setItem("chargehub-current-user", JSON.stringify(updatedUser))

    return { user: updatedUser, error: null }
  }
}
