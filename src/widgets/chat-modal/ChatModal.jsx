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

function ChatModal({ isChatOpen, onClose, chatRoomData}) {
    //모달 컨트롤 함수들
    const {position, isDragging, handleHeaderPointerDown} = useModal(isChatOpen);

    //네비게이트
    const navigate = useNavigate();

    //내 채팅방 데이터 상태
    const [myChatRoomDatas, setMyChatRoomDatas] = useState([{}]);
    const [currentChatRoom, setCurrentChatRoom] = useState({});
    //채팅 메시지 States
    const [chatHistories, setChatHistories] = useState([{}]);
    const [isVisible, setIsVisible] = useState(false);
    const getCurrentChatRoom = (myChatRoomData) => {
        if(isVisible && currentChatRoom === myChatRoomData) {
            setIsVisible(false);
            setChatHistories([]);
        } else {
            setCurrentChatRoom(myChatRoomData);
            fetchMyChatHistories(myChatRoomData.chatRoomId)
                .then(response => {
                    setChatHistories(response.data.data);
                });
            setIsVisible(true);
        }
    }
    //채팅방 데이터 요청
    const fetchMyChatRooms = async () => {
        const response = await apiClient.get(
            `/chat/mychat`,
            {}
        )
        setMyChatRoomDatas(response.data.data);
        return response.data.data;
    }

    const {chatRoom, isLoading: myChatRoomsLoading, error: myChatRoomsError} = useQuery({
        queryKey: ['myChatRooms'],
        queryFn: () => fetchMyChatRooms(),
    })

    // const [chatMessages, setChatMessages] = useState([{}]);

    //채팅 메시지 기록 데이터 요청
    const fetchMyChatHistories = async (chatRoomId) => {
        const response = await apiClient.get(
            `/chat/history/${chatRoomId}`,
            {}
        )
        return response;
    }

    const goToListingDetail = () => {
        onClose();
        navigate(`/products/${currentChatRoom.listingInfo?.id}`);
    }

    //선택한 채팅방 색 강조
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(0);


    return (
        <div className="chat-modal-overlay" onMouseDown={onClose}>
            <section
                className={`chat-modal${isDragging ? ' chat-modal-dragging' : ''}`}
                style={{transform: `translate(${position.x}px, ${position.y}px) scale(0.8)`}}
                onMouseDown={(event) => event.stopPropagation()}
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
                                            const isSelected = myChatRoomData.chatRoomId === selectedChatRoomId;
                                            return (
                                                <ChatRoomButton
                                                                key={myChatRoomData.chatRoomId}
                                                                myChatRoomData={myChatRoomData}
                                                                getCurrentChatRoom={getCurrentChatRoom}
                                                                isSelected={isSelected}
                                                                setSelectedChatRoomId={setSelectedChatRoomId}
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
                                {isVisible && (
                                    <button className="chat-modal-detail" type="button" onClick={goToListingDetail}>
                                        상품 상세보기 &gt;
                                    </button>)
                                }
                            </header>

                            {/* 분리된 메시지 리스트 */}
                            {/*<ChatMessageList messages={CHAT_MESSAGES} chatHistory={chatHistories}/>*/}
                            <ChatMessageList messages={chatHistories}
                                             currentUserEmail={currentChatRoom.contactUserInfo?.email}
                                             isVisible={isVisible}/>

                            {/* 분리된 하단 입력창 */}
                            <ChatInputForm/>
                        </section>) :
                        (<p className="plz-choose">채팅방을 선택하세요.</p>)
                    }
                </div>
            </section>
        </div>
    );
}

export default ChatModal;