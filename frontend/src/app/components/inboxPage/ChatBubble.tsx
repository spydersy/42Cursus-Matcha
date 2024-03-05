import LeftChatBubble from "./LeftChatBubble";
import RightChatBubble from "./RightChatBubble";

export default function ChatBubble({ messageObj, leftBubble }: { messageObj: { fullName: string, message: string, picture: string, time: string, status: string, leftBubble: boolean }, leftBubble: boolean }) {
    return (
        <div className="width-100">
            {leftBubble ? <LeftChatBubble messageObj={messageObj} /> : <RightChatBubble messageObj={messageObj} />}
        </div>
    );
}
