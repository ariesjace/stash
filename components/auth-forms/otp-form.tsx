import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-6 md:min-h-[450px]", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
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
              <Field className="items-center text-center">
                <h1 className="text-2xl font-bold">Enter verification code</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  We sent a 6-digit code to your email
                </p>
              </Field>
              <Field>
                <FieldLabel htmlFor="otp" className="sr-only">
                  Verification code
                </FieldLabel>
                <div className="flex justify-center mt-4 mb-4">
                  <InputOTP maxLength={6} id="otp" required>
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </Field>
              <Button type="submit">
                <Link href="/dashboard">Verify</Link>
              </Button>
              <FieldDescription className="text-center">
                Didn&apos;t receive the code? <a href="#">Resend</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/illustration.jpg"
              width={500}
              height={500}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-80"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
