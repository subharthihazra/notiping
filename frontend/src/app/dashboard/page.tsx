"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const arr: Array<{ name: string; email: string }> = [
    { name: "Arun Roy", email: "arun54royy@gmail.com" },
    { name: "Arun Roy", email: "arun54royy@gmail.com" },
    { name: "Arun Roy", email: "arun54royy@gmail.com" },
    { name: "Arun Roy", email: "arun54royy@gmail.com" },
  ];
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const redirectUrl: string = "/login";

  useEffect(() => {
    console.log(user.isLoading);
    if (!user.isLoading && !user.isAuth) {
      // Redirect to dashboard page
      router.push(redirectUrl);
    }
  }, [user.isAuth, router, user.isLoading]);

  return user?.isLoading ? (
    <div>Loading ...</div>
  ) : (
    <div className="flex flex-col gap-8 mx-8 my-8">
      <div>
        <div className=" text-xl font-bold">{user.name}</div>
        <div className=" text-muted-foreground">{user.email}</div>
      </div>
      <Separator />
      <div className="text-center">
        <Button variant="default">Ping All</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {arr.map((item: any, idx: any) => (
          <PingCard key={idx} name={item.name} email={item.email} />
        ))}
      </div>
    </div>
  );
}

function PingCard({ name, email }: { name: string; email: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button variant="default">Ping</Button>
      </CardFooter>
    </Card>
  );
}
