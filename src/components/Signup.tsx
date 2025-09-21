import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";

const API_URL = import.meta.env.VITE_API_URL;

async function registerRequest(payload: any) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Registration failed");
  }

  return res.json(); // { message, user, household, token }
}

function saveAuth(token: string) {
  localStorage.setItem("token", token);
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [householdAction, setHouseholdAction] = useState<"create" | "join">(
    "create"
  );
  const [householdName, setHouseholdName] = useState("");
  const [householdCode, setHouseholdCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: any = {
        name,
        email,
        password,
        household_action: householdAction,
      };

      if (householdAction === "create") {
        payload.household_name = householdName;
      } else {
        payload.household_code = householdCode;
      }

      const data = await registerRequest(payload);
      saveAuth(data.token);
      navigate("/"); // redirect to protected route
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {/* Household Action */}
              <div>
                <Label>Household</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="household_action"
                      value="create"
                      checked={householdAction === "create"}
                      onChange={() => setHouseholdAction("create")}
                    />
                    Create new
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="household_action"
                      value="join"
                      checked={householdAction === "join"}
                      onChange={() => setHouseholdAction("join")}
                    />
                    Join existing
                  </label>
                </div>
              </div>

              {/* Conditional Inputs */}
              {householdAction === "create" ? (
                <div>
                  <Label htmlFor="householdName">Household Name</Label>
                  <Input
                    id="householdName"
                    type="text"
                    required
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                    placeholder="Family household"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="householdCode">Join Code</Label>
                  <Input
                    id="householdCode"
                    type="text"
                    required
                    value={householdCode}
                    onChange={(e) => setHouseholdCode(e.target.value)}
                    placeholder="Enter join code"
                  />
                </div>
              )}

              {/* Error message */}
              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
