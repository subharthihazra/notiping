import {
  getOnline,
  getWSbyId,
  makeOffline,
  makeOnline,
  userWSIds,
} from "../store";
import ws from "ws";

export default function startWSServer(port: number | undefined) {
  // const wss = new WebSocket.Server({ port: port });
  const wss = new ws.Server({ noServer: true });


  wss.on("connection", (ws: any, req: any) => {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const wsid = params?.get("wsid");

    if (!wsid) {
      // console.log("Invalid! no id");
      ws.terminate();
      return;
    }

    const user = getWSbyId(wsid);

    if (user) {
      makeOnline(wsid, ws);
    } else {
      ws.terminate();
      return;
    }

    console.log("New client connected");

    sendToUsers(
      getOnline(),
      JSON.stringify({
        command: "user:update",
        payload: getOnline().map((item) => ({
          email: item.email,
          name: item.name,
          wsid: item.wsid,
        })),
      })
    );

    ws.on("message", (message: any) => {
        // console.log("msg",JSON.parse(message))
      const { command, payload }: { command: string; payload: any } = JSON.parse(message);
      switch (command) {
        
        case "user:ping":
          if (!payload) break;
        //   console.log( getWSbyId(payload))
          getWSbyId(payload)?.ws.send(
            JSON.stringify({
              command: "user:pinged",
              payload: getOnline().filter((item) => item.wsid === wsid)[0],
            })
          );
          break;
        case "user:pingall":
          sendToUsers(
            getOnline().filter((item) => item.wsid !== wsid),
            JSON.stringify({
              command: "user:pingedall",
              payload: getOnline().filter((item) => item.wsid === wsid)[0],
            })
          );
      }
    });

    ws.on("close", () => {
      makeOffline(wsid);

      sendToUsers(
        getOnline(),
        JSON.stringify({
          command: "user:update",
          payload: getOnline().map((item) => ({
            email: item.email,
            name: item.name,
            wsid: item.wsid,
          })),
        })
      );
    });
  });

  function sendToUsers(users: any, message: string) {
    users.forEach((user: any) => {
      user?.ws.send(message);
    });
  }

  console.log("WebSocket server is running ...");

  return wss;
}
