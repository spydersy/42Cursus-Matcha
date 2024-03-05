export default function ChatBar({ dms } : { dms: [{fullName: string, lastDM: string, picture: string}] }) {
    return (
        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            {dms.map((dm) => {
                return (
                    <li className="py-3 sm:py-4"> 
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-shrink-0">
                                <img className="w-8 h-8 rounded-full" src={dm.picture} alt="Neil image" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {dm.fullName}
                                </p>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    {dm.lastDM}
                                </p>
                            </div>
                            <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                                10:50 AM
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
