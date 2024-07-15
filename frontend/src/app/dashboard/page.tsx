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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [wsid, setwsid] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const onlineUsersExceptMe: any = onlineUsers.filter(
    (item) => item.wsid !== wsid
  );

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
                duration: 3000,
                position: "bottom-right",
              });

              break;
            case "user:pingedall":
              // show toast
              // console.log(payload);

              toast(`${payload.name} (${payload.email}) pinged all !`, {
                duration: 3000,
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
        <Button variant="default" onClick={pingAll}>
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
      <Toaster />
    </div>
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
