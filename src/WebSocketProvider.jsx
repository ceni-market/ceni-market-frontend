import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useEffect, useRef, useState, createContext, useContext} from "react";
import {useAuthStore} from "./store/authStore";
import {Navigate} from "react-router-dom";

const WebsocketContext = createContext(null);

export const useWebsocket = () => useContext(WebsocketContext);

function WebSocketProvider({children}) {
    const [connected, setConnected] = useState(false);
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
    const [messages, setMessages] = useState([]);

    const clientRef = useRef(null)

    useEffect(() => {
        console.log("[WS] effect run", {
            hasAccessToken: !!accessToken,
            userId: user?.id,
            userEmail: user?.email,
            backendUrl: BACKEND_URL,
        });

        if (!accessToken || !user) {
            console.log("[WS] skip connect: missing auth data", {
                hasAccessToken: !!accessToken,
                hasUser: !!user,
            });
            clientRef.current?.deactivate();
            clientRef.current = null;
            setConnected(false);
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`https://www.ceni-market.site/connect`), connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            }, reconnectDelay: 5000,
            debug: (message) => {
                console.log("[WS:STOMP]", message);
            },
            onWebSocketError: (event) => {
                console.log("[WS] websocket error", event);
            },
            onConnect: () => {
                setConnected(true);
                console.log("[WS] connected", {
                    connected: client.connected,
                    userId: user.id,
                    notificationDestination: `/queue/notification/${user.id}`,
                });
                // 연결되면 알림 경로 구독 시작
                client.subscribe(`/queue/notification/${user.id}`, (message) => {
                    const msg = JSON.parse(message.body);
                    console.log("[WS] notification received", msg);
                    console.log(msg.content);
                    console.log(msg.messagePreview);
                });
                console.log("[WS] subscribed notification", `/queue/notification/${user.id}`);
                //구독 완료하면 메시지 하나 보내기
                client.publish({
                    destination: `/publish/notification/${user.id}`, headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }, // <- 헤더 보내야되면 추가해서 보내야함.
                    body: JSON.stringify({
                        type: "SYSTEM", content: "세니마켓에 오신걸 환영합니다!!!"
                    }),
                })
            },
            onDisconnect: () => {
                console.log("[WS] disconnected");
                setConnected(false);
            },

            onWebSocketClose: (event) => {
                console.log("[WS] websocket closed", {
                    code: event?.code,
                    reason: event?.reason,
                    wasClean: event?.wasClean,
                });
                setConnected(false);
            },

            onStompError: (frame) => {
                console.log("[WS] stomp error", {
                    headers: frame?.headers,
                    body: frame?.body,
                });
                setConnected(false);
            },
        })

        console.log("[WS] activate client", {
            connectUrl: `${BACKEND_URL}/connect`,
            reconnectDelay: 5000,
        });
        client.activate();
        clientRef.current = client;

        return () => client.deactivate() // 언마운트 시 연결 종료
    }, [accessToken, user])

    return (
        <WebsocketContext.Provider value={{ clientRef, connected }}>
            {children}
        </WebsocketContext.Provider>
    );

}

export default WebSocketProvider
