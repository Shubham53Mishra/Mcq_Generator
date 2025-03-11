"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";

// ✅ Form Validation Schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// ✅ API Call Function
async function login(email: string, password: string) {
  try {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("API Response:", data);

    if (!res.ok) {
      throw new Error(data.error || "Invalid credentials");
    }

    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}

// ✅ Login Page Component
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // ✅ Message state
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null); // ✅ Message type (success/error)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Handle Form Submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMessage(null); // Reset message before new attempt

    try {
      const data = await login(values.email, values.password);

      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server");
      }

      // ✅ Save token & user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Set Success Message
      setMessage("✅ Login successful! Redirecting...");
      setMessageType("success");

      // ✅ Redirect based on user role
      setTimeout(() => {
        if (data.user.role === "faculty") {
          router.push("/dashboard");
        } else {
          router.push("/student/tests");
        }
      }, 1000);
      
    } catch (error) {
      console.error("Login Error:", error);

      // ❌ Set Error Message
      setMessage("❌ Login failed: " + (error instanceof Error ? error.message : "Try again."));
      setMessageType("error");
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>

        {/* ✅ Show Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm text-center ${
              messageType === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
