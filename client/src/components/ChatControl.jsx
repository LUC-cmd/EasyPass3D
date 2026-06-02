import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function ChatControl({ onCommand }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Salut! Je suis ton assistant de contrôle EasyPass 3D. Dis-moi ce que tu veux faire: modifier le scénario, ajuster la météo, ou comparer des stratégies.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
        sessionId: 'default-session'
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);

      // Apply commands received from Claude
      if (response.data.commands && response.data.commands.length > 0) {
        response.data.commands.forEach(cmd => onCommand(cmd));
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Erreur de communication.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-1/2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3">
        <h2 className="text-lg font-bold text-white">💬 Contrôle par Chat</h2>
        <p className="text-purple-100 text-xs">Commandes en langage naturel</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-gray-400 px-4 py-2 rounded-lg text-sm rounded-bl-none">
              Claude réfléchit...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-3 bg-slate-900">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Essaie: 'Active le scénario rush' ou 'Montre la pluie'..."
            className="flex-1 bg-slate-700 text-white rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="2"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold disabled:opacity-50 transition"
          >
            ⬆
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatControl;
