import ChatBubble from "./ChatBubble";
import ChatTextInput from "./ChatTextInput";

const conversation : [{fullName: string, message: string, picture: string, time: string, status: string, leftBubble: boolean}] = [
    {
        fullName: "Ayoub Amzil",
        message: "Hi, how are you?",
        picture: "/amzil.png",
        time: "10:30 PM",
        status: "Sent",
        leftBubble: true,
    },
    {
        fullName: "Achraf Belarif",
        message: "I am doing well, thank you for asking. How about you?",
        picture: "/achraf.jpg",
        time: "10:31 PM",
        status: "Sent",
        leftBubble: false,
    },
    {
        fullName: "Achraf Belarif",
        message: "How about you?",
        picture: "/achraf.jpg",
        time: "10:31 PM",
        status: "Sent",
        leftBubble: false,
    },
    {
        fullName: "Achraf Belarif",
        message: "Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you? Hi, how are you?",
        picture: "/achraf.jpg",
        time: "10:32 PM",
        status: "Sent",
        leftBubble: false,
    },
]


export default function ChatBox() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full" style={{backgroundColor: 'red'}}>
            <div>
                <ChatBubble messageObj={conversation[0]} leftBubble={true} />
            </div>
            <div>
                <ChatBubble messageObj={conversation[1]} leftBubble={false} />
            </div>
            <div>
                <ChatBubble messageObj={conversation[2]} leftBubble={false} />
            </div>
            <div>
                <ChatBubble messageObj={conversation[3]} leftBubble={false} />
            </div>
            {/* <ChatTextInput /> */}
        </div>
    );
}