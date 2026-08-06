import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  getChats,
  createChat,
  getChat,
  sendMessage,
  type Chat as ChatType,
  type Message,
} from "../../utils/api";
import "./Chat.css";

type MobileContext = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
};

export default function Chat() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } =
    useOutletContext<MobileContext>();

  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChats();
        setChats(res.data || []);
      } catch {
        setChatsError("Failed to load chats.");
      } finally {
        setIsLoadingChats(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;

    const load = async () => {
      setMessages([]);
      setMessagesError("");
      setIsLoadingMessages(true);
      try {
        const res = await getChat(activeChatId);
        setMessages(res.data?.messages || []);
      } catch {
        setMessagesError("Failed to load messages.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    load();
  }, [activeChatId]);

  const handleCreateChat = async () => {
    const title = newChatTitle.trim() || "New Chat";
    setIsCreatingChat(false);
    setNewChatTitle("");
    try {
      const res = await createChat(title);
      if (res.data) {
        setChats((prev) => [res.data!, ...prev]);
        setActiveChatId(res.data._id);
        setIsMobileMenuOpen(false);
      }
    } catch {
      // A toast or inline error could go here in the future
    }
  };

  const handleSendMessage = async () => {
    if (!activeChatId || !messageInput.trim()) return;

    const question = messageInput.trim();
    const userMessage: Message = {
      _id: Date.now().toString(),
      chatId: activeChatId,
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessageInput("");
    setIsSendingMessage(true);

    try {
      const res = await sendMessage(activeChatId, question);
      if (res.data) {
        setMessages((prevMessages) => [...prevMessages, res.data]);
      }
    } catch {
      setMessagesError("Failed to send message.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="chat">
      <aside
        className={
          isMobileMenuOpen
            ? "chat__sidebar chat__sidebar_open"
            : "chat__sidebar"
        }
      >
        <button
          className="chat__new-btn"
          type="button"
          onClick={() => setIsCreatingChat(true)}
        >
          + New Chat
        </button>

        {isCreatingChat && (
          <input
            className="chat__title-input"
            type="text"
            placeholder="Chat name"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateChat();
              if (e.key === "Escape") {
                setIsCreatingChat(false);
                setNewChatTitle("");
              }
            }}
            autoFocus
          />
        )}

        {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
        {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

        <ul className="chat__list">
          {chats.map((chat) => (
            <li key={chat._id}>
              <button
                type="button"
                className={
                  chat._id === activeChatId
                    ? "chat__item chat__item_active"
                    : "chat__item"
                }
                onClick={() => {
                  setActiveChatId(chat._id);
                  setIsMobileMenuOpen(false);
                }}
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="chat__main">
        {!messagesError && !isLoadingMessages && !activeChatId && (
          <div className="chat__no-messages">
            <p>Select a chat, or start a new one.</p>
            <button
              className="chat__new-btn"
              type="button"
              onClick={() => {
                setIsCreatingChat(true);
                setIsMobileMenuOpen(true);
              }}
            >
              + New Chat
            </button>
          </div>
        )}

        {activeChatId && !messagesError && !isLoadingMessages && (
          <>
            {messages.length === 0 ? (
              <div className="chat__no-messages">
                <p>Start the conversation by asking a question below.</p>
              </div>
            ) : (
              <ul className="chat__messages">
                {messages.map((message) => (
                  <li
                    key={message._id}
                    className={
                      message.role === "user"
                        ? "chat__message chat__message_user"
                        : "chat__message chat__message_assistant"
                    }
                  >
                    {message.role === "assistant" ? (
                      <div className="markdown">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="chat__input-bar">
              <input
                className="chat__input"
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                disabled={isSendingMessage}
              />
              <button
                className="chat__send-btn"
                type="button"
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || isSendingMessage}
              >
                {isSendingMessage ? "Sending…" : "Send"}
              </button>
            </div>
          </>
        )}

        {activeChatId && isLoadingMessages && (
          <p className="chat__no-messages">Loading messages…</p>
        )}

        {activeChatId && messagesError && (
          <div className="chat__error">
            <p>{messagesError}</p>
          </div>
        )}
      </div>
    </div>
  );
}
