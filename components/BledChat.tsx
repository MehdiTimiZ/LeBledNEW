import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from '@google/genai';

const SUGGESTIONS = [
  "Traduire 'Comment ça va?' en Darija",
  "Recette du Couscous Royal",
  "Histoire des Touaregs",
  "Lieux à visiter à Alger"
];

export const BledChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Salam! Je suis votre Assistant Bled. Comment puis-je vous aider aujourd\'hui ? Posez-moi des questions sur la culture, les recettes ou la traduction !',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const session = createChatSession();
      setChatSession(session);
      setConnectionError(null);
    } catch (e: any) {
      console.error("Failed to init chat", e);
      setConnectionError("Impossible de se connecter au service IA. Veuillez vérifier votre clé API.");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(chatSession, userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Désolé, j'ai du mal à me connecter au Bled en ce moment. Veuillez réessayer.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[450px] flex flex-col bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-[#334155] ring-1 ring-white/5">
      <div className="p-4 border-b border-[#334155] bg-[#1e293b] flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">Assistant Bled</h2>
            <p className="text-xs text-slate-400 flex items-center">
              {connectionError ? (
                <span className="flex items-center text-red-400">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Erreur Connexion
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                  En ligne & Prêt
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#0f172a]/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-700' : 'bg-primary-500/20'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-5 h-5 text-primary-400" />}
              </div>
              <div
                className={`p-4 rounded-2xl shadow-md border ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white border-primary-500 rounded-br-none'
                    : 'bg-[#1e293b] text-slate-100 border-[#334155] rounded-bl-none'
                } ${msg.isError ? 'border-red-500/50 bg-red-500/10 text-red-200' : ''}`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-primary-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-400" />
              </div>
              <div className="bg-[#1e293b] px-4 py-3 rounded-2xl rounded-bl-none border border-[#334155] shadow-sm flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length < 3 && !isLoading && !connectionError && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar bg-[#0f172a]/50">
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="whitespace-nowrap px-3 py-1.5 bg-[#1e293b] border border-[#334155] text-slate-300 text-xs rounded-full hover:bg-[#334155] hover:text-white transition-colors shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-[#334155] bg-[#1e293b]">
        <div className="flex items-center space-x-2 bg-[#0f172a] p-2 rounded-xl border border-[#334155] focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={connectionError ? "Service indisponible" : "Posez une question..."}
            className="flex-1 bg-transparent border-none focus:outline-none px-2 text-white placeholder-slate-500"
            disabled={isLoading || !!connectionError}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim() || !!connectionError}
            className={`p-2 rounded-lg transition-colors ${
              isLoading || !inputText.trim() || !!connectionError
                ? 'bg-[#1e293b] text-slate-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-500 shadow-md shadow-primary-500/20'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};