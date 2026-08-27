(function () {
    "use strict";

    // Prevent injecting twice if already present
    if (document.getElementById('whatsappFab')) return;

    // 1. Inject CSS Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .whatsapp-bubble-container {
            position: fixed;
            bottom: 105px;
            right: 30px;
            z-index: 99;
            animation: fadeInBubble 0.6s ease-out forwards;
        }
        .ai-greeting-bubble {
            background: #ffffff;
            color: #333333;
            padding: 10px 16px;
            border-radius: 18px 18px 4px 18px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            border: 1px solid #e0e0e0;
        }
        .typing-text {
            display: inline-block;
            overflow: hidden;
            border-right: 2px solid #25D366;
            width: 0;
            animation: typing 2.5s steps(30, end) forwards, blink 0.75s step-end infinite;
        }
        @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
        }
        @keyframes blink {
            from, to { border-color: transparent; }
            50% { border-color: #25D366; }
        }
        @keyframes fadeInBubble {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .whatsapp-fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #25D366;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 100;
        }
        .whatsapp-fab:hover {
            background-color: #128C7E;
            transform: scale(1.1);
        }
        .whatsapp-fab i {
            font-size: 24px;
        }
        @media (max-width: 768px) {
            .whatsapp-bubble-container {
                bottom: 110px;
                right: 20px;
            }
            .whatsapp-fab {
                bottom: 30px;
                right: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Create HTML Elements
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="whatsapp-bubble-container">
            <div class="ai-greeting-bubble">
                <span class="typing-text">Hi there, how can I help you?</span>
            </div>
        </div>
        <div id="whatsappFab" class="whatsapp-fab" onclick="sendGlobalToWhatsApp()">
            <i class="fa-brands fa-whatsapp"></i>
        </div>
    `;
    document.body.appendChild(container);
})();

// 3. Global WhatsApp Redirect Function
function sendGlobalToWhatsApp() {
    const message = encodeURIComponent("Hello! I'm visiting your website and I need some help with a subscription.");
    window.open(`https://wa.me/8801644490566?text=${message}`, '_blank');
}