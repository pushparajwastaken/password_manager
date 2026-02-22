"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
type User = {
  _id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function page() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/users/currentUser",
          { withCredentials: true },
        );

        console.log(response.data.data);

        setUser(response.data.data);
      } catch (error: any) {
        toast.error("Failed to fetch user", {
          description: "Please try again later",
        });
      }
    };

    fetchData(); // ✅ THIS WAS MISSING
  }, []); // ✅ run once on mount
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm font-mono ">
        <CardHeader>
          <CardTitle>Your Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="gaps-4">
            <h2>Username:{user?.userName}</h2>
            <h2>Email:{user?.email}</h2>
            <p>
              Created At: {user && new Date(user.createdAt).toLocaleString()}
            </p>

            <p>
              Updated At: {user && new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex-col">
          <Link href="/updateUserInfo">
            <Button type="submit" className="w-full">
              Update Your Info
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
