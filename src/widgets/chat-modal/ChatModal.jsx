import { useModal } from "../../hooks/useModal";
import ChatRoomButton from "./component/ChatRoomButton.jsx";
import ChatMessageList from "./component/ChatMessageList.jsx";
import ChatInputForm from "./component/ChatInputForm.jsx";
import './ChatModal.scss';
import {useEffect, useState} from "react";
import axios from 'axios';
import {apiClient} from "../../api/apiClient.js";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

const CHAT_MESSAGES = [
  { id: 1, type: 'partner', text: '강현님 안녕하세요.', time: '오후 2:30' },
  { id: 2, type: 'partner', text: '좋은 소식이 하나 있는데 잠시 나와보시겠어요?', time: '오후 2:30' },
  { id: 3, type: 'me', text: '재용님 안녕하세요!!', time: '오후 2:30' },
  { id: 4, type: 'me', text: '지금 바로 챙겨서 나갈게요. 잠시만 기다려주세요!!', time: '오후 2:30' },
  { id: 5, type: 'partner-image', image: '/assets/images/chat-img.png', time: '오후 2:30' },
];

function ChatModal({ onClose, chatRoomData }) {
  //모달 컨트롤 함수들
  const { position, isDragging, handleHeaderPointerDown } = useModal();
  //네비게이트
  const navigate = useNavigate();

  //내 채팅방 데이터 상태
  const [myChatRoomDatas, setMyChatRoomDatas] = useState([{}]);
  const [currentChatRoom, setCurrentChatRoom] = useState({});
  //채팅 메시지 States
  const [chatHistories, setChatHistories] = useState([{}]);
  const [isVisible, setIsVisible] = useState(false);
  const getCurrentChatRoom = (myChatRoomData) => {
    setCurrentChatRoom(myChatRoomData);
    fetchMyChatHistories(myChatRoomData.chatRoomId)
        .then(response => {setChatHistories(response.data.data);});
    setIsVisible(true);
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


  return (
      <div className="chat-modal-overlay" onMouseDown={onClose}>
        <section
            className={`chat-modal${isDragging ? ' chat-modal-dragging' : ''}`}
            style={{ transform: `translate(${position.x}px, ${position.y}px) scale(0.8)` }}
            onMouseDown={(event) => event.stopPropagation()}
        >
          {/* 헤더 (드래그 핸들러 탑재) */}
          <header className="chat-modal-header" onPointerDown={handleHeaderPointerDown}>
            <h2>채팅</h2>
            <label className="chat-modal-search" htmlFor="chat-room-search">
              <i className="bi bi-search" aria-hidden="true" />
              <input id="chat-room-search" type="search" placeholder="대화방 또는 상대방을 검색하세요" />
            </label>
          </header>

          <div className="chat-modal-body">
            {/* 좌측 사이드바 */}
            <aside className="chat-modal-list">
            {myChatRoomDatas.map((myChatRoomData) => (
                  <ChatRoomButton key={myChatRoomData.chatRoomId} myChatRoomData={myChatRoomData} getCurrentChatRoom={getCurrentChatRoom} />
            ))}
            </aside>
            {/* 우측 채팅방 메인 */}
            <section className="chat-modal-room">
              <header className="chat-modal-room-header">
                <div className="chat-modal-room-title">
                  <strong>{currentChatRoom.contactUserInfo?.name}</strong>
                  <span>{currentChatRoom.listingInfo?.title}</span>
                </div>
                { isVisible && (
                  <button className="chat-modal-detail" type="button" onClick={goToListingDetail}>
                    상품 상세보기 &gt;
                  </button> )
                }
              </header>

              {/* 분리된 메시지 리스트 */}
              {/*<ChatMessageList messages={CHAT_MESSAGES} chatHistory={chatHistories}/>*/}
              <ChatMessageList messages={chatHistories} currentUserEmail={currentChatRoom.contactUserInfo?.email} isVisible={isVisible}/>

              {/* 분리된 하단 입력창 */}
              <ChatInputForm />
            </section>
          </div>
        </section>
      </div>
  );
}

export default ChatModal;