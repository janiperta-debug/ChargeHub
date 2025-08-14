export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

class AuthService {
  private storageKey = "chargehub_user"

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  async signUp(email: string, password: string, name: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUsers = this.getStoredUsers()
    if (existingUsers.some((u) => u.email === email)) {
      throw new Error("Käyttäjä on jo olemassa")
    }

    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    }

    // Store user
    existingUsers.push(user)
    localStorage.setItem("chargehub_users", JSON.stringify(existingUsers))
    localStorage.setItem(this.storageKey, JSON.stringify(user))

    return user
  }

  async signIn(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const existingUsers = this.getStoredUsers()
    const user = existingUsers.find((u) => u.email === email)

    if (!user) {
      throw new Error("Käyttäjää ei löydy")
    }

    localStorage.setItem(this.storageKey, JSON.stringify(user))
    return user
  }

  signOut(): void {
    localStorage.removeItem(this.storageKey)
  }

  updateProfile(updates: Partial<Pick<User, "name" | "email">>): User {
    const currentUser = this.getCurrentUser()
    if (!currentUser) throw new Error("Ei kirjautunutta käyttäjää")

    const updatedUser = { ...currentUser, ...updates }
    localStorage.setItem(this.storageKey, JSON.stringify(updatedUser))

    // Update in users list too
    const users = this.getStoredUsers()
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex >= 0) {
      users[userIndex] = updatedUser
      localStorage.setItem("chargehub_users", JSON.stringify(users))
    }

    return updatedUser
  }

  private getStoredUsers(): User[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("chargehub_users")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
}

export const authService = new AuthService()
