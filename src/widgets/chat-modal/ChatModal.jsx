import {useModal} from "../../hooks/useModal";
import ChatRoomButton from "./component/ChatRoomButton.jsx";
import ChatMessageList from "./component/ChatMessageList.jsx";
import ChatInputForm from "./component/ChatInputForm.jsx";
import './ChatModal.scss';
import {useEffect, useState} from "react";
import axios from 'axios';
import {apiClient} from "../../api/apiClient.js";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

function ChatModal({ isChatOpen, onClose, createdChatRoomId, setCreatedChatRoomId }) {
    //모달 컨트롤 함수들
    const {position, isDragging, handleHeaderPointerDown} = useModal(isChatOpen);

    //네비게이트
    const navigate = useNavigate();

    //내 채팅방 데이터 상태
    const [myChatRoomDatas, setMyChatRoomDatas] = useState([]);
    const [currentChatRoom, setCurrentChatRoom] = useState({});
    //채팅 메시지 States
    const [chatHistories, setChatHistories] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const getCurrentChatRoom = (myChatRoomData) => {
        console.log("[CHAT:ROOM] select room", {
            selectedChatRoomId,
            clickedChatRoomId: myChatRoomData?.chatRoomId,
            room: myChatRoomData,
        });
        if(selectedChatRoomId === myChatRoomData.chatRoomId) {
                console.log("[CHAT:ROOM] close selected room", myChatRoomData.chatRoomId);
                setCurrentChatRoom(null);
                setIsVisible(false);
                setChatHistories([]);
                setSelectedChatRoomId(0);
        } else {
            setCurrentChatRoom(myChatRoomData);
            setIsVisible(true);
            fetchMyChatHistories(myChatRoomData.chatRoomId);
            setSelectedChatRoomId(myChatRoomData.chatRoomId);
        }
    }

    const [lastMessageContent, setLastMessageContent] = useState("");

    //채팅방 데이터 요청
    const fetchMyChatRooms = async () => {
        console.log("[CHAT:ROOMS] fetch request");
        const response = await apiClient.get(
            `/chat/mychat`,
            {}
        )
        console.log("[CHAT:ROOMS] fetch response", {
            count: response.data.data?.length,
            data: response.data.data,
        });
        setMyChatRoomDatas(response.data.data);
        return response.data.data ?? [];
    }

    const {refetch: refetchChatRooms, isLoading: myChatRoomsLoading, error: myChatRoomsError} = useQuery({
        queryKey: ['myChatRooms'],
        queryFn: () => fetchMyChatRooms(),
    })

    useEffect(() => {
        console.log("[CHAT:ROOM] created room effect", {
            createdChatRoomId,
            roomCount: myChatRoomDatas.length,
            rooms: myChatRoomDatas,
        });
        if(myChatRoomDatas.length === 0 || !createdChatRoomId) return ;
        const newChatRoom = myChatRoomDatas.find(chatRoom => chatRoom.chatRoomId === createdChatRoomId);
        console.log("[CHAT:ROOM] created room lookup", {
            createdChatRoomId,
            found: !!newChatRoom,
            newChatRoom,
        });
        if(!newChatRoom) return ;
        setIsVisible(true);
        setCurrentChatRoom(newChatRoom);
        fetchMyChatHistories(createdChatRoomId);
        setSelectedChatRoomId(createdChatRoomId);
        setCreatedChatRoomId(null);
    }, [createdChatRoomId, myChatRoomDatas]);

    //채팅 메시지 기록 데이터 요청
    const fetchMyChatHistories = async (chatRoomId) => {
        console.log("[CHAT:HISTORY] fetch request", {
            chatRoomId,
        });
        await apiClient.get(
            `/chat/history/${chatRoomId}`,
            {}
        ).then(res => {
            console.log("[CHAT:HISTORY] fetch response", {
                chatRoomId,
                count: res.data.data?.length,
                data: res.data.data,
            });
            setChatHistories(res.data.data);
        }).catch(error => {
            console.log("[CHAT:HISTORY] fetch error", {
                chatRoomId,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            console.log(error);
            console.log("잘못된 채팅방 ID입니다.");
        });
    }

    //선택한 채팅방 색 강조
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(0);

    //게시글 보기
    const goToListingDetail = () => {
        onClose();
        navigate(`/products/${currentChatRoom.listingInfo?.id}`);
    }

    //채팅방 목록에서 우클릭으로 채팅방 나가기 버튼을 만들기 위한 state
    const [contextMenu, setContextMenu] = useState(null);

    const handleContextMenu = (e, chatRoomId) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, chatRoomId });
    };

    const leaveChatRoom = async (chatRoomId) => {
        await apiClient.delete(`/chat/${chatRoomId}`);
        setContextMenu(null);
        if (selectedChatRoomId === chatRoomId) {
            setIsVisible(false);
            setCurrentChatRoom({});
            setSelectedChatRoomId(0);
            setChatHistories([]);
        }
        refetchChatRooms();
    };

    return (
        <div className="chat-modal-overlay" onMouseDown={onClose}>
            <section
                className={`chat-modal${isDragging ? ' chat-modal-dragging' : ''}`}
                style={{transform: `translate(${position.x}px, ${position.y}px) scale(0.8)`}}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setContextMenu(null)}
            >
                {/* 헤더 (드래그 핸들러 탑재) */}
                <header className="chat-modal-header" onPointerDown={handleHeaderPointerDown}>
                    <h2>채팅</h2>
                    <label className="chat-modal-search" htmlFor="chat-room-search">
                        <i className="bi bi-search" aria-hidden="true"/>
                        <input id="chat-room-search" type="search" placeholder="대화방 또는 상대방을 검색하세요"/>
                    </label>
                </header>

                <div className="chat-modal-body">
                            {/* 좌측 사이드바 */}
                            <aside className="chat-modal-list">
                                        {myChatRoomDatas.map((myChatRoomData) => {
                                            return (
                                                <ChatRoomButton
                                                                key={myChatRoomData.chatRoomId}
                                                                myChatRoomData={myChatRoomData}
                                                                getCurrentChatRoom={getCurrentChatRoom}
                                                                selectedChatRoomId={selectedChatRoomId}
                                                                onContextMenu={(e) => handleContextMenu(e, myChatRoomData.chatRoomId)}
                                                />
                                            )
                                        })}
                            </aside>
                    {/* 우측 채팅방 메인 */}
                    { isVisible ?
                        (<section className="chat-modal-room">
                            <header className="chat-modal-room-header">
                                <div className="chat-modal-room-title">
                                    <strong>{currentChatRoom.contactUserInfo?.name}</strong>
                                    <span>{currentChatRoom.listingInfo?.title}</span>
                                </div>
                                <button className="chat-modal-detail" type="button" onClick={goToListingDetail}>
                                    상품 상세보기 &gt;
                                </button>
                            </header>

                            {/* 분리된 메시지 리스트 */}
                            {/*<ChatMessageList messages={CHAT_MESSAGES} chatHistory={chatHistories}/>*/}
                            <ChatMessageList chatHistories={chatHistories}
                                             currentChatRoom={currentChatRoom}
                                             setLastMessageContent={setLastMessageContent}
                                             refetchChatRooms={refetchChatRooms}
                            />

                            {/* 분리된 하단 입력창 */}
                            <ChatInputForm currentChatRoom={currentChatRoom}
                            />
                        </section>) :
                        (<p className="plz-choose">채팅방을 선택하세요.</p>)
                    }
                </div>
            </section>
            {contextMenu && (
                <ul className="chat-context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <li onClick={() => leaveChatRoom(contextMenu.chatRoomId)}>채팅방 나가기</li>
                </ul>
            )}
        </div>
    );
}

export default ChatModal;
