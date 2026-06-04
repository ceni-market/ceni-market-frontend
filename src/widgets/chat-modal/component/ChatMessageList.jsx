import {useWebsocket} from "../../../WebSocketProvider.jsx";
import {useEffect, useRef, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {apiClient} from "../../../api/apiClient.js";
// import MessageToast from "./MessageToast.jsx";

function ChatMessageList({ chatHistories, currentChatRoom, setLastMessageContent, refetchChatRooms }) {
    //새로 온 메시지 저장 State
    const [messages, setMessages] = useState([]);
    //현재 스크롤이 맨 아래에 있는지 판별한 값을 저장하는 State
    const [isBottom, setIsBottom] = useState(true);

    //Context에 저장한 웹소켓 가져오기
    const { clientRef, connected } = useWebsocket();


    useEffect(() => {
        console.log("[CHAT:SUB] effect run", {
            connected,
            clientExists: !!clientRef?.current,
            clientConnected: clientRef?.current?.connected,
            chatRoomId: currentChatRoom?.chatRoomId,
            currentChatRoom,
        });
        setMessages([]);

        if (!connected || !clientRef?.current || !currentChatRoom?.chatRoomId) {
            console.log("[CHAT:SUB] skip subscribe", {
                connected,
                clientExists: !!clientRef?.current,
                clientConnected: clientRef?.current?.connected,
                chatRoomId: currentChatRoom?.chatRoomId,
            });
            return;
        }

        console.log("[CHAT:SUB] subscribe", `/queue/chat/${currentChatRoom.chatRoomId}`);
        const subscription = clientRef.current.subscribe(
            `/queue/chat/${currentChatRoom.chatRoomId}`,
            (frame) => {
                const msg = JSON.parse(frame.body);
                console.log("[CHAT:SUB] message received", {
                    destination: `/queue/chat/${currentChatRoom.chatRoomId}`,
                    rawBody: frame.body,
                    parsed: msg,
                });
                setLastMessageContent(msg);
                setMessages((prev) => [...prev, msg]);
            }
        );

        return () => {
            console.log("[CHAT:SUB] unsubscribe", `/queue/chat/${currentChatRoom.chatRoomId}`);
            subscription.unsubscribe();
        };
    }, [connected, currentChatRoom?.chatRoomId]);

    //마지막 조회시간 업데이트 요청
    const updateLastRead = async () => {
        console.log("[CHAT:READ] update request", {
            chatRoomId: currentChatRoom?.chatRoomId,
        });
        const response = await apiClient.get(
            `/chat/${currentChatRoom.chatRoomId}/readAt`,
            {}
        )
        console.log("[CHAT:READ] update response", response.data);
    }

    const { mutate: reUpdateLastRead, isLoading: updateLastReadLoading, error: updateLastReadError, status: success} = useMutation({
        mutationKey: ['updateLastRead'],
        mutationFn: () => updateLastRead(),
    })

    //기존 채팅 기록과 새로 온 메시지를 합쳐서 저장하는 변수
    const allMessages = [...chatHistories, ...messages];

    //채팅방 스크롤을 가장 아래로 내리기 위해 걸어둔 useRef
    const scrollBottomRef = useRef(null);
    //채팅방 맨 아래로 스크롤 해주는 함수
    const scrollToBottomSmooth = () => {
        scrollBottomRef.current.scrollIntoView({behavior: 'smooth'});
    }
    const scrollToBottominstant = () => {
        scrollBottomRef.current.scrollIntoView({behavior: 'instant'});
    }

    //채팅창 새로 로딩 시 스크롤 맨 아래로 내리는 useEffect
    useEffect(() => {
        console.log("[CHAT:HISTORY] histories changed", {
            chatRoomId: currentChatRoom?.chatRoomId,
            historyCount: chatHistories?.length,
            histories: chatHistories,
        });
        updateLastRead();
        scrollToBottominstant();
    }, [chatHistories]);

    //새로운 채팅이 들어왔을 때, 현재 스크롤 위치가 맨 아래인지 판별해서 맞으면 새 메시지가 보이게 스크롤을 내리는 useEffect
    useEffect(() => {
        console.log("[CHAT:LOCAL] websocket messages changed", {
            chatRoomId: currentChatRoom?.chatRoomId,
            messageCount: messages.length,
            messages,
        });
        if(isBottom) {
            scrollToBottomSmooth();
        }
        //마지막 조회 시간 업데이트
        reUpdateLastRead();
        refetchChatRooms();
    }, [messages]);

    //채팅방 내부 컴포넌트 DOM 객체의 데이터를 바탕으로 현재 스크롤이 맨 아래인지 위쪽인지 판별해서 setIsBottom의 값을 바꾸는 useEffect
    useEffect(() => {
        //채팅방 DOM 객체를 가져와서 수치를 추출하는 메서드
        const elem = document.getElementById("chat-messages-area");
        const handleScroll = () => {
            setIsBottom(elem.scrollTop + elem.clientHeight >= elem.scrollHeight - 70);
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
            {allMessages.map((message, index) => {

                return (<div className={`chat-message chat-message-${message.senderEmail === currentChatRoom.contactUserInfo?.email ? "partner" : "me" }`} key={message.index}>

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
