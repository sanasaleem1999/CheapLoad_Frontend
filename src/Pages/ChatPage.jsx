import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
  Chip
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';
import CheckIcon from '@mui/icons-material/Check';
// Mock imports from the local files provided above
import { HeaderBackground, primaryColor } from '../Constants/Colors';
import { connectSocket, disconnectSocket, emitSocketEvent, sendMessage, socket } from '../utils/socketClient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversationMessages, fetchMyConversations } from '../utils/httpClient';
import { addMessage, resetChat, resetReadCount, setActiveConversation, setConversationMessages, setMyConversations } from '../Store/chatReducer';
import Header from '../Components/Header';
import { getStoredUser } from '../utils/storage';
const MOCK_USER_ID = '6900f5dff7c93350d6b86d77'; // Mock current user ID
// --- MOCK DATA MAPPING ---
// In a real app, this data would come from a backend REST API
const mockContactMap = {
  'atl-cargo': { otherUserId: '6900f8f1bc440a0ffd502e6c', initials: 'AC', name: 'ATL Cargo', title: 'Dispatch · Load #1290', status: 'online' },
  'northline': { otherUserId: 'user-northline-789', initials: 'NF', name: 'Northline Freight', title: 'Shipper · Atlanta → Dallas', status: 'online' },
  'pacific': { otherUserId: 'user-pacific-012', initials: 'PM', name: 'Pacific Movers', title: 'Carrier · Flatbed', status: 'away' },
  'sunset': { otherUserId: 'user-sunset-345', initials: 'SL', name: 'Sunset Logistics', title: 'Carrier · 53” Dry Van', status: 'offline' },
};

const chatContacts = Object.keys(mockContactMap).map(key => ({
  id: key,
  ...mockContactMap[key],
  lastMessage: '...', // Placeholder
  time: '...', // Placeholder
  unread: 0, // Placeholder
}));

// Placeholder for conversation-to-message history storage
const initialThreads = {};

export default function ChatPage() {
  const ME = getStoredUser()?.id;
  const dispatch = useDispatch();
  const { myConversations, activeConversationId, conversations } = useSelector((state) => state.chat || {});
  const [selectedChatKey, setSelectedChatKey] = useState(null);
  const [draft, setDraft] = useState('');
  const { token } = useSelector((state) => state.authentication || {});
  const [threads, setThreads] = useState(initialThreads);
  const [isConnected, setIsConnected] = useState(socket ? socket.connected : false);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);


  // --- Socket Initialization and Event Handlers ---
  useEffect(() => {

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    socket.on('connect', handleConnect);

    // return () => {
    //   socket.off('connect', handleConnect);
    //   socket.off('disconnect', handleDisconnect);
    //   disconnectSocket();
    // };
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      const conversations = await fetchMyConversations({ token: localStorage.getItem('token') });
      console.log("Fetched Conversations:", conversations);
      dispatch(setMyConversations(conversations.data || []));
    };
    dispatch(resetChat());
    fetchConversations();
  }, []);

  // --- Logic to start/join chat when selecting a contact ---
  const handleSelectChat = async (chatKey) => {
    dispatch(setActiveConversation(chatKey));
    setSelectedChatKey(chatKey);
    const contact = myConversations.find(conv => conv._id === chatKey);
    setActiveChat(contact);
    if (!contact) return;
    try {
      const conversation = await fetchConversationMessages({
        conversationId: chatKey,
        token: token || (typeof window !== "undefined" ? localStorage.getItem("token") : null),
      })
      dispatch(setConversationMessages({ conversationId: chatKey, messages: conversation }));
      dispatch(resetReadCount(chatKey));
      socket.emit('message:seen', { conversationId: chatKey });
    } catch (err) {
      console.error("Error fetching conversation messages:", err);
    }
  }

  // --- Message Sending Logic ---
  const handleSend = (event) => {
    event.preventDefault();
    const conversationId = activeConversationId;
    const newMessage = {
      id: `${conversationId}-${Date.now()}`,
      sender: ME,
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: 'sent'
    };

    dispatch(
      addMessage({
        conversationId,
        message: newMessage,
        isActive: true,
      })
    );
    setDraft("");
    console.log("Sending message:", null, newMessage.text, activeChat.postId, conversationId);
    sendMessage(null, newMessage.text, activeChat.postId, conversationId);
  };

  // Auto-scroll to the bottom of the message list
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages.length]);

  const renderStatus = (message) => {
    const isMine = message.sender === ME || message.sender === 'me';
    if (!isMine) return null;
    const color = message.status === 'read' ? '#22c55e' : '#9ca3af';
    return <CheckIcon sx={{ fontSize: 14, color, ml: 0.5, verticalAlign: 'middle' }} />;
  };

  return (
    <>
    <Header/>
    <Box sx={{ minHeight: '100vh', background: '#f3f5fb', py: 4, px: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          boxShadow: '0 18px 48px rgba(17, 24, 39, 0.08)',
          borderRadius: 4,
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            px: { xs: 2.5, md: 3 },
            py: { xs: 2, md: 2.5 },
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                background: `${HeaderBackground}14`,
                color: HeaderBackground,
                p: 1.5,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <ChatBubbleOutlineIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: HeaderBackground }}>
                Messages
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Keep dispatchers and shippers aligned in one place.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip
              label={isConnected ? 'Connected' : 'Offline'}
              size="small"
              sx={{
                backgroundColor: isConnected ? `${primaryColor}22` : '#fee2e2',
                color: HeaderBackground,
                fontWeight: 600,
              }}
              icon={<CircleIcon sx={{ fontSize: 10, color: isConnected ? primaryColor : '#ef4444' }} />}
            />
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '340px 1fr' },
            minHeight: { xs: '70vh', md: 620 },
          }}
        >
          <Box
            sx={{
              borderRight: { md: '1px solid #e5e7eb' },
              borderBottom: { xs: '1px solid #e5e7eb', md: 'none' },
              background: '#f8fafc',
              p: 2.5,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search people or loads"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />

            <List dense sx={{ mt: 2, pr: 0.5 }}>
              {myConversations?.map((chat) => (
                <React.Fragment key={chat.id}>
                  <ListItemButton
                    onClick={() => handleSelectChat(chat._id)}
                    selected={chat._id === selectedChatKey}
                    sx={{
                      borderRadius: 2,
                      alignItems: 'flex-start',
                      mb: 1,
                      backgroundColor: chat._id === selectedChatKey ? '#fff' : 'transparent',
                      border: chat._id === selectedChatKey ? '1px solid #e5e7eb' : '1px solid transparent',
                      boxShadow: chat._id === selectedChatKey ? '0 8px 20px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${HeaderBackground}dd` }}>{chat.initials}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Typography sx={{ fontWeight: 700, color: '#111827' }}>{chat?.otherUser?.name}</Typography>
                          {chat?.status === 'online' && (
                            <CircleIcon sx={{ fontSize: 10, color: primaryColor }} />
                          )}
                        </Stack>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                            {chat.postId}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4b5563' }}>
                            {chat.lastMessageText}
                          </Typography>
                        </Box>
                      }
                    />
                    <Stack spacing={0.5} alignItems="flex-end">
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        {chat.createdAt ? new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </Typography>
                      {chat.myUnreadCount > 0 && (
                        <Chip
                          size="small"
                          label={chat.myUnreadCount}
                          sx={{ backgroundColor: HeaderBackground, color: '#fff', height: 22 }}
                        />
                      )}
                    </Stack>
                  </ListItemButton>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>

          <Box
            sx={{
              p: { xs: 2, md: 3 },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              background: 'linear-gradient(135deg, #fdfcfb 0%, #f5f7fb 100%)',
            }}
          >
            {activeChat ? (
              <>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 3,
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: `${HeaderBackground}dd` }}>{activeChat.initials}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>{activeChat.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {activeChat.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Conversation ID: {activeConversationId || 'Connecting...'}
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip
                    label={activeChat.status === 'online' ? 'Online' : 'Away'}
                    size="small"
                    icon={<CircleIcon sx={{ fontSize: 10, color: activeChat.status === 'online' ? primaryColor : '#f97316' }} />}
                    sx={{ backgroundColor: activeChat.status === 'online' ? '#eef2ff' : '#fff7ed', color: HeaderBackground, fontWeight: 600 }}
                  />
                </Stack>

                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    borderRadius: 3,
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    p: { xs: 1.5, md: 2.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.25,
                    minHeight: 320,
                  }}
                >
                  {(conversations[activeConversationId]?.messages || []).map((message) => (
                    <Stack
                      key={message.id}
                      direction="row"
                      justifyContent={message.sender === ME ? 'flex-end' : 'flex-start'}
                    >
                      <Box
                        sx={{
                          maxWidth: '78%',
                          backgroundColor: message.sender === ME ? HeaderBackground : '#f3f4f6',
                          color: message.sender === ME ? '#fff' : '#111827',
                          px: 1.75,
                          py: 1.25,
                          borderRadius: 2,
                          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)',
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          {message.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: message.sender === ME ? '#e5e7eb' : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 0.25,
                            mt: 0.5,
                          }}
                        >
                          {message.time}
                          {renderStatus(message)}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                  <div ref={messagesEndRef} />
                  {conversations[activeConversationId]?.messages.length === 0 && activeConversationId && (
                    <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center', mt: 4 }}>
                      Conversation started ({activeConversationId}). Send the first message!
                    </Typography>
                  )}
                  {/* {messages.length === 0 && !currentConversationId && (
                    <Typography variant="body2" sx={{ color: '#f97316', textAlign: 'center', mt: 4 }}>
                      Waiting for server to establish conversation...
                    </Typography>
                  )} */}
                </Box>

                <Box
                  component="form"
                  onSubmit={handleSend}
                  sx={{
                    background: '#fff',
                    borderRadius: 3,
                    border: '1px solid #e5e7eb',
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                    fullWidth
                    size="small"
                  />
                  <IconButton
                    type="submit"
                    // disabled={!draft.trim() || !currentConversationId}
                    sx={{
                      backgroundColor: HeaderBackground,
                      color: '#fff',
                      '&:hover': { backgroundColor: primaryColor },
                      '&.Mui-disabled': { backgroundColor: '#e5e7eb', color: '#9ca3af' }
                    }}
                    onClick={() => ""}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  flex: 1,
                  background: '#fff',
                  borderRadius: 3,
                  border: '1px solid #e5e7eb',
                  minHeight: 340,
                }}
              >
                <Typography variant="h6" sx={{ color: HeaderBackground, fontWeight: 800 }}>
                  Select a chat to start a conversation
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
                  Conversations will appear on this side.
                </Typography>
              </Stack>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
    </>
    
  );
}
