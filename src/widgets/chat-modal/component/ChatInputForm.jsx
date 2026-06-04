import {useWebsocket} from "../../../WebSocketProvider.jsx";
import {useAuthStore} from "../../../store/authStore.js";
import {apiClient} from "../../../api/apiClient.js";
import {useRef} from "react";

function ChatInputForm({ currentChatRoom }) {

    const { clientRef, connected } = useWebsocket();
    const authUser = useAuthStore((state) => state.user);
    const inputRef = useRef(null);

    const publish = (message, messageType) => {
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
        if (msg.length >= 1 && connected && clientRef?.current?.connected) {
            publish(msg, "TEXT");
        }
        inputRef.current.value = "";
    };

    const sendImage = async (e) => {
        const file = e.target.files[0];
        if (file && connected && clientRef?.current?.connected) {
            const formData = new FormData();
            formData.append("files", file);

            const response = await apiClient.post("/uploads/images", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            const imageUrl = response.data.data.imageUrls[0];
            publish(imageUrl, "IMAGE");
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