import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { connectSocket, disconnectSocket, socket } from "./utils/socketClient";
import { addMessage, addMessageNotification, setActiveConversation, setChatLoader, setConversationMessages, setMyConversations } from "./Store/chatReducer";
import { fetchConversationMessages } from "./utils/httpClient";

export default function SocketBootstrap() {
  const authState = useSelector((state) => state.authentication || {});
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat || {});
  const chatRef = useRef(chatState);
  // let user = JSON.parse(localStorage.getItem('user') || 'null');
  const [toast, setToast] = useState({ open: false, text: "" });
  const userRef = useRef(null);
  useEffect(() => {
    chatRef.current = chatState;
  }, [chatState]);
  const token =
    authState.token ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (!isLoggedIn) {
      // console.log("SocketBootstrap: user not logged in, disconnecting socket");
      disconnectSocket();
      return;
    }
    const LoggedUser = (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        return null;
      }
    })();
    userRef.current = LoggedUser;
    const user = userRef.current;
    connectSocket();

    const handleDisconnect = (reason) =>
      console.log("socket disconnected:", reason);
    const handleConnectError = (err) =>
      console.error("socket connect error:", err);

    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("chat:invite", (data) => {
      console.log("Received chat invite:", data);
      console.log("Joining conversation:", data?.conversationId);
      // Optionally handle chat invite
      socket.emit("conversation:join", { conversationId: data?.conversationId });
    });
    const handleIncomingMessage = (data) => {
      try {
        console.log("SocketBootstrap: received message:", data);
        // console.log(user?.id, data?.senderId, "comparing ids", user?.id !== data?.senderId);
        if (user?.id !== data?.senderId) {
          console.log("New Message:", data);
          const { conversationId, senderId, text, createdAt } = data || {};
          // if (!conversationId || !message) return;

          const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
          const activeConversationId = chatRef?.current?.activeConversationId;
          const readableTime = new Date(createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const msgPayload = {
            id: `${conversationId}-${createdAt || Date.now()}`,
            sender: senderId, // optional self id if you store it
            text: text,
            time: readableTime,
          };
          // console.log("Received message on socket:", { conversationId, message: msgPayload });
          if (currentPath === "/chat") {
            console.log("on current page /chat", { conversationId, message: msgPayload, isActive: true });
            if (activeConversationId === conversationId) {
              dispatch(addMessage({ conversationId, message: msgPayload, isActive: true }));
              socket.emit('message:seen', { conversationId });
            } else {
              console.log("Not active conversation, adding notification");
              const list = Array.isArray(chatRef?.current?.myConversations) ? [...chatRef?.current?.myConversations] : [];
              // console.log('list', list);
              let found = false;
              const updated = list.map((conv) => {
                if (conv?.id === conversationId || conv?._id === conversationId) {
                  found = true;
                  return { ...conv, lastMessageText: text, myUnreadCount: (conv?.myUnreadCount || 0) + 1, updatedAt: createdAt || new Date().toISOString() };
                }
                return conv;
              });
              if (!found) {
                updated.unshift({ id: conversationId, lastMessageText: text, myUnreadCount: 1, updatedAt: createdAt || new Date().toISOString() });
              }
              // console.log('updated conversations', updated);
              dispatch(setMyConversations(updated));
            }
            return;
          }

          // 3) AllListings page with chat drawer open and same conversation
          if ((currentPath === "/alllistings" || currentPath === "/allListings") && chatRef?.current?.isListingsPaneOpen && activeConversationId === conversationId) {
            dispatch(addMessage({ conversationId, message: msgPayload, isActive: true }));
            socket.emit('message:seen', { conversationId });
            return;
          }

          // 2) Any other page -> notification
          dispatch(
            addMessageNotification({
              fromUserId: senderId,
              message: text,
              postId: data?.postId,
              time: readableTime,
            })
          );
          setToast({
            open: true,
            text: `New message: ${text}`,
          });
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
    const handleMessageRead = (data) => {
      const { conversationId } = data || {};
      if (conversationId == chatRef?.current?.activeConversationId) {
        //change status of messages in active conversation to read
        const list = Array.isArray(chatRef?.current?.conversations[conversationId]?.messages) ? [...chatRef?.current?.conversations[conversationId]?.messages] : [];
        const updatedMessages = list.map((msg) => ({ ...msg, status: "read" }));
        dispatch(setConversationMessages({ conversationId, messages: { rows: updatedMessages } }));
      }
      // if (conversationId && chatRef.current.conversations[conversationId]) {
      //   const list = Array.isArray(chatRef.current.myConversations) ? [...chatRef.current.myConversations] : [];
      //   console.log('list', list);
      //   const updated = list.map((conv) => {
      //     if (conv.id === conversationId || conv._id === conversationId) {
      //       return { ...conv, myUnreadCount: 0 };
      //     }
      //     return conv;
      //   });
      //   console.log('updated conversations after read', updated);
      //   dispatch(setMyConversations(updated));
      //}
    }
    const handleChatStart = async (data) => {
      dispatch(setActiveConversation(data.conversationId));
      try {
        const conversationId = data?.conversationId;
        // use listing id as conversation key for now
        console.log("Using conversationId:", conversationId);

        let messages = await fetchConversationMessages({
          conversationId,
          token: authState.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null),
        });
        console.log("Fetched messages for conversation:", messages);
        dispatch(setChatLoader(false));
        if (messages) {
          dispatch(setConversationMessages({ conversationId, messages }));
        }
      } catch (err) {
        console.error("Failed to persist message via API:", err);
      }
    }
    // Example event listener for incoming messages
    socket.on("message:new", handleIncomingMessage);
    socket.on("message:read", handleMessageRead);
    socket.on("chat:started", async (data) => {
      dispatch(setActiveConversation(data.conversationId));
      try {
        const conversationId = data.conversationId;
        // use listing id as conversation key for now
        console.log("Using conversationId:", conversationId);

        let messages = await fetchConversationMessages({
          conversationId,
          token: authState.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null),
        });
        console.log("Fetched messages for conversation:", messages);
        dispatch(setChatLoader(false));
        if (messages) {
          dispatch(setConversationMessages({ conversationId, messages }));
        }
      } catch (err) {
        console.error("Failed to persist message via API:", err);
      }
    });

    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("message:new", handleIncomingMessage);
      socket.off("message:read", handleMessageRead);
      socket.off("chat:started", handleChatStart);
      disconnectSocket();
    };
  }, [isLoggedIn]);

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4000}
      onClose={() => setToast({ open: false, text: "" })}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity="info"
        onClose={() => setToast({ open: false, text: "" })}
        sx={{ width: "100%" }}
      >
        {toast.text}
      </Alert>
    </Snackbar>
  );
}
