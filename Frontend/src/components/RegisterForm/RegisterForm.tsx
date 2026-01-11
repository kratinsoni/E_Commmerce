"use client";

import type React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function RegisterFormLight() {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const passwordStrength = {
    hasLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/users/register`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      toast.success("Registration successful! Please log in.");
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-screen h-screen justify-center items-center flex bg-gradient-to-black from-white to-sage/50">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Card */}
        <div className="bg-card rounded-3xl shadow-xl shadow-charcoal/5 border border-border p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blush/30 flex items-center justify-center">
              <User className="w-6 h-6 text-charcoal" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal tracking-tight">
                Create account
              </h1>
              <p className="text-muted-foreground text-sm">
                Start your journey today
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-charcoal"
              >
                Full Name
              </Label>
              <div className="relative">
                <User
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200",
                    focused === "name" ? "text-sage" : "text-muted-foreground"
                  )}
                />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-card focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-200"
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
              <Label
                htmlFor="password"
                className="text-sm font-medium text-charcoal"
              >
                Password
              </Label>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-card focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-200"
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
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

              {/* Password Strength Indicators */}
              {password && (
                <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {[
                    {
                      check: passwordStrength.hasLength,
                      label: "At least 8 characters",
                    },
                    {
                      check: passwordStrength.hasNumber,
                      label: "Contains a number",
                    },
                    {
                      check: passwordStrength.hasSpecial,
                      label: "Contains special character",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200",
                          item.check
                            ? "bg-sage text-primary-foreground"
                            : "bg-secondary"
                        )}
                      >
                        {item.check && <Check className="w-3 h-3" />}
                      </div>
                      <span
                        className={
                          item.check ? "text-sage" : "text-muted-foreground"
                        }
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-sage hover:bg-sage/90 text-primary-foreground font-medium text-base group transition-all duration-200 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link to="#" className="text-sage hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-sage hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-6 pt-6 border-t border-border">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-sage hover:text-sage/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
