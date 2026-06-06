import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useEffect, useRef, useState, createContext, useContext} from "react";
import {useAuthStore} from "./store/authStore";
import {Navigate} from "react-router-dom";

const WebsocketContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_APP_API_URL;

export const useWebsocket = () => useContext(WebsocketContext);

function WebSocketProvider({children}) {
    const [connected, setConnected] = useState(false);
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
    const [notification, setNotification] = useState(null);

    const clientRef = useRef(null)

    useEffect(() => {
        console.log("[WS] effect run", {
            hasAccessToken: !!accessToken,
            userId: user?.id,
            userEmail: user?.email,
            backendUrl: BACKEND_URL,
        }); //로그

        if (!accessToken || !user) {
            console.log("[WS] skip connect: missing auth data", {
                hasAccessToken: !!accessToken,
                hasUser: !!user,
            }); //로그

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
            }, //로그

            onConnect: () => {
                setConnected(true);
                console.log("[WS] connected", {
                    connected: client.connected,
                    userId: user.id,
                    notificationDestination: `/queue/notification/${user.id}`,
                }); //로그

                // 연결되면 클라이언트에 알림 허용 창 노출
                Notification.requestPermission().then((permission) => {
                    // if(permission === "granted") { <-- 허용 안해도 구독은 해야함. 이거로 채팅방 목록 업데이트 중. 알림 띄우는건 허용여부에 따라 달라짐.
                        // 허용하면 알림 경로 구독 시작
                        client.subscribe(`/user/queue/notification`, (message) => {
                            const msg = JSON.parse(message.body);

                            console.log("[WS] notification received", msg); //로그

                            setNotification(msg);
                        });
                        console.log("Subscribed Notification Websocket!!");
                    // }
                });
                console.log("[WS] subscribed notification", `/user/queue/notification/`);

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
        }); //로그

        client.activate();
        clientRef.current = client;

        return () => client.deactivate() // 언마운트 시 연결 종료
    }, [accessToken, user])

    return (
        <WebsocketContext.Provider value={{clientRef, notification, setNotification, connected}}>
            {children}
        </WebsocketContext.Provider>
    );

}

export default WebSocketProvider