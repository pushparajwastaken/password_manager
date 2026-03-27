"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Moon } from "lucide-react";
import { Sun } from "lucide-react";

type User = {
  _id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
export function NavigationMenuDemo() {
  const [isDark, setIsDark] = useState(false);
  const ThemeToggle = () => {
    useEffect(() => {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      }
    }, []);

    const toggleTheme = () => {
      const html = document.documentElement;

      if (isDark) {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }

      setIsDark(!isDark);
    };
  };
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/api/v1/users/currentUser`);
        setUser(response.data.data);
      } catch (error) {
        setUser(null); // silently fail, show Login button
      }
    };
    fetchData();
  }, []);
  const logout = async () => {
    try {
      await API.post(`/api/v1/users/logout`, {}, { withCredentials: true });
      localStorage.removeItem("accessToken");
      document.cookie = "accessToken=; path=/; max-age=0";
      window.location.href = "/login"; // force full page reload
    } catch (error: any) {
      toast("Unable to logout", {
        description: error.message,
      });
    }
  };
  return (
    <div className="flex justify-center py-3">
      <NavigationMenu className="font-mono">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96">
                <ListItem href="/showAllPasswords" title="Your Passwords">
                  See all your saved passwords
                </ListItem>
                <ListItem href="/generatePassword" title="Create a Password">
                  Generate a custom Password
                </ListItem>
                <ListItem href="/addPassword" title="Add a Password"></ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger> Modify</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-96">
                <ListItem href="/changePassword" title="Master Password">
                  Change your master password
                </ListItem>
                <ListItem href="/changeUserDetails" title="Update">
                  Update your info
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/me">Me</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {user ? (
              // ✅ Logged IN UI
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Button onClick={logout} className="text-black">
                  Logout
                </Button>
              </NavigationMenuLink>
            ) : (
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/login">Login</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
          {isDark ? (
            <NavigationMenuItem>
              <Button onClick={ThemeToggle}>
                <Moon />
              </Button>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <Button onClick={ThemeToggle}>
                <Sun />
              </Button>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
