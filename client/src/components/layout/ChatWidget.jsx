import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PaperAirplaneIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
// Import the bottle image for chat icon
import bottleIcon from '../../assets/images/Gif-Logo.gif';
import chatbottle from '../../assets/images/1738267065367-pixelcut-export.png';
import chatIcon from '../../assets/images/message.png';

// Typing indicator component with bouncing dots
const TypingIndicator = () => (
  <div className="flex items-center justify-start mb-3">
    <img src={chatbottle} alt="Bot" className="h-6 w-6 mr-2 object-contain self-end" />
    <div className="bg-gray-200 rounded-lg px-4 py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

// Text reveal component for bot messages
const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 15);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);
  
  return displayedText;
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { content: "Hi there, welcome to Liquor Online. How can I help?", isBot: true, isNew: false }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Ensure typing indicator is not shown when opening chat
    setIsTyping(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add the user message
    setMessages(prev => [...prev, { content: newMessage, isBot: false, isNew: false }]);
    setNewMessage('');
    
    // Show typing indicator only after user sends a message
    setIsTyping(true);
    
    // Mock response after a short delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { 
          content: "Thanks for your message! One of our representatives will get back to you shortly. For immediate assistance, please call us at 1-800-123-4567.", 
          isBot: true,
          isNew: true
        }
      ]);
    }, 2000);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#A75D5D] text-white shadow-lg flex items-center justify-center overflow-hidden"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with us"
      >
        {isOpen ? (
          <ChevronDownIcon className="h-12 w-12 p-2 font-bold text-white" />
        ) : (
          <img src={chatIcon} alt="Chat with us" className="h-12 w-12 object-contain p-2" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-8 z-50 w-80 bg-white rounded-lg shadow-xl overflow-hidden font-['Open_Sans',sans-serif] font-normal text-[rgb(134,134,134)] text-[14px] leading-[25px]"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat Header */}
            <div className="bg-[#A75D5D] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <img src={chatbottle} alt="Liquor Online" className="h-7 w-7 mr-2 object-contain" />
                <span className="font-bold">Liquor Online</span>
              </div>
              <button 
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex items-center flex-col bg-gray-50 py-5">
                <img src={chatbottle} alt="Liquor Online" className="h-7 w-7 mr-2 object-contain" />
                <span className="font-bold text-black">Liquor Online</span>
                <span className="font-medium text-[#868686]">Hi, how can I help you today?</span>
              </div>
            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-3 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <img src={chatbottle} alt="Bot" className="h-6 w-6 mr-2 object-contain self-end" />
                  )}
                  <div 
                    className={`max-w-3/4 rounded-lg px-4 py-2 ${
                      message.isBot 
                        ? 'bg-gray-200 text-dark' 
                        : 'bg-[#A75D5D] text-white'
                    }`}
                  >
                    {message.isBot && message.isNew ? (
                      <TypewriterText text={message.content} />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              
              {/* Show typing indicator only when bot is typing after user interaction */}
              {isTyping && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#A75D5D] focus:border-transparent"
              />
              <button 
                type="submit"
                className="bg-[#A75D5D] text-white px-4 py-2 rounded-r-md hover:bg-[#954d4d] transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget; 