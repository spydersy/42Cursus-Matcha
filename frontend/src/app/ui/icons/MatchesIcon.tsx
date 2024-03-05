export default function MatchesIcon({ active } : { active: boolean }) {
    const selectedColor = active ? '#FDE047' : 'white';

    return (
        <svg className="flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" width="25" height="26" viewBox="0 0 25 26" fill={selectedColor} xmlns="http://www.w3.org/2000/svg">
            <path d="M2.32422 12.6098L11.1475 20.8471C11.5137 21.1889 11.9971 21.3794 12.5 21.3794C13.0029 21.3794 13.4863 21.1889 13.8525 20.8471L22.6758 12.6098C24.1602 11.228 25 9.28951 25 7.26314V6.97994C25 3.56685 22.5342 0.656695 19.1699 0.0951711C16.9434 -0.275923 14.6777 0.451617 13.0859 2.04341L12.5 2.62935L11.9141 2.04341C10.3223 0.451617 8.05664 -0.275923 5.83008 0.0951711C2.46582 0.656695 0 3.56685 0 6.97994V7.26314C0 9.28951 0.839844 11.228 2.32422 12.6098Z" />
        </svg>
    );
}