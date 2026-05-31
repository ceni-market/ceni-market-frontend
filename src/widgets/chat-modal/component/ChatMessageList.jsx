import {useWebsocket} from "../../../WebSocketProvider.jsx";
import {useEffect, useRef, useState} from "react";

function ChatMessageList({ chatHistories, currentChatRoom, setLastMessageContent }) {

    const [messages, setMessages] = useState([]);

    const clientRef = useWebsocket();

    useEffect(() => {
        setMessages([]);
        if(clientRef?.current?.connected) {
            const subscribe = clientRef.current.subscribe(`/queue/chat/${currentChatRoom.chatRoomId}`, (frame) => {
                const msg = JSON.parse(frame.body);
                setLastMessageContent(msg);
                setMessages(prev => [...prev, msg]);
            });

            return () => subscribe.unsubscribe();
        }
    }, [currentChatRoom]);

    const allMessages = [...chatHistories, ...messages];

    const scrollBottomRef = useRef(null);

    useEffect(() => {
        scrollBottomRef.current.scrollIntoView({behavior: 'instant'});
    }, [chatHistories, messages]);

    return (
        <div className="chat-modal-messages">
            {/*날짜 시스템 메시지*/}
            {/*<p className="chat-modal-date">2026년 05월 01일</p>*/}
            {allMessages.map((message) => {

                return (<div className={`chat-message chat-message-${message.senderEmail === currentChatRoom.contactUserInfo?.email ? "partner" : "me" }`} key={message.createdAt}>

                    {message.contentType === 'IMAGE' ? (
                        <img className="chat-message-image" src={message.message} alt="전송된 이미지" />
                    ) : (
                        <p className="chat-message-bubble">{message.message}</p>
                    )}
                    <time>{message.time}</time>
                </div>)
            })}
            <div ref={scrollBottomRef} />
        </div>
    );
}

export default ChatMessageList;