import { getOnline, getWSbyId, makeOffline, makeOnline, userWSIds } from "../store";
import WebSocket from "ws";

export default function startWSServer(port: number | undefined) {
    
  const wss = new WebSocket.Server({ port: port });

  wss.on("connection", (ws: any, req: any) => {
    
    const params = new URLSearchParams(req.url.split("?")[1]);
    const wsid = params?.get("wsid");

    if (!wsid) {
        // console.log("Invalid! no id");
        ws.terminate();
        return;
    }

    const user = getWSbyId(wsid);
    
    if(user){
        makeOnline(wsid);
    }

    console.log("New client connected");

    

    ws.on("message", (message:any) => {
        const {command, payload} = message;
        switch(command){
            case "user:connected":
                ws.send(JSON.stringify({command:"user:update", payload: getOnline()}));
                break;
            case "user:ping":
                ws.send(JSON.stringify({command:"user:pinged", payload: {sender: wsid, receiver: payload}}));
                break;
            case "user:pingall":
                ws.send(JSON.stringify({command:"user:pingedall", payload: {sender: wsid}}));
        }
      
    });

    ws.on("close", () => {
        makeOffline(wsid);
    });
  });

  console.log("WebSocket server is running ...");

  return wss;
}
