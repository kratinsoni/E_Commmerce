"use client";

import type React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function LoginFormLight() {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Login successful:", response.data);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-screen h-screen justify-center items-center flex bg-gradient-to-black from-white to-sage/50">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sage flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">A</span>
          </div>
        </div>
        {/* Card */}
        <div className="bg-card rounded-3xl shadow-xl shadow-charcoal/5 border border-border p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-charcoal"
              >
                Email
              </Label>
              <div className="relative">
                <Mail
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200",
                    focused === "email" ? "text-sage" : "text-muted-foreground"
                  )}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  className="pl-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-card focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-200"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-charcoal"
                >
                  Password
                </Label>
                <Link
                  to="#"
                  className="text-xs text-sage hover:text-sage/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200",
                    focused === "password"
                      ? "text-sage"
                      : "text-muted-foreground"
                  )}
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-card focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-200"
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-charcoal transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-sage hover:bg-sage/90 text-primary-foreground font-medium text-base group transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {"Don't have an account? "}
            <Link
              to="/auth/register"
              className="text-sage hover:text-sage/80 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
