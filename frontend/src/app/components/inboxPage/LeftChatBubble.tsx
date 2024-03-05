export default function LeftChatBubble({ messageObj }: { messageObj: { fullName: string, message: string, picture: string, time: string, status: string, leftBubble: boolean } }) {
    return (
        <div className="flex justify-start w-full">
            <div className="flex items-start gap-2.5 bg-yellow-300 ">
                <img className="w-8 h-8 rounded-full" src={messageObj.picture} alt="Profile image" />
                <div className="flex flex-col gap-1 w-full max-w-[320px]">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{messageObj.fullName}</span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{messageObj.time}</span>
                    </div>
                    <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                        <p className="text-sm font-normal text-gray-900 dark:text-white">{messageObj.message}</p>
                    </div>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{messageObj.status}</span>
                </div>
            </div>
        </div>
    );
}
