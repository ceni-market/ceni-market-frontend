import {useWebsocket} from "../../../WebSocketProvider.jsx";
import {useAuthStore} from "../../../store/authStore.js";
import {apiClient} from "../../../api/apiClient.js";
import {useRef} from "react";

function ChatInputForm({ currentChatRoom }) {

    const { clientRef, connected } = useWebsocket();
    const authUser = useAuthStore((state) => state.user);
    const inputRef = useRef(null);

    const publish = (message, messageType) => {
        console.log("[CHAT:PUBLISH] publish request", {
            destination: `/publish/chat/${currentChatRoom.chatRoomId}`,
            connected,
            clientConnected: clientRef?.current?.connected,
            chatRoomId: currentChatRoom?.chatRoomId,
            senderEmail: authUser?.email,
            messageType,
            message,
        });
        clientRef.current.publish({
            destination: `/publish/chat/${currentChatRoom.chatRoomId}`,
            body: JSON.stringify({
                senderEmail: authUser.email,
                message: message,
                messageType: messageType,
            })
        });
    };

    const sendMessage = () => {
        const msg = inputRef.current.value.trim();
        console.log("[CHAT:INPUT] send text attempt", {
            hasMessage: msg.length >= 1,
            connected,
            clientConnected: clientRef?.current?.connected,
            chatRoomId: currentChatRoom?.chatRoomId,
        });
        if (msg.length >= 1 && connected && clientRef?.current?.connected) {
            publish(msg, "TEXT");
        } else {
            console.log("[CHAT:INPUT] send text blocked", {
                messageLength: msg.length,
                connected,
                clientConnected: clientRef?.current?.connected,
                clientExists: !!clientRef?.current,
            });
        }
        inputRef.current.value = "";
    };

    const sendImage = async (e) => {
        const file = e.target.files[0];
        console.log("[CHAT:INPUT] send image attempt", {
            hasFile: !!file,
            fileName: file?.name,
            connected,
            clientConnected: clientRef?.current?.connected,
            chatRoomId: currentChatRoom?.chatRoomId,
        });
        if (file && connected && clientRef?.current?.connected) {
            const formData = new FormData();
            formData.append("files", file);

            const response = await apiClient.post("/uploads/images", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            console.log("[CHAT:INPUT] image upload response", response.data);
            const imageUrl = response.data.data.imageUrls[0];
            publish(imageUrl, "IMAGE");
        } else {
            console.log("[CHAT:INPUT] send image blocked", {
                hasFile: !!file,
                connected,
                clientConnected: clientRef?.current?.connected,
                clientExists: !!clientRef?.current,
            });
        }
        e.target.value = "";
    };

    return (
        <footer className="chat-modal-compose">
            <label className="chat-modal-input" htmlFor="chat-message" >
                <input id="chat-message" ref={inputRef} onKeyDown={(event) => { if(event.key === "Enter" && event.nativeEvent.isComposing != true) { sendMessage(); }}} placeholder="메시지를 입력하세요." />
                <label htmlFor="chat-message-file">
                    <i className="bi bi-image" />
                    <input type="file" id="chat-message-file" accept="image/*" onChange={sendImage} hidden />
                </label>
            </label>
            <button className="chat-modal-send" type="button" onClick={sendMessage}>
                <i className="bi bi-send" aria-hidden="true" />
            </button>
        </footer>
    );
}

export default ChatInputForm;
