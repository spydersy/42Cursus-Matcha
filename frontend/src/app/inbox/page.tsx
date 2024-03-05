import ChatBar from "../components/inboxPage/ChatBar";
import ChatBox from "../components/inboxPage/ChatBox";

const lastChats : [{fullName: string, lastDM: string, picture: string}] = [
    {
        fullName: "Ayoub Amzil",
        lastDM: "Hi, momkin ta3arof?",
        picture: "/amzil.png",
    },
    {
        fullName: "Ayoub Amzil",
        lastDM: "Hi, momkin ta3arof?",
        picture: "/amzil.png",
    },
    {
        fullName: "Ayoub Amzil",
        lastDM: "Hi, momkin ta3arof?",
        picture: "/amzil.png",
    },
    {
        fullName: "Ayoub Amzil",
        lastDM: "Hi, momkin ta3arof?",
        picture: "/amzil.png",
    },
    {
        fullName: "Ayoub Amzil",
        lastDM: "Hi, momkin ta3arof?",
        picture: "/amzil.png",
    },
    {
        fullName: "Ayoub Amzil",
        lastDM: "Hi, momkin ta3arof?",
        picture: "/amzil.png",
    },
    {
        fullName: "Ayoub Amzil",
        lastDM: "Hi, momkin ta3arof?",
        picture: "/amzil.png",
    },
    {
        fullName: "Ayoub Amzil",
        lastDM: "Hi, momkin ta3arof?",
        picture: "/amzil.png",
    },
];

export default function InboxPage() {
    return (
        <div className="flex justify-center w-full h-full">
            <div>
                <ChatBar dms={lastChats} />
            </div>
            <div>
                <ChatBox />
            </div>
        </div>
    );
}
