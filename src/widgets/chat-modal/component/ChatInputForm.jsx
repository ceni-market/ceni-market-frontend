function ChatInputForm() {
    return (
        <footer className="chat-modal-compose">
            <label className="chat-modal-input" htmlFor="chat-message">
                <input id="chat-message" type="text" placeholder="메시지를 입력하세요." />
                <i className="bi bi-image" aria-hidden="true" />
            </label>
            <button className="chat-modal-send" type="button">
                <i className="bi bi-send" aria-hidden="true" />
            </button>
        </footer>
    );
}

export default ChatInputForm;