import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../provides/AppProvider";
import { authApis, endpoints } from "../../configs/Apis";
import { printErrors } from "../../utils/printErrors";
import Avatar from "../ui/Avatar";
import moment from 'moment';
import 'moment/locale/vi';
import SavingSpinner from "../ui/Spinner/SavingSpinner"
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

const ChatBoxLayout = () => {
    const [open, setOpen] = useState(true);
    const { currentUser, activeChat, setActiveChat } = useContext(AppContext);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            try {
                const api = await authApis();
                const res = await api.get(endpoints.chatbox.getList);
                setMessages(res.data)
            } catch (err) {
                printErrors(err)
            }
        }
        fetchData();
    }, [currentUser])

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!currentUser){
            toast.warning("Vui lòng đăng nhập để chat với chatbot")
            return;
        }
        if (!newMsg.trim()) return;
        // if (!chatRoomId) return;
        const message = {
            "sender": "user",
            "text": newMsg
        }

        setMessages(prev => [...prev, message])
        const messageText = newMsg
        setNewMsg('');
        // console.info("messages", JSON.stringify(messages))
        try {
            setLoading(true);
            const api = await authApis();
            const res = await api.post(endpoints.chatbox.chat, { "message": messageText })
            setMessages(prev => [...prev, {
                "sender": "bot",
                "text": res.data.reply
            }])
        } catch (err) {
            printErrors(err);
        }finally{
            setLoading(false);
        }
    };
    return (
        <>
            {activeChat &&
                <div
                    className="position-fixed bottom-0 end-0 m-3"
                    style={{ width: 500, zIndex: 1050 }}
                >
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2 px-3">
                            <span>Chat với Chatbot</span>
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => setActiveChat(false)}
                                title="Đóng chat"
                            >
                                ✖
                            </button>
                        </div>
                        <div
                            className="card-body p-2"
                            style={{ maxHeight: '500px', overflowY: 'auto' }}
                        >
                            {messages.map((msg) => (
                                <>
                                    {msg.sender === "user" ? <>
                                        <div className="d-flex justify-content-end w-100 mb-2">
                                            <div className=" rounded p-2 border w-60"
                                                style={{ backgroundColor: '#e7fdffff' }}
                                            >
                                                <>
                                                    {msg.timestamp && (
                                                        <>
                                                            <div className='d-flex flex-row align-items-center'>
                                                                <p className="text-muted d-block ms-3">{moment(msg.timestamp).fromNow()}</p>
                                                            </div>

                                                        </>
                                                    )}
                                                </>
                                                <p className="mb-0">{msg.text}</p>
                                            </div>
                                        </div>
                                    </> : <>
                                        <div className="d-flex align-items-start mb-2">
                                            <Avatar src={'/icons/logo.png'} size={40} />
                                            <div className="bg-light rounded p-3 d-inline-block border w-75">
                                                <div className='d-flex flex-row align-items-center'>
                                                    <p className="fw-semibold">Chatbot</p>
                                                    <>
                                                        {msg.timestamp && (
                                                            <p className="text-muted d-block ms-3">{moment(msg.timestamp).fromNow()}</p>
                                                        )}
                                                    </>
                                                </div>
                                                <p className="mb-0">
                                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                                </p>
                                            </div>
                                        </div>
                                    </>}

                                </>

                            ))}
                            {loading && <SavingSpinner text = "Chatbot đang trả lời ..."/>}
                            <div ref={bottomRef} />
                        </div >
                        <form onSubmit={sendMessage} className="card-footer p-2 bg-light">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tin nhắn..."
                                    value={newMsg}
                                    onChange={(e) => setNewMsg(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">
                                    Gửi
                                </button>
                            </div>
                        </form>
                    </div >
                </div>
            }

        </>
    );
}

export default ChatBoxLayout;