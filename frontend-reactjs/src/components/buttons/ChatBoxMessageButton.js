import { useContext } from "react";
import { FaFacebookMessenger } from "react-icons/fa";
import { AppContext } from "../../provides/AppProvider";

const ChatBoxMessageButton = () => {
    const { currentUser, activeChat, setActiveChat } = useContext(AppContext);
    return (
        <>
            <button
                onClick={() => setActiveChat(prev => !prev)}
                className="btn btn-light rounded-circle d-flex justify-content-center align-items-center position-relative"
                style={{ width: 44, height: 44 }}
                title="Messenger"
            >
                <FaFacebookMessenger size={32} />



            </button>
        </>
    )
}

export default ChatBoxMessageButton;