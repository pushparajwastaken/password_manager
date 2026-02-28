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
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
type User = {
  _id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
export function NavigationMenuDemo() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:4000/api/v1/users/currentUser",
        { withCredentials: true },
      );

      setUser(response.data.data);
    };
    fetchData();
  }, []);
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/v1/users/logout",
        {},
        { withCredentials: true },
      );
      router.push("/login");
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
            <NavigationMenuTrigger>Update</NavigationMenuTrigger>
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
