
export default function AboutProfile({about, interests} : {about: string, interests: string[]}) {
    return (
        <div className="mt-4 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-zinc-950 dark:border-gray-700">
            <h5 className="mb-2 text-m font-bold tracking-tight text-gray-900 dark:text-white">About me</h5>
            <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">{about}</p>
            <h2 className="mb-2 text-m font-bold tracking-tight text-gray-900 dark:text-white">Interests</h2>
            {interests.map((interest, index) => (
                <span key={index} className="inline-flex bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-zinc-700 dark:text-yellow-300 border border-yellow-300">{interest}</span>
            ))}
        </div>
    );
}