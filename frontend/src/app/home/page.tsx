import ProfileSwipe from "../components/homePage/ProfileSwipe";

const users : [{
    name: string,
    age: number,
    distance: number,
    bio: string,
    interests: string[],
    image: string[],

}]  = [
    {
        name: 'Ayoub Amzil',
        age: 24,
        distance: 30,
        bio: "Ana Dakiy. Ana 9awiy, Moubdi3. Wa la yahoumouni kalam nass ... ... ... ... ... ... ..",
        interests: ["Gym", "Music", "Books", "1337", "SHBM", "Vodka", "Odoo", "OnePiece", "Cartoon", "Boobs"],
        image: ['/amzil2.png','/amzil.png', '/amzil1.png', '/amzil3.png', '/amzil4.png']
    },
    {
        name: 'm0ssan',
        age: 24,
        distance: 30,
        bio: "LMFG! I'm a 1337 hacker",
        interests: ["AI", "chatGPT", "Coding", "1337", "SHBM", "Vodka", "Odoo", "OnePiece", "Cartoon", "Boobs"],
        image: ['/mossan5.png', '/mossan2.png', '/mossan3.png', '/mossan4.png']
    },
    {
        name: 'Achraf Belarif',
        age: 24,
        distance: 1,
        bio: "MY BIO...",
        interests: ["Gym", "Music", "Books", "1337", "SHBM", "Vodka", "Odoo", "OnePiece", "Cartoon", "Boobs", "Coding"],
        image: ['/achraf.jpg',]
    },
    {
        name: 'Lhaxmi',
        age: 24,
        distance: 1,
        bio: "Wax Wax Momkin ta3arof",
        interests: ["Gym", "Music", "Books", "1337", "SHBM", "Vodka", "Odoo", "OnePiece", "Cartoon", "Boobs", "Coding"],
        image: ['/hachmi.png', '/hachmi1.png', '/hachmi2.png',]
    },
    {
        name: 'm0ssan1',
        age: 24,
        distance: 30,
        bio: "LMFG! I'm a 1337 hacker",
        interests: ["AI", "chatGPT", "Coding", "1337", "SHBM", "Vodka", "Odoo", "OnePiece", "Cartoon", "Boobs"],
        image: ['/mossan5.png', '/mossan2.png', '/mossan3.png', '/mossan4.png']
    },
    {
        name: 'Ayoub Amzil1',
        age: 24,
        distance: 30,
        bio: "Ana Dakiy. Ana 9awiy, Moubdi3. Wa la yahoumouni kalam nass ... ... ... ... ... ... ..",
        interests: ["Gym", "Music", "Books", "1337", "SHBM", "Vodka", "Odoo", "OnePiece", "Cartoon", "Boobs"],
        image: ['/amzil.png', '/amzil1.png', '/amzil2.png', '/amzil3.png', '/amzil4.png']
    },
    {
        name: 'Achraf Belarif1',
        age: 24,
        distance: 1,
        bio: "MY BIO...",
        interests: ["Gym", "Music", "Books", "1337", "SHBM", "Vodka", "Odoo", "OnePiece", "Cartoon", "Boobs", "Coding"],
        image: ['/achraf.jpg',]
    },
];

export default async function HomePage() {
    await new Promise((resolve) => setTimeout(resolve, 6000));

    return (
        <div className="relative max-w-sm mx-auto min-h-screen mt-10">
            <ProfileSwipe users={users}/>
        </div>
    );
}
