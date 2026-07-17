import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, ArrowUp } from 'lucide-react';
import './FloatingWidgets.css';

const BOT_MSGS = [
  "Hi there! 👋 Welcome to NVape Australia. How can I help you today?",
  "We stock a huge range of disposable vapes, pod kits, and liquids. Looking for anything specific?",
  "We offer FREE shipping on orders over $50! 🚚",
];

export default function FloatingWidgets() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ from:'agent', text: BOT_MSGS[0], time: now() }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const msgEnd = useRef(null);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, typing]);

  function now() {
    return new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  }

  const sendMsg = () => {
    if (!input.trim()) return;
    const userMsg = { from:'user', text: input.trim(), time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = BOT_MSGS[Math.floor(Math.random() * BOT_MSGS.length)];
      setMessages(prev => [...prev, { from:'agent', text: reply, time: now() }]);
    }, 1400);
  };

  return (
    <div className="floating-widgets">
      {showScrollTop && (
        <button className="widget-btn scroll-top-btn" onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} title="Back to top">
          <ArrowUp size={20} />
        </button>
      )}

      <a href="https://t.me/nvapeaustralia" target="_blank" rel="noreferrer" className="widget-btn telegram-btn" title="Telegram">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
      </a>

      <a href="https://wa.me/61400000000" target="_blank" rel="noreferrer" className="widget-btn whatsapp-btn" title="WhatsApp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
      </a>

      <button className={`widget-btn chat-btn${chatOpen ? ' active' : ''}`} onClick={() => setChatOpen(v => !v)} title="Live Chat">
        {chatOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="agent-info">
              <div className="agent-avatar">N</div>
              <div>
                <p className="agent-name">NVape Support</p>
                <p className="agent-status">● Online</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setChatOpen(false)}><X size={18} /></button>
          </div>
          <div className="chat-body">
            {messages.map((m,i) => (
              <div key={i} className={`chat-bubble-container ${m.from}`}>
                <div className={`chat-bubble ${m.from}`}>
                  <p className="chat-text">{m.text}</p>
                  <span className="chat-time">{m.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="chat-bubble-container agent">
                <div className="chat-bubble agent typing">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}
            <div ref={msgEnd} />
          </div>
          <div className="chat-footer flex gap-2 items-center">
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
            />
            <button className="chat-send-btn" onClick={sendMsg}><Send size={15} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
