

const ChatRoomButton = ({ myChatRoomData, getCurrentChatRoom }) => {

    return (
        <>
        <button className="chat-modal-partner" type="button" onClick={() => getCurrentChatRoom(myChatRoomData)}>
            <img src={myChatRoomData.contactUserInfo?.profileImageUrl} alt="" />
            <span className="chat-modal-partner-copy">
                <strong>{myChatRoomData.contactUserInfo?.name}</strong>
                <span>{myChatRoomData.lastMessageInfo?.content}</span>
            </span>
            <time>{myChatRoomData.lastMessageAtConvert}</time>
        </button>
        </>
    )
}

export default ChatRoomButton;