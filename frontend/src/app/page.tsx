"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 ">
      <div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12 m-auto">
        <div className="space-y-4 flex flex-col place-content-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Notiping
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Instant Notifications, Real-Time Connections
          </p>
          <div className="pt-10">
            {!user.isLoading && user.isAuth ? (
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            ) : (
              <Button onClick={() => router.push("/login")}>Login</Button>
            )}
          </div>
        </div>
        <Image
          src="/hero.png"
          width="550"
          height="550"
          alt="Hero"
          className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
        />
      </div>
    </section>
  );
}
