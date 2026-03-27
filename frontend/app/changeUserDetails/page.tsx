"use client";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
export default function page() {
  const router = useRouter();
  const [form, setForm] = useState({
    userName: "",
    email: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/api/v1/users/currentUser`, {
          withCredentials: true,
        });
        setForm({
          userName: response.data.data.userName,
          email: response.data.data.email,
        });
      } catch (error: any) {
        toast.error("Failed to fetch user", {
          description: error.message,
        });
      }
    };

    fetchData();
  }, []);
  const changeDetails = async () => {
    try {
      const response = await API.post(`/api/v1/users/updateAccount`, form);

      toast("User Info Changed Successfully");
      router.push("/me");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Something went wrong";
      toast("Unable to change user info", {
        description: message,
      });
      router.push("/me");
    }
  };
  return (
    <div className="flex justify-center h-screen  items-center">
      <Card className="w-full max-w-sm font-mono">
        <CardHeader>
          <CardTitle>Update your info</CardTitle>
          <CardDescription>Enter your new Info</CardDescription>
          <CardAction>
            <Link href="/me">
              <Button variant="link">View Your Info</Button>
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="userName">Username</Label>
                </div>
                <Input
                  id="userName"
                  type="userName"
                  value={form.userName}
                  onChange={(e) => {
                    setForm({ ...form, userName: e.target.value });
                  }}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={changeDetails}>
            Update info
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
