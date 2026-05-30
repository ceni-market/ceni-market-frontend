function ChatMessageList({ messages, currentPartnerEmail, isVisible }) {
    return (
        <div className="chat-modal-messages">
            {/*날짜 시스템 메시지*/}
            {/*<p className="chat-modal-date">2026년 05월 01일</p>*/}
            {messages.map((message) => {
                if(!isVisible){
                    return null;
                }

                return (<div className={`chat-message chat-message-${message.senderEmail === currentPartnerEmail ? "partner" : "me" }`} key={message.createdAt}>

                    {message.contentType === 'IMAGE' ? (
                        <img className="chat-message-image" src={message.message} alt="전송된 이미지" />
                    ) : (
                        <p className="chat-message-bubble">{message.message}</p>
                    )}
                    <time>{message.time}</time>
                </div>)
            })}
        </div>
    );
}

export default ChatMessageList;