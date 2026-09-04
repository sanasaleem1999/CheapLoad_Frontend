import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Divider,
  Chip,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import { sendMessage, startChat } from "../../utils/socketClient";
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../Store/chatReducer';
import { getStoredUser } from '../../utils/storage';


export default function ChatScreen({
  open,
  onClose,
  driver,
  shipment,
  toUserId,
}) {
  //Direct Initializations
  const ME = getStoredUser()?.id;
  const driverName = driver?.name || 'Driver';
  const driverCompany = driver?.company;
  const shipmentTitle = shipment?.title;

  //state based initializations
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { conversations, activeConversationId, chatLoader, isListingsPaneOpen } = useSelector((state) => state.chat || {});
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);


  //hooks
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  //methods
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleSendMessage1 = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate driver response after 2 seconds
    setTimeout(() => {
      const driverResponse = {
        id: messages.length + 2,
        sender: 'driver',
        text: 'Thank you for the message. I will get back to you shortly.',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, driverResponse]);
    }, 2000);
  };
  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!message.trim() || !shipment) return;

    const conversationId = activeConversationId;
    const newMessage = {
      id: `${conversationId}-${Date.now()}`,
      sender: ME,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    dispatch(
      addMessage({
        conversationId,
        message: newMessage,
        isActive: true,
      })
    );
    setMessage("");
    console.log("Sending message to user:", toUserId);
    sendMessage(null, newMessage.text, shipment.id, conversationId);

  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock file upload
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: `Sent a file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        attachment: {
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: URL.createObjectURL(file),
          name: file.name,
        },
      };
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '800px',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">{driverName}</Typography>
            {driverCompany && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {driverCompany}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Shipment Info */}
      {shipmentTitle && (
        <Box sx={{ p: 2, bgcolor: '#e3f2fd' }}>
          <Typography variant="body2" color="text.secondary">
            Discussing: <strong>{shipmentTitle}</strong>
          </Typography>
        </Box>
      )}

      <Divider />

      {/* Messages Area */}
      <DialogContent
        sx={{
          flex: 1,
          overflow: 'auto',
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        {activeConversationId && conversations[activeConversationId]?.messages?.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === ME ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
              }}
            >
              {msg.sender === 'driver' && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {driverName}
                </Typography>
              )}
              <Paper
                sx={{
                  p: 2,
                  bgcolor: msg.sender === ME ? 'primary.main' : 'white',
                  color: msg.sender === ME ? 'white' : 'text.primary',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
                {msg?.attachment && (
                  <Box sx={{ mt: 1 }}>
                    {msg?.attachment?.type === 'image' ? (
                      <img
                        src={msg?.attachment?.url}
                        alt={msg?.attachment?.name}
                        style={{
                          maxWidth: '100%',
                          borderRadius: 8,
                          marginTop: 8,
                        }}
                      />
                    ) : (
                      <Chip
                        icon={<AttachFileIcon />}
                        label={msg?.attachment?.name}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                )}
              </Paper>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  textAlign: msg.sender === ME ? 'right' : 'left',
                  mt: 0.5,
                  mx: 1,
                }}
              >
                {msg.time}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </DialogContent>

      <Divider />

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'white' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Button
            size="small"
            startIcon={<ImageIcon />}
            onClick={handleAttachFile}
          >
            Image
          </Button>
          <Button
            size="small"
            startIcon={<AttachFileIcon />}
            onClick={handleAttachFile}
          >
            File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={message.trim() === ''}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'grey.300' },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Press Enter to send, Shift+Enter for new line
        </Typography>
      </Box>
    </Dialog>
  );
}