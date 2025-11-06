"use client"

import { cn } from "@/lib/utils"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("");
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [ReferenceID, setReferenceID] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (Firstname && Lastname) {
      const refID = `${Firstname.charAt(0).toUpperCase()}${Lastname.charAt(0).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceID(refID);
    }
  }, [Firstname, Lastname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Email || !Password || !Role || !Firstname || !Lastname) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, Password, Role, Firstname, Lastname, ReferenceID }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Registration successful!");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Logo at the top center */}
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

              <Input
                id="ReferenceID"
                type="hidden"
                required
                value={ReferenceID}
              />

              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your details below to create your account
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  required
                  value={Firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  required
                  value={Lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required value={Password}
                      onChange={(e) => setPassword(e.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </div>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <RadioGroup defaultValue="admin" className="flex-items-center" value={Role} onValueChange={setRole}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="admin" id="r2" />
                  <Label htmlFor="r2">Admin</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="guest" id="r3" />
                  <Label htmlFor="r3">Guest</Label>
                </div>
              </RadioGroup>

              <Field>
                <Button type="submit">
                  Create Account
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Log in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              fill
              src="/illustration.jpg"
              alt="Image"
              className="object-cover dark:brightness-90"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}