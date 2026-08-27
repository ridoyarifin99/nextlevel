(function () {
    "use strict";

    // Prevent injecting twice if already present
    if (document.getElementById('custom-chat-fab')) return;

    // 1. Inject CSS Styles
    const style = document.createElement('style');
    style.innerHTML = `
        #chat-bubble-box {
            position: fixed;
            bottom: 105px;
            right: 30px;
            z-index: 2147483647; /* Max possible z-index */
            animation: fadeInBubble 0.6s ease-out forwards;
            pointer-events: none; /* Allows clicks to pass through empty space */
        }
        .chat-greeting-bubble {
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
        #custom-chat-fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px !important;
            height: 60px !important;
            border-radius: 50% !important;
            background-color: #25D366 !important; /* Forces color */
            color: white !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 2147483647;
            pointer-events: auto; /* Re-enables clicks on the button itself */
        }
        #custom-chat-fab:hover {
            background-color: #128C7E !important;
            transform: scale(1.1);
        }
        #custom-chat-fab svg {
            width: 32px;
            height: 32px;
            fill: white !important;
        }
        @media (max-width: 768px) {
            #chat-bubble-box {
                bottom: 110px;
                right: 20px;
            }
            #custom-chat-fab {
                bottom: 30px;
                right: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Create Elements directly in the body (Prevents theme wrappers from trapping them)
    const bubbleBox = document.createElement('div');
    bubbleBox.id = 'chat-bubble-box';
    bubbleBox.innerHTML = `
        <div class="chat-greeting-bubble">
            <span class="typing-text">Hi there, how can I help you?</span>
        </div>
    `;
    document.body.appendChild(bubbleBox);

    const fabBtn = document.createElement('div');
    fabBtn.id = 'custom-chat-fab';
    fabBtn.innerHTML = `
        <!-- Inline SVG Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 448 512">
            <path fill="white" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 438.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-71.8 18.8L70 351l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-103.1 84-187.1 187.1-187.1 50 0 97.1 19.5 132.6 54.9 35.4 35.5 54.9 82.6 54.9 132.7 0 103.1-83.9 187.1-187.1 187.1zm101.7-138.4c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.8-16.4-54.3-29.3-75.8-66.6-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.5 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.4-2.5-5.1-3.9-10.6-6.6z"/>
        </svg>
    `;
    document.body.appendChild(fabBtn);

    // 3. Attach click event programmatically
    document.getElementById('custom-chat-fab').addEventListener('click', function () {
        const message = encodeURIComponent("Hello! I'm visiting your website and I need some help with a subscription.");
        window.open(`https://wa.me/8801644490566?text=${message}`, '_blank');
    });
})();