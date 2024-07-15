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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { RxValueNone } from "react-icons/rx";
import { unsetUser } from "@/lib/slices/user";

export default function Dashboard() {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [wsid, setwsid] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const onlineUsersExceptMe: any = onlineUsers.filter(
    (item) => item.wsid !== wsid
  );

  const router = useRouter();
  const redirectUrl: string = "/login";

  useEffect(() => {
    console.log(user.isLoading);
    if (!user.isLoading && !user.isAuth) {
      // Redirect to dashboard page
      router.push(redirectUrl);
    }
  }, [user.isAuth, router, user.isLoading]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_PATH}/auth/wsid`,
          {
            withCredentials: true,
          }
        );
        setwsid(data.wsid);
        console.log(data);
      } catch (error) {
        console.log("Error Fetching Data");
      }
    }
    fetchData();
  }, [user.isAuth]);

  useEffect(() => {
    try {
      if (wsid !== null) {
        //make a websocket connection here
        let wss: WebSocket = new WebSocket(
          `${process.env.NEXT_PUBLIC_WS_PATH}?wsid=${wsid}`
        );
        wss.addEventListener("open", () => {
          console.log("Websocket connected");
        });
        wss.addEventListener("message", (event) => {
          // console.log(event.data);
          const data = JSON.parse(event.data);

          const { command, payload }: { command: string; payload: any } = data;

          switch (command) {
            case "user:update":
              setOnlineUsers(payload);
              break;
            case "user:pinged":
              // show toast
              // console.log(payload);

              toast(`${payload.name} (${payload.email}) pinged you !`, {
                duration: 4000,
                position: "bottom-right",
              });

              break;
            case "user:pingedall":
              // show toast
              // console.log(payload);

              toast(`${payload.name} (${payload.email}) pinged all !`, {
                duration: 4000,
                position: "bottom-right",
              });
              break;
          }
        });
        ws.current = wss;
      }
    } catch (err: any) {}
  }, [wsid]);

  function pingUser(wsid: string) {
    // console.log("hop", ws.current)
    ws.current?.send(
      JSON.stringify({
        command: "user:ping",
        payload: wsid,
      })
    );
  }

  function pingAll() {
    ws.current?.send(
      JSON.stringify({
        command: "user:pingall",
      })
    );
  }

  async function Signout() {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_PATH}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      ws.current = null;
      dispatch(unsetUser());


      router.push(redirectUrl);
    } catch (error) {
      console.log("Error Fetching Data");
    }
  }

  return (
    <div>
      <div className="w-full py-4 px-8 bg-slate-500 text-white text-3xl flex justify-between">
        Notiping
        <Button variant="secondary" onClick={Signout}>
          Logout
        </Button>
      </div>
      {user?.isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-8 mx-8 my-8">
          <div>
            <div className=" text-xl font-bold">{user.name}</div>
            <div className=" text-muted-foreground">{user.email}</div>
          </div>
          <Separator />
          <div className="text-center">
            <Button
              variant="default"
              onClick={pingAll}
              disabled={onlineUsersExceptMe?.length === 0}
            >
              Ping All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {onlineUsersExceptMe?.map((item: any, idx: any) => (
              <PingCard
                key={idx}
                name={item.name}
                email={item.email}
                onClick={() => pingUser(item.wsid)}
              />
            ))}
          </div>
          {onlineUsersExceptMe?.length === 0 && (
            <div className="mx-auto px-auto my-5">
              <RxValueNone className="text-5xl" />
            </div>
          )}
          <Toaster />
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col gap-8 mx-8 my-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 bg-slate-300 w-1/2 md:w-1/3" />
        <Skeleton className="h-5 bg-slate-200 w-1/3 md:w-1/4" />
      </div>
      <Separator />
      <div className="text-center">
        <Skeleton className="h-9 w-20 mx-auto bg-slate-300"></Skeleton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item: any, idx: any) => (
          <LoadingCard key={idx} />
        ))}
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 bg-slate-300"></Skeleton>
        <Skeleton className="h-4 bg-slate-200 w-5/6"></Skeleton>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-9 w-16 bg-slate-300"></Skeleton>
      </CardFooter>
    </Card>
  );
}

function PingCard({
  name,
  email,
  onClick,
}: {
  name: string;
  email: string;
  onClick: any;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button variant="default" onClick={onClick}>
          Ping
        </Button>
      </CardFooter>
    </Card>
  );
}
