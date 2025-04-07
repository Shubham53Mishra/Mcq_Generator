"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id?: string
  email?: string
  role?: string
  profileImage?: string
}

export default function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          console.log("Fetched User:", data) // Debugging
          setUser(data)
          localStorage.setItem("user", JSON.stringify(data))
        } else {
          console.log("User not found")
          localStorage.removeItem("user")
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    console.log("Updated user state:", user) // Debugging state update

    // Click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (showDetails) {
        setShowDetails(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [user, showDetails])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      localStorage.removeItem("user")
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="relative flex items-center space-x-4 p-4">
      {user ? (
        <div className="relative">
          {/* Profile Image with Click Event */}
          <img
            src={user.profileImage || "/default-avatar.png"}
            alt="Profile"
            className="h-10 w-10 rounded-full cursor-pointer border-2 border-gray-300"
            onClick={(e) => {
              e.stopPropagation() // Stop event bubbling
              setShowDetails(!showDetails)
            }}
          />
          {/* User Details & Logout inside Dropdown */}
          {showDetails && (
            <div
              id="user-dropdown"
              className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50"
            >
              <p className="text-gray-700 text-center font-medium break-words">
                {user.email || "No email"}
              </p>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Not logged in</p>
      )}
    </div>
  )
}
