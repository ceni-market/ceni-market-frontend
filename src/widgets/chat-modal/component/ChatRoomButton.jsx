import {useState} from "react";


const ChatRoomButton = ({ myChatRoomData, getCurrentChatRoom, selectedChatRoomId }) => {

    return (
        <>
            <button className={selectedChatRoomId === myChatRoomData.chatRoomId ? "chat-modal-selected" : "chat-modal-partner"} type="button"
                    onClick={() => {
                        getCurrentChatRoom(myChatRoomData);
                    }
            }>
                <img src={myChatRoomData.contactUserInfo?.profileImageUrl} alt=""/>
                <span className="chat-modal-partner-copy">
                <strong>{myChatRoomData.contactUserInfo?.name}</strong>
                    {myChatRoomData.lastMessageInfo?.content.length > 22
                    ? (<span>{myChatRoomData.lastMessageInfo?.content.substring(0,22) + "..."}</span>)
                    : (<span>{myChatRoomData.lastMessageInfo?.content}</span>)}
                </span>
                <time>{myChatRoomData.lastMessageAtConvert}</time>
                { myChatRoomData.unReadMessageCount <= 0 ?
                    <span className="chat-room-badge" style={{visibility:'hidden'}}>{myChatRoomData.unReadMessageCount}</span> :
                    <span className="chat-room-badge">{myChatRoomData.unReadMessageCount}</span>
                }
            </button>
        </>
    )
}

export default ChatRoomButton;