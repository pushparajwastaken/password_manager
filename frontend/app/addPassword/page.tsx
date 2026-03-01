"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
export default function Home() {
  const [password, setPassword] = useState({
    password: "",
    title: "",
    website: "",
    masterPassword: "",
  });
  const addPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/password/createPassword",
        password,
        { withCredentials: true },
      );
      toast("Password added Successfully!");
      setPassword({
        password: "",
        title: "",
        website: "",
        masterPassword: "",
      });
    } catch (error: any) {
      toast("Unable to add Password", {
        description: error.message,
      });
    }
  };
  return (
    <div className="flex justify-center h-screen  items-center ">
      <Card className=" w-full max-w-sm font-mono">
        {" "}
        <CardHeader>
          {" "}
          <CardTitle>Add a password</CardTitle>{" "}
        </CardHeader>{" "}
        <CardContent>
          {" "}
          <form>
            {" "}
            <div className="flex flex-col gap-6">
              {" "}
              <div className="grid gap-2">
                {" "}
                <Label htmlFor="password">Password</Label>{" "}
                <Input
                  id="password"
                  type="password"
                  value={password.password}
                  onChange={(e) =>
                    setPassword({ ...password, password: e.target.value })
                  }
                  required
                />{" "}
              </div>{" "}
              <div className="grid gap-2">
                {" "}
                <Label htmlFor="title">Title</Label>{" "}
                <Input
                  id="title"
                  type="title"
                  value={password.title}
                  onChange={(e) =>
                    setPassword({ ...password, title: e.target.value })
                  }
                  required
                />{" "}
              </div>{" "}
              <div className="grid gap-2">
                {" "}
                <Label htmlFor="website">website</Label>{" "}
                <Input
                  id="website"
                  type="website"
                  value={password.website}
                  onChange={(e) =>
                    setPassword({ ...password, website: e.target.value })
                  }
                />{" "}
              </div>{" "}
              <div className="grid gap-2">
                {" "}
                <div className="flex items-center">
                  {" "}
                  <Label htmlFor="password">Master Password</Label>{" "}
                </div>{" "}
                <Input
                  id="password"
                  type="password"
                  value={password.masterPassword}
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      masterPassword: e.target.value,
                    });
                  }}
                  required
                />{" "}
              </div>{" "}
            </div>{" "}
          </form>{" "}
        </CardContent>{" "}
        <CardFooter className="flex-col gap-2">
          {" "}
          <Button type="submit" className="w-full" onClick={addPassword}>
            {" "}
            Add Password{" "}
          </Button>{" "}
        </CardFooter>{" "}
      </Card>
    </div>
  );
}
