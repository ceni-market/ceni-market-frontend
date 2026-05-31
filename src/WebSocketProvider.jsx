import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useEffect, useRef, useState, createContext, useContext} from "react";
import {useAuthStore} from "./store/authStore";
import {Navigate} from "react-router-dom";

const WebsocketContext = createContext(null);

export const useWebsocket = () => useContext(WebsocketContext);

function WebSocketProvider({children}) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
    const [messages, setMessages] = useState([]);

    const clientRef = useRef(null)

    useEffect(() => {

        if (!accessToken) {
            clientRef.current?.deactivate();
            clientRef.current = null;
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8088/connect'), connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            }, reconnectDelay: 100000,
            onConnect: () => {
                console.log("Connected!!");
                // 연결되면 구독 시작
                client.subscribe(`/queue/notification/2`, (message) => {
                    const msg = JSON.parse(message.body);
                    console.log(msg.content);
                    // setMessages([...messages, msg]);
                });
                console.log("Subscribed!!");
                //구독 완료하면 메시지 하나 보내기
                client.publish({
                    destination: `/publish/notification/2`, headers: {
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
    }, [accessToken])

    // const sendMessage = (message) => {
    //     client.publish(
    //         destination: '/topic/notification',
    //     )
    // }

    return (
        <WebsocketContext.Provider value={clientRef}>
            {children}
        </WebsocketContext.Provider>
    );

}

export default WebSocketProvider