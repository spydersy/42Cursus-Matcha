export default function ProfileIcon({ active } : { active: boolean }) {
    const selectedColor = active ? '#FDE047' : 'white';

    return (
        <svg className="flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" width="25" height="26" viewBox="0 0 25 26" fill={selectedColor} xmlns="http://www.w3.org/2000/svg">
            <path d="M10.9375 12.5C12.5951 12.5 14.1848 11.8415 15.3569 10.6694C16.529 9.49732 17.1875 7.9076 17.1875 6.25C17.1875 4.5924 16.529 3.00269 15.3569 1.83058C14.1848 0.65848 12.5951 0 10.9375 0C9.2799 0 7.69018 0.65848 6.51808 1.83058C5.34598 3.00269 4.6875 4.5924 4.6875 6.25C4.6875 7.9076 5.34598 9.49732 6.51808 10.6694C7.69018 11.8415 9.2799 12.5 10.9375 12.5ZM8.70605 14.8438C3.89648 14.8438 0 18.7402 0 23.5498C0 24.3506 0.649414 25 1.4502 25H20.4248C21.2256 25 21.875 24.3506 21.875 23.5498C21.875 18.7402 17.9785 14.8438 13.1689 14.8438H8.70605Z" />
        </svg>
    );
}