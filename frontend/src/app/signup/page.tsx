"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setUser } from "@/lib/slices/user";
import { useRouter } from 'next/navigation'

function SignupPage() {
  const [curstate, setCurstate] = useState<string>("idle");
  const [errormsg, setErrormsg] = useState<string>("");
  const router = useRouter()
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user); 

  useEffect(() => {
    if (!user.isLoading && user.isAuth) {
      // Redirect to login page
      router.push("/login");
    }
  }, [user.isAuth, router, user.isLoading]);

  async function handleForm(e: React.SyntheticEvent) {
    e.preventDefault();

    const formData: {
      name: string;
      email: string;
      password: string;
    } = {
      name: (e.target as HTMLFormElement).username.value,
      email: (e.target as HTMLFormElement).email.value,
      password: (e.target as HTMLFormElement).password.value,
    };

    if (
      formData?.name?.trim()?.toString() != "" &&
      formData?.email?.trim()?.toString() != "" &&
      formData?.password != ""
    ) {
      try {
        setCurstate("busy");
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_PATH}/auth/signup`,
          formData
        );

        // Reset the form
        (e.target as HTMLFormElement).reset();

        setErrormsg("");
        setCurstate("idle");

        // Redirect to .. page
        router.push("/login");
      } catch (error: any) {
        console.error("Error login:", error);
        setErrormsg(error?.response?.data?.message);
        setCurstate("idle");
      }
    }
  }

  
  return (
    <div className="min-h-[100vh] flex flex-col justify-center bg-[#ffebc4] bg-[linear-gradient(180deg,#ffebc4,#fd9)]">
      <Card className=" sm:w-[400px] sm:mx-auto mx-3 my-3 shadow-2xl border-[#00000055]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Signup</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Create a New Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="mt-4 text-center text-md text-red-900">
              {errormsg}
            </div>
            <form onSubmit={handleForm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="username"
                  placeholder="John Doe"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="flex-1" htmlFor="password">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                />
              </div>
              <Button
                className="w-full text-md"
                type="submit"
                disabled={curstate === "busy" ? true : false}
              >
                {curstate === "busy" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </form>
            <div className="mt-4 text-center text-md">
              Already have an account?{" "}
              <button className="underline" onClick={() => router.push("/login")}>
                Login
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;
