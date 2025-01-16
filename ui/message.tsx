import { MessageView } from "tinychat/api/types/chat/tinychat/server/defs.ts";

export const Message = ({ message }: { message: MessageView }) => (
  <div id="messages" hx-swap-oob="beforeend">
    {message.text}
  </div>
);

{
  /* <div id="chat-message-25609" class="chat-message flex items-start mb-4 text-sm">
<img src="https://ui-avatars.com/api/?name=HashSlingingSlasher&amp;background=random&amp;size=256" class="w-10 h-10 rounded mr-3">   <div class="flex-1 overflow-hidden">
     <div>
<span class="font-bold">HashSlingingSlasher</span><span x-text="Intl.DateTimeFormat(navigator.language, { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false  }).format(new Date(1732748660151))" class="pl-2 text-grey text-xs">27 November at 23:04</span>     </div>
     <div class="leading-relaxed"><p>Toast to Portugal with a glass of <strong>Porto Tonic</strong>—white port, tonic water, and lime. Refreshing! 🍹</p></div>
   </div>
 </div> */
}
