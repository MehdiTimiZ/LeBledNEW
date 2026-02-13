import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, MessageCircle, Send, X, Shield, User, Trash2, Loader2, Check, CheckCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { useMessages, Conversation } from '../hooks/useMessages';

interface MessagingLayoutProps {
  onClose?: () => void;
  currentUser?: UserProfile | null;
  initialContext?: {
    recipient: string;
    message: string;
  };
  language?: 'FR' | 'EN';
  onViewProfile?: (userId: string) => void;
}

export const MessagingLayout: React.FC<MessagingLayoutProps> = ({
  onClose,
  currentUser,
  initialContext,
  language = 'FR',
  onViewProfile
}) => {
  const {
    conversations,
    messages,
    activeConversation,
    loading,
    openConversation,
    sendMessage,
    deleteConversation,
    refresh,
  } = useMessages(currentUser || null);

  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle initial context (open or create conversation)
  useEffect(() => {
    if (initialContext && currentUser) {
      // Try to find existing conversation with this person
      const existing = conversations.find(c =>
        c.other_user_name === initialContext.recipient ||
        c.other_user_email === initialContext.recipient
      );
      if (existing) {
        openConversation(existing.conversation_id);
      }
      // If not found, user will need to send a message to create a new thread
    }
  }, [initialContext, conversations, currentUser]);

  const handleSend = async () => {
    if (!messageText.trim() || !currentUser) return;

    if (activeConversation) {
      // Find receiver from the active conversation
      const conv = conversations.find(c => c.conversation_id === activeConversation);
      if (conv) {
        await sendMessage(conv.other_user_id, messageText.trim(), activeConversation);
        setMessageText('');
      }
    }
  };

  const handleDelete = async (convId: string) => {
    await deleteConversation(convId);
    setShowDeleteMenu(null);
  };

  const activeConv = conversations.find(c => c.conversation_id === activeConversation);

  const filteredConversations = conversations.filter(c =>
    c.other_user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-[80vh] max-h-[800px] bg-[#1e2025] border border-[#2a2e37] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-fade-in">
      {/* Sidebar - Conversation List */}
      <div className="w-full md:w-[350px] bg-[#16181d] border-r border-[#2a2e37] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#2a2e37] space-y-4 bg-[#16181d]">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Messages</h2>
              {currentUser?.role === 'admin' && <Shield className="w-4 h-4 text-red-400" />}
            </div>
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto bg-[#16181d]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-16 h-16 bg-[#1e2025] rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-gray-600" />
              </div>
                <p className="text-gray-500 text-sm">No conversations yet</p>
                <p className="text-gray-600 text-xs mt-1">Start a conversation by contacting a seller</p>
            </div>
          ) : (
                filteredConversations.map((conv) => (
                  <div
                key={conv.conversation_id}
                className="relative group"
              >
                <div
                  onClick={() => openConversation(conv.conversation_id)}
                  className={`p-4 flex items-center space-x-3 cursor-pointer transition-all border-b border-[#2a2e37]/50 ${
                    activeConversation === conv.conversation_id
                      ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500'
                      : 'hover:bg-[#2a2e37]/30 border-l-4 border-l-transparent'
                    }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white border-2 border-indigo-500/30">
                      {conv.other_user_name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#16181d] rounded-full"></span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-sm font-bold truncate ${activeConversation === conv.conversation_id ? 'text-indigo-400' : 'text-white'
                        }`}>
                        {conv.other_user_name}
                      </h3>
                      <span className="text-[10px] text-gray-500 font-medium shrink-0 ml-2">
                        {formatTime(conv.last_message_time)}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                      {conv.last_message}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {conv.unread_count > 0 && (
                    <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm shadow-indigo-500/50 shrink-0">
                      {conv.unread_count}
                    </div>
                  )}
                </div>

                {/* Delete button (hover) */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(conv.conversation_id); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-[#0f1117] relative">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#2a2e37] flex justify-between items-center bg-[#16181d] shadow-sm z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white border border-indigo-500/30">
                {activeConv.other_user_name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white">{activeConv.other_user_name}</h3>
                <p className="text-xs text-gray-400 flex items-center font-medium">
                  <span className="text-green-400">Online</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleDelete(activeConv.conversation_id)}
                className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                title="Delete conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors ml-2 hidden md:block" title="Close Chat">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f1117] relative">
            <div className="flex justify-center my-4">
              <span className="text-xs text-gray-500 bg-[#16181d] px-3 py-1 rounded-full border border-[#2a2e37] shadow-sm">
                Conversation started
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUser?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start items-end'}`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs mr-2 border border-gray-600 text-white mb-1">
                      {activeConv.other_user_name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className={`
                    p-3.5 rounded-2xl max-w-[75%] shadow-md border relative
                    ${isMe
                      ? 'bg-indigo-600 text-white border-indigo-500/50 rounded-tr-none'
                      : 'bg-[#1e2025] text-gray-100 border-[#2a2e37] rounded-tl-none'}
                  `}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                      <span className={`text-[10px] ${isMe ? 'text-indigo-200 opacity-75' : 'text-gray-500'}`}>
                        {formatTime(msg.created_at)}
                      </span>
                      {isMe && (
                        msg.read
                          ? <CheckCheck className="w-3 h-3 text-indigo-200" />
                          : <Check className="w-3 h-3 text-indigo-300/50" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#2a2e37] bg-[#16181d]">
            <div className="flex items-center space-x-2 bg-[#0f1117] border border-[#2a2e37] rounded-xl p-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm px-4"
              />
              <button
                onClick={handleSend}
                disabled={!messageText.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 bg-[#0f1117] flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-[#1e2025] rounded-full flex items-center justify-center mb-6">
            <MessageCircle className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {conversations.length === 0 ? 'No Messages Yet' : 'Select a Conversation'}
          </h2>
          <p className="text-gray-400 max-w-md">
            {conversations.length === 0
              ? 'Start a conversation by contacting a seller from the marketplace.'
              : 'Choose a conversation from the left to start chatting.'}
          </p>
        </div>
      )}
    </div>
  );
};
