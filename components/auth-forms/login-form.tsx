"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  const router = useRouter();
  const { setUserId } = useUser();

  // Progress animation
  useEffect(() => {
    if (!showOverlay) return;

    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [showOverlay]);

  // Handle login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const result = await response.json();

      if (response.ok && result.userId) {
        toast.success("Login successful!");

        // Save tokens
        localStorage.setItem("userId", result.userId);
        if (result.token) localStorage.setItem("token", result.token);
        localStorage.setItem("userEmail", email);

        // Update context
        setUserId(result.userId);

        // Show overlay progress
        setShowOverlay(true);

        // Fire & forget logging
        fetch("/api/log-activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            status: "login",
            timestamp: new Date().toISOString(),
          }),
        }).catch(console.error);

        // Redirect
        setTimeout(() => {
          router.push(`/dashboard?id=${encodeURIComponent(result.userId)}`);
        }, 2000);
      } else {
        toast.error(result.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">

      {/* ------------------------------------ */}
      {/*           Overlay Progress            */}
      {/* ------------------------------------ */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <h2 className="text-white text-xl font-semibold">
              Logging you in...
            </h2>
            <Progress value={progress} className="w-[70%] mx-auto" />
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/*                    LOGIN CARD                    */}
      {/* ------------------------------------------------ */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card className="border-none shadow-lg pb-0">
          {/* HEADER */}
          <CardHeader className="flex flex-col items-center space-y-1.5 pb-4 pt-6">
            {/* Replace SVG logo with actual image */}
            <Image
              src="/stashminidark.png"
              width={48}
              height={48}
              alt="Stash Logo"
              className="mb-2"
            />

            <div className="space-y-0.5 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-foreground">
                Stash ITAMS
              </h2>
              <p className="text-muted-foreground">
                Welcome Back! Use your credentials.
              </p>
            </div>
          </CardHeader>

          {/* FORM FIELDS */}
          <CardContent className="space-y-6 px-8">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Show/Hide btn */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={loading}
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </CardContent>

          {/* FOOTER */}
          <CardFooter className="flex justify-center border-t py-4">
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
