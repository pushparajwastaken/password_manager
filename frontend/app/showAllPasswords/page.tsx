"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Copy, Trash, Pencil } from "lucide-react";

import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { div } from "motion/react-client";
interface Password {
  _id: string;
  website: string;
  title: string;
  password: string;
}
export default function page() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [masterPassword, setMasterPassword] = useState("");
  const [lock, setLock] = useState(true);

  const copyPassword = (actualPassword: string) => {
    window.navigator.clipboard.writeText(actualPassword);
    toast("Copied to clipboard");
  };
  const fetchPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/password/user",
        { masterPassword },
        {
          withCredentials: true,
        },
      );
      setPasswords(response.data.data);
      setLock(false);
      toast("Passwords fetched Successfully");
    } catch (error: any) {
      toast("Unable to fetch passwords", {
        description: error.message,
      });
    }
  };

  const deletePassword = useCallback(async (passwordId: string) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/password/c/${passwordId}`,
        {
          withCredentials: true,
        },
      );
      setPasswords((prev) => prev.filter((p) => p._id !== passwordId));
      toast("Password deleted successfully");
    } catch (error: any) {
      toast("Unable to delete password", { description: error.message });
    }
  }, []);
  const passwordRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const toggleVisibility = (id: string, actualPassword: string) => {
    const span = passwordRefs.current[id];
    if (span) {
      span.textContent =
        span.textContent === actualPassword ? "••••••••" : actualPassword;
    }
  };
  if (lock) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-sm font-mono">
          <CardHeader>
            <CardTitle>
              Enter your master Password to fetch all passwords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action="">
              <div className="grid gap-2">
                <a
                  href="/changePassword"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
                <Input
                  id="password"
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" onClick={fetchPassword}>
              {" "}
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-mono py-12 pt-16">
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {passwords.length === 0 && (
          <p className="text-muted-foreground">No passwords saved yet.</p>
        )}
        {passwords.map((p) => (
          <Card key={p._id} className="w-72">
            <img
              src={`https://www.google.com/s2/favicons?sz=64&domain=${p.website}`}
              alt={p.title}
              className="mx-auto mt-4 h-12 w-12 rounded-full object-contain"
              onError={(e) => {
                e.currentTarget.src = `https://picsum.photos/seed/${p._id}/64/64`;
              }}
            />
            <CardHeader>
              <CardTitle className="text-center text-lg">{p.title}</CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                {p.website}
              </p>
            </CardHeader>

            <CardContent className="grid gap-3">
              {/* Password row */}
              <div className="flex items-center justify-between rounded-md border px-3 py-2 text-black">
                <span
                  ref={(el) => {
                    passwordRefs.current[p._id] = el;
                  }}
                  className="text-sm tracking-widest truncate max-w-50"
                >
                  ••••••••
                </span>
                <button
                  onClick={() => toggleVisibility(p._id, p.password)}
                  className="ml-2 shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <Eye size={16} />
                </button>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyPassword(p.password)}
              >
                <Copy size={14} className="mr-1" /> Copy
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => deletePassword(p._id)}
              >
                <Trash size={14} className="mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
