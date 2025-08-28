// Enhanced Chatbot Functionality
class MatrixChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.responses = {
            greetings: [
                "Hello! I'm Zaryab's AI assistant. How can I help you today?",
                "Greetings, human! Ready to explore the digital realm?",
                "Welcome to the matrix! What brings you here today?"
            ],
            about: [
                "Zaryab is a passionate developer specializing in AI, cybersecurity, and web development.",
                "He has 5+ years of experience in machine learning and full-stack development.",
                "His expertise spans from neural networks to penetration testing!"
            ],
            projects: [
                "Zaryab has worked on 50+ projects including AI systems, web applications, and security tools.",
                "His featured projects include anomaly detection systems and predictive analytics platforms.",
                "Check out the Projects section in the navigation to explore his work!"
            ],
            contact: [
                "You can reach Zaryab through the Contact page or connect on LinkedIn.",
                "He's always open to discussing new opportunities and collaborations.",
                "Feel free to send a message about your project ideas!"
            ],
            skills: [
                "Zaryab's tech stack includes Python, JavaScript, React, Django, TensorFlow, and more.",
                "He specializes in machine learning, cybersecurity, and full-stack development.",
                "His skills range from AI algorithms to penetration testing techniques."
            ],
            default: [
                "That's an interesting question! You might find more details in the navigation menu.",
                "I'm still learning! Try asking about Zaryab's projects, skills, or how to contact him.",
                "Hmm, I'm not sure about that. Would you like to know about Zaryab's expertise instead?"
            ]
        };
        this.init();
    }

    init() {
        this.createChatInterface();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatInterface() {
        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'chat-window';
        chatWindow.className = 'fixed bottom-24 right-6 w-80 h-96 bg-black bg-opacity-95 border-2 border-neon-green rounded-lg hidden z-50 flex flex-col backdrop-blur-sm';
        
        // Chat header
        const chatHeader = document.createElement('div');
        chatHeader.className = 'bg-neon-green text-black p-3 rounded-t-lg flex justify-between items-center';
        chatHeader.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-robot mr-2"></i>
                <span class="font-bold">Matrix Assistant</span>
            </div>
            <button id="close-chat" class="text-black hover:text-gray-700 transition-colors">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Chat messages container
        const chatMessages = document.createElement('div');
        chatMessages.id = 'chat-messages';
        chatMessages.className = 'flex-1 p-4 overflow-y-auto space-y-3';
        
        // Chat input container
        const chatInput = document.createElement('div');
        chatInput.className = 'p-3 border-t border-neon-green';
        chatInput.innerHTML = `
            <div class="flex space-x-2">
                <input type="text" id="chat-input" placeholder="Type your message..." 
                       class="flex-1 bg-transparent border border-neon-green rounded px-3 py-2 text-neon-green placeholder-gray-400 focus:outline-none focus:border-white">
                <button id="send-message" class="bg-neon-green text-black px-4 py-2 rounded hover:bg-opacity-80 transition-colors">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        
        // Assemble chat window
        chatWindow.appendChild(chatHeader);
        chatWindow.appendChild(chatMessages);
        chatWindow.appendChild(chatInput);
        
        // Add to document
        document.body.appendChild(chatWindow);
        
        // Add quick action buttons
        this.addQuickActions();
    }

    addQuickActions() {
        const quickActions = document.createElement('div');
        quickActions.id = 'quick-actions';
        quickActions.className = 'p-3 border-t border-neon-green bg-black bg-opacity-50';
        quickActions.innerHTML = `
            <div class="text-xs text-gray-400 mb-2">Quick Actions:</div>
            <div class="flex flex-wrap gap-2">
                <button class="quick-btn px-2 py-1 bg-neon-green bg-opacity-20 text-neon-green text-xs rounded hover:bg-opacity-40 transition-colors" data-message="Tell me about Zaryab">About</button>
                <button class="quick-btn px-2 py-1 bg-neon-green bg-opacity-20 text-neon-green text-xs rounded hover:bg-opacity-40 transition-colors" data-message="Show me his projects">Projects</button>
                <button class="quick-btn px-2 py-1 bg-neon-green bg-opacity-20 text-neon-green text-xs rounded hover:bg-opacity-40 transition-colors" data-message="What are his skills?">Skills</button>
                <button class="quick-btn px-2 py-1 bg-neon-green bg-opacity-20 text-neon-green text-xs rounded hover:bg-opacity-40 transition-colors" data-message="How can I contact him?">Contact</button>
            </div>
        `;
        
        const chatWindow = document.getElementById('chat-window');
        chatWindow.insertBefore(quickActions, chatWindow.lastElementChild);
    }

    bindEvents() {
        // Chatbot toggle
        const chatbotBtn = document.getElementById('chatbot');
        chatbotBtn.addEventListener('click', () => this.toggleChat());
        
        // Close chat
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-chat') {
                this.closeChat();
            }
        });
        
        // Send message
        document.addEventListener('click', (e) => {
            if (e.target.id === 'send-message') {
                this.sendMessage();
            }
        });
        
        // Enter key to send
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'chat-input' && e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Quick action buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const message = e.target.getAttribute('data-message');
                this.processMessage(message);
            }
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.remove('hidden');
        chatWindow.classList.add('flex');
        this.isOpen = true;
        
        // Focus input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 100);
        
        // Add opening animation
        chatWindow.style.transform = 'scale(0.8) translateY(20px)';
        chatWindow.style.opacity = '0';
        setTimeout(() => {
            chatWindow.style.transform = 'scale(1) translateY(0)';
            chatWindow.style.opacity = '1';
            chatWindow.style.transition = 'all 0.3s ease';
        }, 10);
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.style.transform = 'scale(0.8) translateY(20px)';
        chatWindow.style.opacity = '0';
        
        setTimeout(() => {
            chatWindow.classList.add('hidden');
            chatWindow.classList.remove('flex');
            this.isOpen = false;
        }, 300);
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('bot', this.responses.greetings[0]);
        }, 1000);
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage('user', message);
            input.value = '';
            
            // Process message after a short delay
            setTimeout(() => {
                this.processMessage(message);
            }, 500);
        }
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response;
        
        // Determine response category
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = this.getRandomResponse('greetings');
        } else if (lowerMessage.includes('about') || lowerMessage.includes('who') || lowerMessage.includes('zaryab')) {
            response = this.getRandomResponse('about');
        } else if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio')) {
            response = this.getRandomResponse('projects');
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
            response = this.getRandomResponse('contact');
        } else if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
            response = this.getRandomResponse('skills');
        } else {
            response = this.getRandomResponse('default');
        }
        
        this.addMessage('bot', response);
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex justify-end">
                    <div class="bg-neon-green text-black px-3 py-2 rounded-lg max-w-xs">
                        ${text}
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-2">
                    <div class="w-8 h-8 bg-neon-green bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-robot text-neon-green text-xs"></i>
                    </div>
                    <div class="bg-gray-800 text-neon-green px-3 py-2 rounded-lg max-w-xs">
                        ${text}
                    </div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add typing animation for bot messages
        if (sender === 'bot') {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(10px)';
            setTimeout(() => {
                messageDiv.style.opacity = '1';
                messageDiv.style.transform = 'translateY(0)';
                messageDiv.style.transition = 'all 0.3s ease';
            }, 100);
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MatrixChatbot();
});

// Add some matrix-style effects to the chatbot
function addMatrixEffects() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
        // Add subtle matrix rain effect to chat header
        const header = chatWindow.querySelector('.bg-neon-green');
        if (header) {
            header.style.background = 'linear-gradient(45deg, #00ff41, #00cc33)';
            header.style.backgroundSize = '200% 200%';
            header.style.animation = 'gradient-shift 3s ease infinite';
        }
    }
}

// CSS animation for gradient shift
const style = document.createElement('style');
style.textContent = `
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .message {
        animation: fadeInUp 0.3s ease;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

