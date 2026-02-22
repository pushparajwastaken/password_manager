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
  const [passwords, setPasswords] = useState({
    masterPassword: "",
    confirmPassword: "",
    newPassword: "",
  });
  const changePassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/users/changePassword",
        passwords,
        { withCredentials: true },
      );
      toast("Password Changed Successfully");
      router.push("/login");
    } catch (error: any) {
      toast("Unable to change the Password", {
        description: error.message,
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
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">Master Password</Label>
                <Input
                  id="masterPassword"
                  type="password"
                  value={passwords.masterPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      masterPassword: e.target.value,
                    })
                  }
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
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={changePassword}>
            Change Your Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
