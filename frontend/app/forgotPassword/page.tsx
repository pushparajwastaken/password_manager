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

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import API from "@/lib/axios";
export default function CardDemo() {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    userName: "",
    email: "",
    confirmPassword: "",
    newPassword: "",
  });
  const changePassword = async () => {
    try {
      const response = await API.post(
        `/api/v1/users/forgotPassword`,
        passwords,
      );
      toast("Password Updated Successfully");
      router.push("/login");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Something went wrong";
      toast("Unable to change password", {
        description: message,
      });
    }
  };

  return (
    <div className="flex justify-center h-screen  items-center">
      <Card className="w-full max-w-sm font-mono">
        <CardHeader>
          <CardTitle>Change Your Password</CardTitle>
          <CardDescription>Remember the new Password</CardDescription>
          <CardAction>
            <Link href="/login">
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            changePassword();
          }}
        >
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  type="userName"
                  value={passwords.userName}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      userName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={passwords.email}
                  onChange={(e) =>
                    setPasswords({ ...passwords, email: e.target.value })
                  }
                  placeholder="lavanya@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm new Password</Label>
                </div>
                <Input
                  id="confirmassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => {
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Change Your Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
