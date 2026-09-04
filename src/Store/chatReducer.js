import { createSlice } from "@reduxjs/toolkit";

/**
 * Keeps chat messages grouped by conversationId.
 * Shape:
 * {
 *   conversations: {
 *     [conversationId]: {
 *       messages: [ { id, text, sender, time, ... } ],
 *       unread: number,
 *     }
 *   },
 *   activeConversationId: string | null,
 * }
 */
const initialState = {
  conversations: {},
  activeConversationId: null,
  messageNotifications:[],
  chatLoader: false,
  myConversations:[],
  isListingsPaneOpen: false,

};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload || null;
      if (state.activeConversationId && state.conversations[state.activeConversationId]) {
        state.conversations[state.activeConversationId].unread = 0;
      }
    },
    setConversationMessages(state, action) {
      const { conversationId } = action.payload || {};
      if (!conversationId) return;

      state.conversations[conversationId] = state.conversations[conversationId] || {
        messages: []
       
      };
      state.conversations[conversationId].messages = action.payload?.messages.rows || [];
    },
    addMessage(state, action) {
      const { conversationId, message, isActive } = action.payload || {};
      if (!conversationId || !message) return;
      state.conversations[conversationId] = state.conversations[conversationId] || {
        messages: []
      };
      state.conversations[conversationId].messages.push(message);
    //   if (!isActive) {
    //     state.conversations[conversationId].unread += 1;
    //   }
    },
    markConversationRead(state, action) {
      const conversationId = action.payload;
      if (conversationId && state.conversations[conversationId]) {
        state.conversations[conversationId].unread = 0;
      }
    },
    addMessageNotification(state, action) {
      const notification = action.payload;
      if (notification) {
        state.messageNotifications.push(notification);
      }
    },
    resetChat(state) {
      state.conversations = {};
      state.activeConversationId = null;
    },
    setChatLoader(state, action) {
      state.chatLoader = action.payload;
    },
    setMyConversations(state, action) {
      state.myConversations = action.payload || [];
    },
    setListingsPaneOpen(state, action) {
      state.isListingsPaneOpen = action.payload;
    },
    resetReadCount(state, action) {
      const conversationId = action.payload;
      const conversation = state.myConversations.find(conv => conv.id === conversationId || conv._id === conversationId);
      if (conversation) {
        conversation.myUnreadCount = 0;
      }
    }
  },
});

export const {
  setActiveConversation,
  setConversationMessages,
  addMessage,
  markConversationRead,
  resetChat,
  setChatLoader,addMessageNotification,
  setMyConversations,
  setListingsPaneOpen,
  resetReadCount
} = chatSlice.actions;

export default chatSlice.reducer;
