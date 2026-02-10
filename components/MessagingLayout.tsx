import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, MessageCircle, Send, X, Shield, User, Star } from 'lucide-react';
import { UserProfile } from '../types';

interface MessagingLayoutProps {
  onClose?: () => void;
  currentUser?: UserProfile | null;
}

export const MessagingLayout: React.FC<MessagingLayoutProps> = ({ onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'buying' | 'selling'>('buying');
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messageText, setMessageText] = useState('');
  
  // Data for Standard User
  const userConversations = [
    { id: 1, name: 'Amine Khelifi', message: 'Price is negotiable.', time: '2m', unread: 2, avatar: 'AK', role: 'Seller' },
    { id: 2, name: 'Sarah Benali', message: 'Can we meet at Sidi Yahia?', time: '1h', unread: 0, avatar: 'SB', role: 'Buyer' },
    { id: 3, name: 'LeBled Support', message: 'Your ticket #492 has been resolved.', time: '1d', unread: 0, avatar: 'LS', role: 'Admin', isOfficial: true },
  ];

  // Data for Admin User
  const adminConversations = [
    { id: 1, name: 'Reported User: BadGuy', message: 'Why was I banned? This is unfair.', time: '5m', unread: 1, avatar: 'BG', role: 'User', isReport: true },
    { id: 2, name: 'Yacine Tech', message: 'Requesting verification badge.', time: '2h', unread: 0, avatar: 'YT', role: 'Seller' },
    { id: 3, name: 'System Alert', message: 'High traffic detected in Oran region.', time: '4h', unread: 0, avatar: 'SYS', role: 'System', isSystem: true },
  ];

  const conversations = currentUser?.role === 'admin' ? adminConversations : userConversations;
  const currentChatData = conversations.find(c => c.id === selectedChat) || conversations[0];

  const [messages, setMessages] = useState([
    { id: 1, text: currentUser?.role === 'admin' ? "Hello, I need help with my account." : "Salam Amine, I saw your iPhone listing. Is it still available?", isMe: false, time: "10:30 AM" },
    { id: 2, text: currentUser?.role === 'admin' ? "Sure, what seems to be the problem?" : "Walikoum Salam! Yes it is. The price is slightly negotiable.", isMe: true, time: "10:32 AM" }
  ]);

  // Reset messages when switching mock users
  useEffect(() => {
     if(currentUser?.role === 'admin') {
         setMessages([
             { id: 1, text: "Why was my account suspended? I didn't do anything wrong!", isMe: false, time: "10:30 AM" },
             { id: 2, text: "Hello. Our systems detected suspicious activity regarding bulk messaging.", isMe: true, time: "10:35 AM" }
         ]);
     } else {
         setMessages([
             { id: 1, text: "Salam Amine, I saw your iPhone listing. Is it still available?", isMe: true, time: "10:30 AM" },
             { id: 2, text: "Walikoum Salam! Yes it is. The price is slightly negotiable.", isMe: false, time: "10:32 AM" }
         ]);
     }
  }, [currentUser, selectedChat]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  return (
    <div className="h-[80vh] max-h-[800px] bg-[#1e2025] border border-[#2a2e37] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-fade-in">
      {/* Sidebar - Inbox List */}
      <div className="w-full md:w-[350px] bg-[#16181d] border-r border-[#2a2e37] flex flex-col">
        {/* Header & Tabs */}
        <div className="p-4 border-b border-[#2a2e37] space-y-4 bg-[#16181d]">
          <div className="flex justify-between items-center">
             <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">
                    {currentUser?.role === 'admin' ? 'Support Inbox' : 'Messages'}
                </h2>
                {currentUser?.role === 'admin' && <Shield className="w-4 h-4 text-red-400" />}
             </div>
             {/* Mobile Close Button */}
             <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
             </button>
          </div>
          
          <div className="flex bg-[#0f1117] p-1 rounded-xl border border-[#2a2e37] space-x-1">
            <button 
              onClick={() => setActiveTab('buying')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'buying' ? 'bg-[#2a2e37] text-white shadow-sm ring-1 ring-white/5' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Buying
            </button>
            <button 
              onClick={() => setActiveTab('selling')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'selling' ? 'bg-[#2a2e37] text-white shadow-sm ring-1 ring-white/5' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Selling
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-[#0f1117] border border-[#2a2e37] rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto bg-[#16181d]">
          {conversations.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 flex items-center space-x-3 cursor-pointer transition-all border-b border-[#2a2e37]/50 ${
                selectedChat === chat.id 
                  ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' 
                  : 'hover:bg-[#2a2e37]/30 border-l-4 border-l-transparent'
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    (chat as any).isReport ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    (chat as any).isOfficial ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' :
                    'bg-gray-700 text-gray-300 border-gray-600'
                }`}>
                  {chat.avatar}
                </div>
                {/* Online Indicator */}
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#16181d] rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-center space-x-1">
                      <h3 className={`text-sm font-bold truncate ${selectedChat === chat.id ? 'text-indigo-400' : 'text-white'}`}>{chat.name}</h3>
                      {(chat as any).isReport && <Shield className="w-3 h-3 text-red-500" />}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                  {chat.message}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm shadow-indigo-500/50">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-[#0f1117] relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#2a2e37] flex justify-between items-center bg-[#16181d] shadow-sm z-10">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${
                (currentChatData as any).isReport ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
            }`}>
              {currentChatData.avatar}
            </div>
            <div>
              <h3 className="font-bold text-white">{currentChatData.name}</h3>
              <p className="text-xs text-gray-400 flex items-center font-medium">
                {currentChatData.role} • 
                <span className="text-green-400 ml-1">Online</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {currentUser?.role === 'admin' && (
                <button className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1.5 rounded-lg border border-red-600/30 transition-colors mr-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-bold hidden lg:inline">Ban User</span>
                </button>
            )}
            <button className="p-2 hover:bg-[#2a2e37] rounded-lg text-gray-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            {/* Desktop Close Button */}
            <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors ml-2 hidden md:block" title="Close Chat">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f1117] relative">
          <div className="flex justify-center my-4">
            <span className="text-xs text-gray-500 bg-[#16181d] px-3 py-1 rounded-full border border-[#2a2e37] shadow-sm">Today</span>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start items-end'}`}>
              {!msg.isMe && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs mr-2 border border-gray-600 text-white mb-1">
                  {currentChatData.avatar}
                </div>
              )}
              <div className={`
                p-3.5 rounded-2xl max-w-[75%] shadow-md border relative
                ${msg.isMe 
                  ? 'bg-indigo-600 text-white border-indigo-500/50 rounded-tr-none' 
                  : 'bg-[#1e2025] text-gray-100 border-[#2a2e37] rounded-tl-none'}
              `}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] block mt-1 ${msg.isMe ? 'text-indigo-200 opacity-75 text-right' : 'text-gray-500'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#2a2e37] bg-[#16181d]">
          <div className="flex items-center space-x-2 bg-[#0f1117] border border-[#2a2e37] rounded-xl p-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
            <input 
              type="text" 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={currentUser?.role === 'admin' ? "Reply to user..." : "Type a message..."} 
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm px-4"
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};