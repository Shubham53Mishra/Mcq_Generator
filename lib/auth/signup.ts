export async function signup(userData: { name: string; email: string; password: string; role: string }) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Signup failed")
    }
  
    return response.json()
  }
  