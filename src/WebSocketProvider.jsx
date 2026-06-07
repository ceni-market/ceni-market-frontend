import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useEffect, useRef, useState, createContext, useContext} from "react";
import {useAuthStore} from "./store/authStore";
import {refreshAccessToken} from "./api/apiClient.js";

const WebsocketContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_APP_API_URL;

export const useWebsocket = () => useContext(WebsocketContext);

function WebSocketProvider({children}) {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken); //Zustand 구독
    const [notification, setNotification] = useState(null);

    const clientRef = useRef(null);
    
    const connectPendingQueueRef = useRef([]);

    const safePublish = (params) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish(params);
        } else {
            connectPendingQueueRef.current.push(params);
        }
    };

    useEffect(() => {
        //토큰 만료 시간 60초 전에 알아서 웹소켓 연결 끊고, 토큰 다시 발급 받아서 재연결하는 코드
        const { expireTime } = useAuthStore.getState(); //Zustand 현재 값 읽기

        let refreshAccessTokenTimer = null;

        if(expireTime) {
            const delay = expireTime - Date.now() - 60000;
            refreshAccessTokenTimer = setTimeout(async () => {
                await refreshAccessToken();
            }, Math.max(0, delay));
        }

        if (!accessToken || !user) {
            clientRef.current?.deactivate();
            clientRef.current = null;
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`${BACKEND_URL}/connect`), connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            }, reconnectDelay: 5000,

            // debug: (message) => {
            //     console.log("[WS:STOMP]", message);
            // },
            onWebSocketError: (event) => {
                console.log("[WS] websocket error", event);
            }, //로그

            onConnect: () => {
                // 끊긴 사이에 쌓인 메시지 전송
                if (connectPendingQueueRef.current.length > 0) { //쌓인 메시지가 있으면
                    const queue = connectPendingQueueRef.current;
                    connectPendingQueueRef.current = []; //큐 초기화
                    queue.forEach(params => client.publish(params)); //메시지 전송
                }

                // 연결되면 클라이언트에 알림 허용 창 노출
                Notification.requestPermission().then((permission) => {
                    // if(permission === "granted") { <-- 허용 안해도 구독은 해야함. 이거로 채팅방 목록 업데이트 중. 알림 띄우는건 허용여부에 따라 달라짐.
                        // 허용하면 알림 경로 구독 시작
                        client.subscribe(`/user/queue/notification`, (message) => {
                            const msg = JSON.parse(message.body);
                            setNotification(msg);
                        });
                        console.log("Subscribed Notification Websocket!!");
                    // }
                });

                //구독 완료하면 메시지 하나 보내기
                client.publish({
                    destination: `/user/publish/notification`, headers: {
                        // Authorization: `Bearer ${accessToken}`,
                    }, // <- 헤더 보내야되면 추가해서 보내야함.
                    body: JSON.stringify({
                        type: "SYSTEM", content: "세니마켓에 오신걸 환영합니다!!!"
                    }),
                })
            },
            onDisconnect: () => {
                console.log("[WS] disconnected");
            },

            onWebSocketClose: (event) => {
                console.log("[WS] websocket closed", {
                    code: event?.code,
                    reason: event?.reason,
                    wasClean: event?.wasClean,
                });
            },

            onStompError: (frame) => {
                console.log("[WS] stomp error", {
                    headers: frame?.headers,
                    body: frame?.body,
                });
            },
        })

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate() // 언마운트 시 연결 종료
            clearTimeout(refreshAccessTokenTimer); //Access토큰 만료 시 연결 해제 타이머 제거
        }
    }, [accessToken, user])

    return (
        <WebsocketContext.Provider value={{clientRef, notification, setNotification, safePublish}}>
            {children}
        </WebsocketContext.Provider>
    );

}

export default WebSocketProvider