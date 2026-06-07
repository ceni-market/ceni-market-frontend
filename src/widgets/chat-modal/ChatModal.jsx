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
import {useAuthStore} from "../../store/authStore.js";

function ChatModal({
                       isChatOpen,
                       onClose,
                       createdChatRoomId,
                       setCreatedChatRoomId,
                       notification,
                       notiChatRoomId,
                       setNotiChatRoomId,
                       setNotiBadge
                   }) {

    useEffect(() => {
        setNotiBadge?.(null);
    }, [isChatOpen]);

    //모달 컨트롤 함수들
    const {position, isDragging, handleHeaderPointerDown} = useModal(isChatOpen);

    //네비게이트
    const navigate = useNavigate();
    const authUser = useAuthStore((state) => state.user);

    //내 채팅방 데이터 상태
    const [myChatRoomDatas, setMyChatRoomDatas] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentChatRoom, setCurrentChatRoom] = useState({});
    const [isSeller, setIsSeller] = useState(null);
    const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
    const [isTransactionSubmitting, setIsTransactionSubmitting] = useState(false);
    //채팅 메시지 States
    const [chatHistories, setChatHistories] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const getCurrentChatRoom = (myChatRoomData) => {
        if (selectedChatRoomId === myChatRoomData.chatRoomId) {
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

    //현재 스크롤이 맨 아래에 있는지 판별한 값을 저장하는 State. ChatMessageList, ChatInputForm에서 둘  사용
    const [isBottom, setIsBottom] = useState(true);

    const [lastMessageContent, setLastMessageContent] = useState("");

    //채팅방 데이터 요청
    const fetchMyChatRooms = async () => {
        const response = await apiClient.get(
            `/chat/mychat`,
            {}
        )
        //lastMessageAt순으로 정렬
        const chatRoomDatas = response.data.data.sort((a, b) => {
            return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
        })
        setMyChatRoomDatas(chatRoomDatas);

        setMyChatRoomDatas(response.data.data);
        return response.data.data ?? [];
    }

    const {refetch: refetchChatRooms, isLoading: myChatRoomsLoading, error: myChatRoomsError} = useQuery({
        queryKey: ['myChatRooms'],
        queryFn: () => fetchMyChatRooms(),
    })

    //새로만든 채팅방 바로 보이기
    useEffect(() => {
        if (myChatRoomDatas.length === 0 || !createdChatRoomId) return;
        const newChatRoom = myChatRoomDatas.find(chatRoom => chatRoom.chatRoomId === createdChatRoomId);

        if (!newChatRoom) return;
        setIsVisible(true);
        setCurrentChatRoom(newChatRoom);
        fetchMyChatHistories(createdChatRoomId);
        setSelectedChatRoomId(createdChatRoomId);
        setCreatedChatRoomId(null);
    }, [createdChatRoomId, myChatRoomDatas]);

    //채팅 메시지 기록 데이터 요청
    const fetchMyChatHistories = async (chatRoomId) => {
        await apiClient.get(
            `/chat/history/${chatRoomId}`,
            {}
        ).then(response => {
            setChatHistories(response.data.data);
        }).catch(error => {
            console.error(error);
            console.log("잘못된 채팅방 ID입니다.");
        });
    }

    //선택한 채팅방 색 강조
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(0);

    //알림오면 채팅방 업데이트
    useEffect(() => {
        refetchChatRooms();
    }, [notification]);

    //알림 클릭 시 채팅방 열기
    useEffect(() => {
        const targetChatRoom = myChatRoomDatas.find(chatRoom => chatRoom.chatRoomId === Number(notiChatRoomId));
        if (!targetChatRoom) return;
        setIsVisible(true);
        setCurrentChatRoom(targetChatRoom);
        fetchMyChatHistories(targetChatRoom.chatRoomId);
        setSelectedChatRoomId(targetChatRoom.chatRoomId);
        setNotiChatRoomId(null);
    }, [notiChatRoomId, myChatRoomDatas]);

    //게시글 보기
    const goToListingDetail = () => {
        onClose();
        navigate(`/products/${currentChatRoom.listingInfo?.id}`);
    }

    useEffect(() => {
        const listingId = currentChatRoom?.listingInfo?.id;
        let isCancelled = false;

        if (!listingId || !authUser?.id) {
            setIsSeller(null);
            return;
        }

        setIsSeller(null);
        setIsTransactionCompleted(false);

        apiClient.get(`/listings/${listingId}`)
            .then((response) => {
                if (!isCancelled) {
                    setIsSeller(Number(response.data.data?.seller?.id) === Number(authUser.id));
                }
            })
            .catch((error) => {
                console.error("상품 판매자 정보 조회 실패", error);
                if (!isCancelled) {
                    setIsSeller(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [currentChatRoom?.chatRoomId, currentChatRoom?.listingInfo?.id, authUser?.id]);

    const completeTransaction = async () => {
        if (!currentChatRoom?.chatRoomId || isTransactionSubmitting) return;

        setIsTransactionSubmitting(true);

        try {
            await apiClient.post("/transactions", {
                chatRoomId: currentChatRoom.chatRoomId,
            });
            setIsTransactionCompleted(true);
            alert("거래가 완료되었습니다.");
        } catch (error) {
            console.error("거래 완료 처리 실패", error);
            alert(error.response?.data?.message || "거래 완료 처리에 실패했습니다.");
        } finally {
            setIsTransactionSubmitting(false);
        }
    };

    //채팅방 목록에서 우클릭으로 채팅방 나가기 버튼을 만들기 위한 state
    const [contextMenu, setContextMenu] = useState(null);

    const handleContextMenu = (e, chatRoomId) => {
        e.preventDefault();
        setContextMenu({x: e.clientX, y: e.clientY, chatRoomId});
    };

    //채팅방 나가기
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
                        <input
                            id="chat-room-search"
                            type="search"
                            placeholder="대화방 또는 상대방을 검색하세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </label>
                </header>

                <div className="chat-modal-body">
                    {/* 좌측 사이드바 */}
                    <aside className="chat-modal-list">
                        {myChatRoomDatas.filter((myChatRoomData) => {
                            if (!searchKeyword) return true;
                            const keyword = searchKeyword.toLowerCase();
                            return (
                                myChatRoomData.contactUserInfo?.name?.toLowerCase().includes(keyword) ||
                                myChatRoomData.listingInfo?.title?.toLowerCase().includes(keyword)
                            );
                        }).map((myChatRoomData) => {
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
                    {isVisible ?
                        (<section className="chat-modal-room">
                            <header className="chat-modal-room-header">
                                <div className="chat-modal-room-title">
                                    <strong>{currentChatRoom.contactUserInfo?.name}</strong>
                                    <span>{currentChatRoom.listingInfo?.title}</span>
                                </div>
                                {isSeller === true ? (
                                    <button
                                        className="chat-modal-detail chat-modal-transaction"
                                        type="button"
                                        onClick={completeTransaction}
                                        disabled={isTransactionSubmitting || isTransactionCompleted}
                                    >
                                        {isTransactionCompleted
                                            ? "거래 완료됨"
                                            : isTransactionSubmitting
                                                ? "처리 중..."
                                                : "거래 완료하기"}
                                    </button>
                                ) : isSeller === false ? (
                                    <button className="chat-modal-detail" type="button" onClick={goToListingDetail}>
                                        상품 상세보기 &gt;
                                    </button>
                                ) : null}
                            </header>

                            {/* 분리된 메시지 리스트 */}
                            {/*<ChatMessageList messages={CHAT_MESSAGES} chatHistory={chatHistories}/>*/}
                            <ChatMessageList chatHistories={chatHistories}
                                             currentChatRoom={currentChatRoom}
                                             setLastMessageContent={setLastMessageContent}
                                             refetchChatRooms={refetchChatRooms}
                                             isBottom={isBottom}
                                             setIsBottom={setIsBottom}
                            />

                            {/* 분리된 하단 입력창 */}
                            <ChatInputForm currentChatRoom={currentChatRoom}
                                           setIsBottom={setIsBottom}
                            />
                        </section>) :
                        (<p className="plz-choose">채팅방을 선택하세요.</p>)
                    }
                </div>
            </section>
            {contextMenu && (
                <ul className="chat-context-menu"
                    style={{top: contextMenu.y, left: contextMenu.x}}
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