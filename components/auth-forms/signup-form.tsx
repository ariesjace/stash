"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

export default function SignUpForm() {
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const [Role, setRole] = useState("guest"); // default
  const [ReferenceID, setReferenceID] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Auto-generate reference ID
  useEffect(() => {
    if (Firstname && Lastname) {
      const refID = `${Firstname.charAt(0).toUpperCase()}${Lastname.charAt(
        0
      ).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceID(refID);
    }
  }, [Firstname, Lastname]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Firstname || !Lastname || !Email || !Password || !ConfirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (Password !== ConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Firstname,
          Lastname,
          Email,
          Password,
          Role,
          ReferenceID,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        setTimeout(() => router.push("/auth/login"), 1200);
      } else {
        toast.error(result.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg pb-0">
          
          {/* HEADER */}
          <CardHeader className="flex flex-col items-center space-y-1.5 pb-4 pt-6">
            <Image
              src="/stashminidark.png"
              width={48}
              height={48}
              alt="Stash Logo"
              className="mb-2"
            />
            <h2 className="text-2xl font-semibold text-foreground">Stash ITAMS</h2>
            <p className="text-muted-foreground">
              Welcome! Create an account to get started.
            </p>
          </CardHeader>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8">

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    required
                    value={Firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    required
                    value={Lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={Email}
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
                    required
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={ConfirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Role Selection */}
            {/* Role Selection */}
<div className="space-y-2">
  <Label>Role</Label>

  <RadioGroup
    value={Role}
    onValueChange={setRole}
    className="grid grid-cols-2 gap-3 pt-1"
  >

    {/* Admin Option */}
    <RadioGroupItem
      value="admin"
      id="role-admin"
      className="sr-only"
    />

    <Label
      htmlFor="role-admin"
      className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition 
      ${Role === "admin" ? "border-primary bg-primary/10" : "border-input"}`}
    >
      Admin
    </Label>

    {/* Guest Option */}
    <RadioGroupItem
      value="guest"
      id="role-guest"
      className="sr-only"
    />

    <Label
      htmlFor="role-guest"
      className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition 
      ${Role === "guest" ? "border-primary bg-primary/10" : "border-input"}`}
    >
      Guest
    </Label>

  </RadioGroup>
</div>


              {/* Hidden Reference ID */}
              <input type="hidden" value={ReferenceID} readOnly />

              {/* Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>

            </CardContent>
          </form>

          {/* FOOTER */}
          <CardFooter className="flex justify-center border-t py-4">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>

        </Card>
      </div>
    </div>
  );
}
