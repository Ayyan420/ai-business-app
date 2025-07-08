import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot,
  User,
  Sparkles
} from 'lucide-react';

interface ConversationalInterfaceProps {
  onClose: () => void;
  user: { id: string; name: string; email: string; avatar?: string } | null;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({ onClose, user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi ${user?.name || 'there'}! I'm your AI Business Assistant. I can help you with marketing, finance, strategy, and operations. What would you like to work on today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickSuggestions = [
    "Create an ad campaign for my product",
    "Generate an invoice template",
    "Help me plan my growth strategy",
    "Optimize my team's workflow"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    setIsTyping(true);
    setInputMessage('');
    
    // Simulate AI response with more realistic responses
    setTimeout(() => {
      setIsTyping(false);
      
      let responseContent = '';
      
      const input = inputMessage.toLowerCase();
      
      if (input.includes('ad') || input.includes('marketing') || input.includes('campaign')) {
        responseContent = `Great! I can help you create compelling ad copy. Let me generate some options for you:\n\n**Option 1:** "Transform your business with cutting-edge AI solutions. Join 10,000+ satisfied customers who've increased productivity by 300%. Start your free trial today!"\n\n**Option 2:** "Stop wasting time on repetitive tasks. Our AI assistant handles marketing, finance, and operations so you can focus on growth. Try it free for 14 days."\n\nWould you like me to customize these for your specific audience or create variations?`;
      } else if (input.includes('invoice') || input.includes('billing') || input.includes('payment')) {
        responseContent = `I'll help you create a professional invoice! Here's what I need:\n\n• Client name and contact details\n• Services/products provided\n• Amount and payment terms\n• Your business information\n\nI can generate a PDF invoice with your branding. Would you like to start with a template or create a custom design?`;
      } else if (input.includes('strategy') || input.includes('plan') || input.includes('growth')) {
        responseContent = `Excellent! Let's develop a strategic plan for your business. I'll need to understand:\n\n1. Your current business stage (startup, growth, established)\n2. Primary goals for the next 6-12 months\n3. Main challenges you're facing\n4. Target market and competition\n\nBased on this, I can create a comprehensive growth strategy with actionable steps.`;
      } else if (input.includes('workflow') || input.includes('operations') || input.includes('task') || input.includes('productivity')) {
        responseContent = `Perfect! I can help optimize your operations. Let me analyze your current workflows:\n\n• Task management and delegation\n• Process automation opportunities\n• Team productivity metrics\n• Resource allocation\n\nI'll identify bottlenecks and suggest improvements that could save you 10+ hours per week. What's your biggest operational challenge right now?`;
      } else if (input.includes('email') || input.includes('newsletter')) {
        responseContent = `I can help you create effective email campaigns! Here are some options:\n\n**Welcome Series**: Onboard new customers with a 5-email sequence\n**Newsletter**: Weekly updates with valuable content\n**Promotional**: Special offers and product announcements\n**Re-engagement**: Win back inactive subscribers\n\nWhat type of email campaign would you like to create? I can help with subject lines, content, and timing.`;
      } else if (input.includes('social media') || input.includes('social')) {
        responseContent = `Let's boost your social media presence! I can help with:\n\n📱 **Platform-specific content**:\n• LinkedIn: Professional insights and industry news\n• Instagram: Visual storytelling and behind-the-scenes\n• Twitter: Quick tips and engagement\n• Facebook: Community building and customer stories\n\n🎯 **Content types**:\n• Educational posts\n• Product showcases\n• Customer testimonials\n• Industry trends\n\nWhich platform and content type interests you most?`;
      } else if (input.includes('budget') || input.includes('finance') || input.includes('money')) {
        responseContent = `I'll help you manage your finances effectively! Here's what I can assist with:\n\n💰 **Budget Planning**:\n• Monthly/quarterly budget allocation\n• Expense tracking and categorization\n• ROI analysis for marketing spend\n• Cash flow forecasting\n\n📊 **Financial Reports**:\n• Profit & loss statements\n• Revenue analysis\n• Cost optimization recommendations\n\nWhat specific financial area would you like to focus on?`;
      } else if (input.includes('team') || input.includes('employee') || input.includes('staff')) {
        responseContent = `Great! Let's optimize your team management. I can help with:\n\n👥 **Team Organization**:\n• Role definitions and responsibilities\n• Performance tracking systems\n• Communication workflows\n• Meeting optimization\n\n📈 **Productivity Enhancement**:\n• Task delegation strategies\n• Skill development plans\n• Motivation and engagement tactics\n• Remote work best practices\n\nWhat's your biggest team management challenge right now?`;
      } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        responseContent = `Hello! 👋 I'm your AI Business Assistant, ready to help you grow your business. I can assist with:\n\n🎯 **Marketing**: Ad copy, social media, email campaigns\n💰 **Finance**: Invoices, budgets, financial planning\n📊 **Strategy**: Growth plans, market analysis\n⚙️ **Operations**: Task management, workflow optimization\n\nWhat would you like to work on today?`;
      } else if (input.includes('help') || input.includes('what can you do')) {
        responseContent = `I'm here to help with all aspects of your business! Here's what I can do:\n\n🎨 **Marketing Tools**:\n• Generate ad copy and social media content\n• Create email campaigns and newsletters\n• Develop marketing strategies\n\n💼 **Finance Management**:\n• Create professional invoices\n• Track expenses and budgets\n• Generate financial reports\n\n🎯 **Strategic Planning**:\n• Develop growth strategies\n• Analyze competitors\n• Create business plans\n\n⚙️ **Operations**:\n• Manage tasks and workflows\n• Optimize processes\n• Team coordination\n\nJust tell me what you need help with!`;
      } else {
        responseContent = `I understand you're looking for help with "${inputMessage}". Let me provide some guidance:\n\n🔍 **I can help you with**:\n• **Marketing**: Create compelling content and campaigns\n• **Finance**: Manage invoices, budgets, and financial planning\n• **Strategy**: Develop growth plans and business strategies\n• **Operations**: Optimize workflows and manage tasks\n\n💡 **Try asking me about**:\n• "Create an ad campaign for my product"\n• "Help me generate an invoice"\n• "I need a marketing strategy"\n• "How can I optimize my workflow?"\n\nWhat specific business challenge can I help you solve today?`;
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, Math.random() * 1000 + 1000); // Random delay between 1-2 seconds for more natural feel
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">AI Business Assistant</h2>
              <p className="text-sm text-slate-500">Always here to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' ? 'bg-blue-600' : 'bg-slate-200'
                }`}>
                  {message.sender === 'user' ? (
                    user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )
                  ) : (
                    <Bot className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-slate-600" />
                </div>
                <div className="px-4 py-2 bg-slate-100 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Quick suggestions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalInterface;