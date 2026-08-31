(function () {
    "use strict";

    function initChatFab() {
        if (document.getElementById("custom-chat-fab")) return;

        const style = document.createElement("style");
        style.innerHTML = `
            #chat-bubble-box {
                position: fixed !important;
                bottom: 88px !important;
                right: 26px !important;
                z-index: 2147483647 !important;
                pointer-events: none !important;
                opacity: 0 !important;
                visibility: visible !important;
                transform: translateY(12px) scale(.96);
                animation: chatBubbleIn .7s cubic-bezier(.22,1,.36,1) .2s forwards !important;
                transition: opacity .6s ease, transform .6s ease !important;
            }

            .chat-greeting-bubble {
                background: #fff !important;
                color: #333 !important;
                padding: 9px 14px !important;
                border-radius: 16px 16px 4px 16px !important;
                box-shadow: 0 5px 18px rgba(0,0,0,.14) !important;
                font-family: Arial, Helvetica, sans-serif !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                width: max-content !important;
                max-width: calc(100vw - 60px) !important;
                border: 1px solid #e5e5e5 !important;
            }

            .typing-text {
                display: inline-block !important;
                overflow: hidden !important;
                white-space: nowrap !important;
                border-right: 2px solid #25D366 !important;
                width: 0;
                animation:
                    typing 2.2s steps(30, end) .6s forwards,
                    blink .75s step-end infinite;
            }

            #custom-chat-fab {
                position: fixed !important;
                bottom: 26px !important;
                right: 26px !important;
                width: 48px !important;
                height: 48px !important;
                min-width: 48px !important;
                min-height: 48px !important;
                max-width: 48px !important;
                max-height: 48px !important;
                border-radius: 50% !important;
                background: #25D366 !important;
                color: #fff !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 7px 20px rgba(37,211,102,.28) !important;
                cursor: pointer !important;
                z-index: 2147483647 !important;
                opacity: 0 !important;
                visibility: visible !important;
                transform: translateY(15px) scale(.75) !important;
                animation: chatFabIn .7s cubic-bezier(.22,1,.36,1) .4s forwards !important;
                transition:
                    transform .3s cubic-bezier(.22,1,.36,1),
                    box-shadow .3s ease,
                    background .3s ease,
                    opacity .6s ease !important;
            }

            #custom-chat-fab:hover {
                background: #128C7E !important;
                transform: translateY(-3px) scale(1.08) !important;
                box-shadow: 0 12px 26px rgba(37,211,102,.35) !important;
            }

            #custom-chat-fab:active {
                transform: scale(.92) !important;
            }

            #custom-chat-fab svg {
                width: 25px !important;
                height: 25px !important;
                fill: #fff !important;
            }

            #custom-chat-fab.chat-hidden {
                opacity: 0 !important;
                transform: translateY(18px) scale(.75) !important;
                pointer-events: none !important;
            }

            #chat-bubble-box.chat-hidden {
                opacity: 0 !important;
                transform: translateY(12px) scale(.94) !important;
            }

            @keyframes chatFabIn {
                0% { opacity: 0; transform: translateY(15px) scale(.75); }
                70% { opacity: 1; transform: translateY(-2px) scale(1.04); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }

            @keyframes chatBubbleIn {
                0% { opacity: 0; transform: translateY(12px) scale(.94); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }

            @keyframes typing {
                from { width: 0; }
                to { width: 100%; } /* Smoothly types exactly to the container's width */
            }

            @keyframes blink {
                0%, 100% { border-color: transparent; }
                50% { border-color: #25D366; }
            }

            @media (max-width: 768px) {
                #chat-bubble-box { bottom: 78px !important; right: 18px !important; }
                #custom-chat-fab {
                    bottom: 18px !important; right: 18px !important;
                    width: 44px !important; height: 44px !important;
                    min-width: 44px !important; min-height: 44px !important;
                    max-width: 44px !important; max-height: 44px !important;
                }
                #custom-chat-fab svg { width: 23px !important; height: 23px !important; }
                .chat-greeting-bubble { font-size: 12px !important; padding: 8px 12px !important; }
            }

            @media (prefers-reduced-motion: reduce) {
                #custom-chat-fab, #chat-bubble-box {
                    animation: none !important;
                    opacity: 1 !important;
                    transform: none !important;
                }
                .typing-text { animation: none !important; width: auto !important; border: 0 !important; }
            }
        `;
        document.head.appendChild(style);

        // Greeting bubble
        const bubbleBox = document.createElement("div");
        bubbleBox.id = "chat-bubble-box";
        bubbleBox.innerHTML = `
            <div class="chat-greeting-bubble">
                <span class="typing-text">Hi there, how can I help you?</span>
            </div>
        `;
        
        // WhatsApp button
        const fabBtn = document.createElement("div");
        fabBtn.id = "custom-chat-fab";
        fabBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 438.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-71.8 18.8L70 351l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-103.1 84-187.1 187.1-187.1 50 0 97.1 19.5 132.6 54.9 35.4 35.5 54.9 82.6 54.9 132.7 0 103.1-83.9 187.1-187.1 187.1zm101.7-138.4c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.8-16.4-54.3-29.3-75.8-66.6-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.5 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.4-2.5-5.1-3.9-10.6-6.6z"/>
            </svg>
        `;

        // Append to body if it exists, otherwise html. Prevents framework overwrites.
        const root = document.body || document.documentElement;
        root.appendChild(bubbleBox);
        root.appendChild(fabBtn);

        // WhatsApp click
        fabBtn.addEventListener("click", function () {
            const message = encodeURIComponent(
                "Hello! I'm visiting your website and I need some help with a subscription."
            );
            window.open(
                `https://wa.me/8801644490566?text=${message}`,
                "_blank",
                "noopener,noreferrer"
            );
        });

        // Hide after 12 seconds
        setTimeout(() => {
            fabBtn.classList.add("chat-hidden");
            bubbleBox.classList.add("chat-hidden");

            // Completely remove from DOM after fade-out animation finishes
            setTimeout(() => {
                if (fabBtn) fabBtn.remove();
                if (bubbleBox) bubbleBox.remove();
            }, 650); 
        }, 12000);
    }

    // Ensure the script runs only after the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatFab);
    } else {
        initChatFab();
    }

})();
