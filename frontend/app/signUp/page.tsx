"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
export default function CardDemo() {
  const router = useRouter();
  const [user, setUser] = useState({
    userName: "",
    email: "",
    masterPassword: "",
  });
  const onSignUp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/users/register",
        user,
        { withCredentials: true },
      );
      toast("Sign Up Successful!", {
        description: `Welcome ${response.data.data.userName}`,
      });
      router.push("/");
    } catch (error: any) {
      toast("Sign Up Failed", {
        description: error.message,
      });
    }
  };

  return (
    <div className="flex justify-center h-screen  items-center">
      <Card className="w-full max-w-sm font-mono">
        <CardHeader>
          <CardTitle>Make Your Account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
          <CardAction>
            <Link href="/login">
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="lavanya@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  type="userName"
                  value={user.userName}
                  onChange={(e) =>
                    setUser({ ...user, userName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Master Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={user.masterPassword}
                  onChange={(e) => {
                    setUser({ ...user, masterPassword: e.target.value });
                  }}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={onSignUp}>
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
