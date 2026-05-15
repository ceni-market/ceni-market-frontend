import { useEffect, useRef, useState } from 'react';
import './ChatModal.scss';

const CHAT_MESSAGES = [
  {
    id: 1,
    type: 'partner',
    text: '강현님 안녕하세요.',
    time: '오후 2:30',
  },
  {
    id: 2,
    type: 'partner',
    text: '좋은 소식이 하나 있는데 잠시 나와보시겠어요?',
    time: '오후 2:30',
  },
  {
    id: 3,
    type: 'me',
    text: '재용님 안녕하세요!!',
    time: '오후 2:30',
  },
  {
    id: 4,
    type: 'me',
    text: '지금 바로 챙겨서 나갈게요. 잠시만 기다려주세요!!',
    time: '오후 2:30',
  },
  {
    id: 5,
    type: 'partner-image',
    image: '/assets/images/chat-img.png',
    time: '오후 2:30',
  },
];

function ChatModal({ onClose }) {
  const dragStateRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!dragStateRef.current) {
        return;
      }

      const { startX, startY, originX, originY } = dragStateRef.current;
      setPosition({
        x: originX + event.clientX - startX,
        y: originY + event.clientY - startY,
      });
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleHeaderPointerDown = (event) => {
    if (event.target.closest('input, button')) {
      return;
    }

    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    setIsDragging(true);
  };

  return (
    <div className="chat-modal-overlay" onMouseDown={onClose}>
      <section
        className={`chat-modal${isDragging ? ' chat-modal-dragging' : ''}`}
        style={{ transform: `translate(${position.x}px, ${position.y}px) scale(0.8)` }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="chat-modal-header" onPointerDown={handleHeaderPointerDown}>
          <h2>채팅</h2>
          <label className="chat-modal-search" htmlFor="chat-room-search">
            <i className="bi bi-search" aria-hidden="true" />
            <input id="chat-room-search" type="search" placeholder="대화방 또는 상대방을 검색하세요" />
          </label>
        </header>

        <div className="chat-modal-body">
          <aside className="chat-modal-list">
            <button className="chat-modal-partner" type="button">
              <img src="/assets/images/chat-partner-photo.png" alt="" />
              <span className="chat-modal-partner-copy">
                <strong>이재용</strong>
                <span>갤럭시S26 Ultra 512GB</span>
              </span>
              <time>오후 2:30</time>
            </button>
          </aside>

          <section className="chat-modal-room">
            <header className="chat-modal-room-header">
              <div className="chat-modal-room-title">
                <strong>이재용</strong>
                <span>갤럭시S26 Ultra 512GB</span>
              </div>
              <button className="chat-modal-detail" type="button">
                상품 상세보기 &gt;
              </button>
            </header>

            <div className="chat-modal-messages">
              <p className="chat-modal-date">2026년 05월 01일</p>

              {CHAT_MESSAGES.map((message) => (
                <div className={`chat-message chat-message-${message.type}`} key={message.id}>
                  {message.type === 'partner-image' ? (
                    <img className="chat-message-image" src={message.image} alt="" />
                  ) : (
                    <p className="chat-message-bubble">{message.text}</p>
                  )}
                  <time>{message.time}</time>
                </div>
              ))}
            </div>

            <footer className="chat-modal-compose">
              <label className="chat-modal-input" htmlFor="chat-message">
                <input id="chat-message" type="text" placeholder="메시지를 입력하세요." />
                <i className="bi bi-image" aria-hidden="true" />
              </label>
              <button className="chat-modal-send" type="button">
                <i className="bi bi-send" aria-hidden="true" />
              </button>
            </footer>
          </section>
        </div>
      </section>
    </div>
  );
}

export default ChatModal;
