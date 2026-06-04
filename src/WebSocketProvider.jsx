import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useEffect, useRef, useState, createContext, useContext} from "react";
import {useAuthStore} from "./store/authStore";
import {Navigate} from "react-router-dom";

const WebsocketContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_APP_API_URL;

export const useWebsocket = () => useContext(WebsocketContext);

function WebSocketProvider({children}) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
    const [messages, setMessages] = useState([]);

    const clientRef = useRef(null)

    useEffect(() => {

        if (!accessToken && !user) {
            clientRef.current?.deactivate();
            clientRef.current = null;
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`${BACKEND_URL}/connect`), connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            }, reconnectDelay: 600000,
            onConnect: () => {
                console.log("Connected!!");
                // 연결되면 알림 경로 구독 시작
                client.subscribe(`/queue/notification/${user.id}`, (message) => {
                    const msg = JSON.parse(message.body);
                    console.log(msg.content);
                    console.log(msg.messagePreview);
                });
                console.log("Subscribed Notification Websocket!!");
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
        })

        client.activate();
        clientRef.current = client;

        return () => client.deactivate() // 언마운트 시 연결 종료
    }, [accessToken, user])

    return (
        <WebsocketContext.Provider value={clientRef}>
            {children}
        </WebsocketContext.Provider>
    );

}

export default WebSocketProvider