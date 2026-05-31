import {useWebsocket} from "../../../WebSocketProvider.jsx";
import {useEffect, useRef, useState} from "react";
// import MessageToast from "./MessageToast.jsx";

function ChatMessageList({ chatHistories, currentChatRoom, setLastMessageContent }) {
    //새로 온 메시지 저장 State
    const [messages, setMessages] = useState([]);
    //현재 스크롤이 맨 아래에 있는지 판별한 값을 저장하는 State
    const [isBottom, setIsBottom] = useState(true);

    //Context에 저장한 웹소켓 가져오기
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

    //기존 채팅 기록과 새로 온 메시지를 합쳐서 저장하는 변수
    const allMessages = [...chatHistories, ...messages];

    //채팅방 스크롤을 가장 아래로 내리기 위해 걸어둔 useRef
    const scrollBottomRef = useRef(null);
    //채팅방 맨 아래로 스크롤 해주는 함수
    const scrollToBottom = () => {
        scrollBottomRef.current.scrollIntoView({behavior: 'instant'});
    }

    //채팅창 새로 로딩 시 스크롤 맨 아래로 내리는 useEffect
    useEffect(() => {
            scrollToBottom();
    }, [chatHistories]);

    //새로운 채팅이 들어왔을 때, 현재 스크롤 위치가 맨 아래인지 판별해서 맞으면 새 메시지가 보이게 스크롤을 내리는 useEffect
    useEffect(() => {
        if(isBottom) {
            scrollToBottom();
        }
    }, [messages]);

    //채팅방 내부 컴포넌트 DOM 객체의 데이터를 바탕으로 현재 스크롤이 맨 아래인지 위쪽인지 판별해서 setIsBottom의 값을 바꾸는 useEffect
    useEffect(() => {
        //채팅방 DOM 객체를 가져와서 수치를 추출하는 메서드
        const elem = document.getElementById("chat-messages-area");
        const handleScroll = () => {
            setIsBottom(elem.scrollTop + elem.clientHeight >= elem.scrollHeight - 50);
        }
        elem.addEventListener("scroll", handleScroll);

        return () => elem.removeEventListener("scroll", handleScroll);
    }, []);




    //토스트 팝업
    // const [messageToast, setMessageToast] = useState(false);



    return (
        <div id="chat-messages-area" className="chat-modal-messages">
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
            {/*{messageToast && (*/}
            {/*    <MessageToast messageToast={messageToast}*/}
            {/*                  setMessageToast={setMessageToast}*/}
            {/*                  isBottom={isBottom}*/}
            {/*                  onClick={scrollToBottom}*/}
            {/*    />*/}
            {/*    )*/}
            {/*}*/}
            <div ref={scrollBottomRef} />
        </div>
    );
}

export default ChatMessageList;