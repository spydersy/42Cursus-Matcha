import Honey from './Honey';
import Logo from './Logo';

export default function LogoHoney() {
    return (
        <div className="flex flex-row items-center leading-none text-white">
            <Logo/>
            <Honey/>
        </div>
    );
};
