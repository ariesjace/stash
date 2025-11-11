"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const router = useRouter()

  // Progress animation overlay
  useEffect(() => {
    if (!showOverlay) return

    let value = 0
    const interval = setInterval(() => {
      value += 10
      setProgress(value)
      if (value >= 100) {
        clearInterval(interval)
        toast.success("Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 700)
      }
    }, 150)

    return () => clearInterval(interval)
  }, [showOverlay, router])

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
  
      if (!email || !password) {
        toast.error("All fields are required!")
        return
      }
  
      setLoading(true)
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: email, Password: password }),
        })
  
        const result = await response.json()
  
        if (response.ok) {
          toast.success("Login successful!")
  
          // ✅ Store the user ID and token (if provided)
          if (result.userId) {
            localStorage.setItem("userId", result.userId)
          }
          if (result.token) {
            localStorage.setItem("token", result.token)
          }
  
          // ✅ Optionally store email for quick display
          localStorage.setItem("userEmail", email)
  
          setShowOverlay(true)
  
          // ✅ Log activity (non-blocking)
          fetch("/api/log-activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              status: "login",
              timestamp: new Date().toISOString(),
            }),
          }).catch(console.error)
        } else {
          toast.error(result.message || "Login failed!")
        }
      } catch (error) {
        console.error("Login error:", error)
        toast.error("An error occurred while logging in!")
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className={cn("relative flex flex-col gap-6", className)} {...props}>
      {/* Overlay Progress */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <h2 className="text-white text-xl font-semibold">Logging you in...</h2>
            <Progress value={progress} className="w-[70%] mx-auto" />
          </div>
        </div>
      )}

      {/* Login Card */}
     <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                width={100}
                height={100}
                src="/stash-logo.png"
                alt="Stash Logo"
                className="object-contain"
              />
            </div>

            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">
                  Login to your Stash Account
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline hover:text-primary">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Right-side Image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/illustration.jpg"
              alt="Login Background"
              className="absolute inset-0 h-full w-full object-cover dark:brightness"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
