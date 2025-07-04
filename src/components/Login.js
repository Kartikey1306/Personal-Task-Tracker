"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

// --- Login Form Component ---
const LoginForm = ({ onLogin, onSwitchToSignup }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    if (username.trim()) {
      localStorage.setItem("username", username.trim())
      onLogin()
    }
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Welcome Back!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to access your dashboard.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="username">Username</label>
          <Input
            id="username"
            type="text"
            placeholder="e.g., janedoe"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
        >
          Sign In
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <button onClick={onSwitchToSignup} className="font-semibold text-indigo-600 hover:underline">
          Sign Up
        </button>
      </p>
    </>
  )
}

// --- Signup Form Component ---
const SignupForm = ({ onLogin, onSwitchToLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignup = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    if (username.trim()) {
      localStorage.setItem("username", username.trim())
      onLogin()
    }
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Create an Account</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Get started with your own task dashboard.</p>
      </div>
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="new-username">Username</label>
          <Input
            id="new-username"
            type="text"
            placeholder="Choose a username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="new-password">Password</label>
          <Input
            id="new-password"
            type="password"
            placeholder="Create a password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="confirm-password">Confirm Password</label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
        >
          Create Account
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} className="font-semibold text-indigo-600 hover:underline">
          Sign In
        </button>
      </p>
    </>
  )
}

// --- Main Exported Component ---
export default function Login({ onLogin }) {
  const [isLoginView, setIsLoginView] = useState(true)

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* The `p-4` ensures there's always some padding on the smallest screens */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-950 rounded-2xl shadow-lg">
        {/* `w-full` makes it take up the screen width on mobile, `max-w-md` caps it on desktop */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        {isLoginView ? (
          <LoginForm onLogin={onLogin} onSwitchToSignup={() => setIsLoginView(false)} />
        ) : (
          <SignupForm onLogin={onLogin} onSwitchToLogin={() => setIsLoginView(true)} />
        )}
      </div>
    </main>
  )
}
