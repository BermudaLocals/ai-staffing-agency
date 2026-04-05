/**
 * AI Customer Support Widget
 * Embeddable chat widget for websites
 * 
 * Usage:
 * <script src="https://yourdomain.com/widget.js" data-api-key="YOUR_API_KEY" async></script>
 */

(function() {
  'use strict';

  // Configuration
  const WIDGET_ID = 'ai-support-widget';
  const API_BASE = window.AI_SUPPORT_API || 'https://api.aisupport.com';

  // Get config from script tag
  function getConfig() {
    const script = document.currentScript || document.querySelector('script[data-api-key]');
    return {
      apiKey: script?.getAttribute('data-api-key') || '',
      primaryColor: script?.getAttribute('data-color') || '#4F46E5',
      position: script?.getAttribute('data-position') || 'bottom-right',
      welcomeMessage: script?.getAttribute('data-welcome') || 'Hi! 👋 How can I help you today?',
      businessName: script?.getAttribute('data-name') || 'Support',
    };
  }

  // Inject styles
  function injectStyles(config) {
    const styles = `
      #${WIDGET_ID} {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        box-sizing: border-box;
      }
      #${WIDGET_ID} * {
        box-sizing: border-box;
      }
      .aiw-container {
        position: fixed;
        bottom: 24px;
        ${config.position === 'bottom-left' ? 'left: 24px;' : 'right: 24px;'}
        z-index: 999999;
      }
      .aiw-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${config.primaryColor};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .aiw-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 25px rgba(0,0,0,0.2);
      }
      .aiw-button svg {
        width: 28px;
        height: 28px;
        fill: white;
      }
      .aiw-window {
        position: absolute;
        bottom: 80px;
        ${config.position === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
        width: 380px;
        max-width: calc(100vw - 48px);
        height: 550px;
        max-height: calc(100vh - 120px);
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      .aiw-window.open {
        display: flex;
        animation: aiw-slide-up 0.3s ease;
      }
      @keyframes aiw-slide-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .aiw-header {
        background: ${config.primaryColor};
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .aiw-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .aiw-avatar {
        width: 44px;
        height: 44px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .aiw-avatar svg {
        width: 24px;
        height: 24px;
        fill: white;
      }
      .aiw-header-text h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      .aiw-header-text p {
        margin: 4px 0 0;
        font-size: 12px;
        opacity: 0.8;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .aiw-status-dot {
        width: 8px;
        height: 8px;
        background: #4ade80;
        border-radius: 50%;
      }
      .aiw-close {
        background: rgba(255,255,255,0.1);
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      .aiw-close:hover {
        background: rgba(255,255,255,0.2);
      }
      .aiw-close svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      .aiw-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f9fafb;
      }
      .aiw-message {
        margin-bottom: 12px;
        display: flex;
      }
      .aiw-message.user {
        justify-content: flex-end;
      }
      .aiw-message-bubble {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.5;
      }
      .aiw-message.ai .aiw-message-bubble {
        background: white;
        color: #1f2937;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .aiw-message.user .aiw-message-bubble {
        background: ${config.primaryColor};
        color: white;
        border-bottom-right-radius: 4px;
      }
      .aiw-message-time {
        font-size: 11px;
        margin-top: 4px;
        opacity: 0.6;
      }
      .aiw-typing {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
        background: white;
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        width: fit-content;
      }
      .aiw-typing span {
        width: 8px;
        height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: aiw-bounce 1.4s infinite ease-in-out;
      }
      .aiw-typing span:nth-child(1) { animation-delay: 0s; }
      .aiw-typing span:nth-child(2) { animation-delay: 0.2s; }
      .aiw-typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes aiw-bounce {
        0%, 80%, 100% { transform: scale(0.8); }
        40% { transform: scale(1.2); }
      }
      .aiw-input-area {
        padding: 16px;
        background: white;
        border-top: 1px solid #e5e7eb;
      }
      .aiw-input-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .aiw-input {
        flex: 1;
        padding: 12px 16px;
        border: none;
        background: #f3f4f6;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
      }
      .aiw-input:focus {
        box-shadow: 0 0 0 2px ${config.primaryColor}40;
      }
      .aiw-send {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${config.primaryColor};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s;
      }
      .aiw-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .aiw-send svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      .aiw-powered {
        text-align: center;
        padding: 8px;
        font-size: 11px;
        color: #9ca3af;
        border-top: 1px solid #e5e7eb;
      }
      .aiw-powered a {
        color: #6b7280;
        text-decoration: none;
        font-weight: 500;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  // Icons
  const icons = {
    chat: '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
    bot: '<svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/></svg>',
  };

  // Create widget
  function createWidget(config) {
    const container = document.createElement('div');
    container.id = WIDGET_ID;
    container.innerHTML = `
      <div class="aiw-container">
        <div class="aiw-window">
          <div class="aiw-header">
            <div class="aiw-header-info">
              <div class="aiw-avatar">${icons.bot}</div>
              <div class="aiw-header-text">
                <h3>${config.businessName}</h3>
                <p><span class="aiw-status-dot"></span> Online</p>
              </div>
            </div>
            <button class="aiw-close">${icons.close}</button>
          </div>
          <div class="aiw-messages"></div>
          <div class="aiw-input-area">
            <div class="aiw-input-wrapper">
              <input type="text" class="aiw-input" placeholder="Type a message..." />
              <button class="aiw-send" disabled>${icons.send}</button>
            </div>
          </div>
          <div class="aiw-powered">Powered by <a href="#">AI Support</a></div>
        </div>
        <button class="aiw-button">${icons.chat}</button>
      </div>
    `;
    document.body.appendChild(container);
    return container;
  }

  // Widget controller
  class AIWidget {
    constructor(config) {
      this.config = config;
      this.messages = [];
      this.isOpen = false;
      this.conversationId = null;

      injectStyles(config);
      this.container = createWidget(config);
      this.bindEvents();
    }

    bindEvents() {
      const button = this.container.querySelector('.aiw-button');
      const closeBtn = this.container.querySelector('.aiw-close');
      const input = this.container.querySelector('.aiw-input');
      const sendBtn = this.container.querySelector('.aiw-send');

      button.addEventListener('click', () => this.toggle());
      closeBtn.addEventListener('click', () => this.close());
      input.addEventListener('input', (e) => {
        sendBtn.disabled = !e.target.value.trim();
      });
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      });
      sendBtn.addEventListener('click', () => this.send());
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.isOpen = true;
      const window = this.container.querySelector('.aiw-window');
      const button = this.container.querySelector('.aiw-button');
      window.classList.add('open');
      button.innerHTML = icons.close;

      if (this.messages.length === 0) {
        this.addMessage(this.config.welcomeMessage, 'ai');
      }

      setTimeout(() => {
        this.container.querySelector('.aiw-input').focus();
      }, 100);
    }

    close() {
      this.isOpen = false;
      const window = this.container.querySelector('.aiw-window');
      const button = this.container.querySelector('.aiw-button');
      window.classList.remove('open');
      button.innerHTML = icons.chat;
    }

    addMessage(content, sender) {
      const message = {
        id: Date.now(),
        content,
        sender,
        timestamp: new Date(),
      };
      this.messages.push(message);
      this.renderMessage(message);
    }

    renderMessage(message) {
      const messagesEl = this.container.querySelector('.aiw-messages');
      const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const messageEl = document.createElement('div');
      messageEl.className = `aiw-message ${message.sender}`;
      messageEl.innerHTML = `
        <div class="aiw-message-bubble">
          ${message.content}
          <div class="aiw-message-time">${time}</div>
        </div>
      `;
      messagesEl.appendChild(messageEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    showTyping() {
      const messagesEl = this.container.querySelector('.aiw-messages');
      const typingEl = document.createElement('div');
      typingEl.className = 'aiw-message ai';
      typingEl.id = 'aiw-typing';
      typingEl.innerHTML = '<div class="aiw-typing"><span></span><span></span><span></span></div>';
      messagesEl.appendChild(typingEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    hideTyping() {
      const typingEl = this.container.querySelector('#aiw-typing');
      if (typingEl) typingEl.remove();
    }

    async send() {
      const input = this.container.querySelector('.aiw-input');
      const sendBtn = this.container.querySelector('.aiw-send');
      const content = input.value.trim();

      if (!content) return;

      input.value = '';
      sendBtn.disabled = true;

      this.addMessage(content, 'user');
      this.showTyping();

      try {
        const response = await this.callAPI(content);
        this.hideTyping();
        this.addMessage(response, 'ai');
      } catch (error) {
        this.hideTyping();
        this.addMessage('Sorry, something went wrong. Please try again.', 'ai');
      }
    }

    async callAPI(message) {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const responses = [
        "I'd be happy to help you with that! Could you provide more details?",
        "Thanks for reaching out! Let me look into that for you.",
        "Great question! Based on our knowledge base, here's what I found...",
        "I understand your concern. Let me help you resolve this.",
        "Sure thing! Is there anything specific you'd like to know?",
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Initialize
  function init() {
    if (document.getElementById(WIDGET_ID)) return;
    const config = getConfig();
    if (!config.apiKey) {
      console.warn('AI Support Widget: No API key provided');
    }
    window.AIWidget = new AIWidget(config);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
