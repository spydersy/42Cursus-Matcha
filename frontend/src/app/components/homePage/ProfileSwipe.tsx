'use client';

import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import ProfileCarousel from './ProfileCarousel';
import AboutProfile from './AboutProfile';
import DislikeIcon from '@/app/ui/icons/DislikeIcon';
import LikeIcon from '@/app/ui/icons/LikeIcon';

export default function CardSwipe({ users }: {
    users: [{
        name: string,
        age: number,
        distance: number,
        bio: string,
        interests: string[],
        image: string[],

    }]
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentIndexRef = useRef(currentIndex);
    // Add a new state to keep track of swiped card indices
    const [swipedCardIndices, setSwipedCardIndices] = useState(new Set());

    // Add this inside your CardSwipe component
    const getCardStyle = (index: number) => {
        const offset = users.length - index - 1;
        const zIndex = users.length - offset;
        return {
            transform: `translateY(${offset * 5}px)`, // adjust the multiplier as needed for visual spacing
            zIndex: zIndex,
        };
    };

    const childRefs = useMemo(
        () =>
            Array(users.length)
                .fill(0)
                .map((i) => React.createRef()),
        [users.length]
    );

    const swipe = async (dir: 'left' | 'right') => {
        if (canSwipe && currentIndex < users.length) {
          await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
        }
    }

    const zIndexes = useMemo(() => {
        let zIndices = [];
        for (let i = users.length - 1; i >= 0; i--) {
            zIndices.push(i);
        }
        return zIndices;
    }, [users]);

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val);
        currentIndexRef.current = val;
    };

    const canSwipe = currentIndex >= 0;

    const swiped = (direction, nameToDelete, index) => {
        zIndexes[index] = -1; // Push the swiped card to the back
        // Add the index of the swiped card to the swipedCardIndices set
        setSwipedCardIndices(prev => new Set(prev).add(index));
        updateCurrentIndex(index + 1);
    };

    const outOfFrame = (name, idx) => {
        console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
        currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    };

    return (
        <>
            <div className="stacked-cards">
                {users.map((character, index) => {
                    // Determine if the card is the current card to be shown
                    const isCurrentCard = currentIndex === index;
                    // Apply dynamic classes based on card state
                    const cardClasses = `overflow-hidden relative card p-4 rounded-lg shadow-lg ${isCurrentCard ? 'opacity-100' : 'opacity-0'}`;

                    return (
                        <div
                            className={cardClasses}
                            key={character.name}
                            style={{
                                zIndex: zIndexes[index],
                                // Add transform property if needed for additional styling
                                height: '100%',
                                opacity: isCurrentCard ? 1 : 0,
                                transform: isCurrentCard ? 'scale(1)' : 'scale(0.95)',
                                transition: 'transform 0.5s, opacity 0.5s',
                            }}
                        >
                            <TinderCard
                                key={character.name}
                                ref={childRefs[index]}
                                onSwipe={(dir) => swiped(dir, character.name, index)}
                                onCardLeftScreen={() => outOfFrame(character.name, index)}
                                preventSwipe={['up', 'down']}
                            >
                                <ProfileCarousel pictures={character.image} />
                                <AboutProfile about={character.bio} interests={character.interests} />
                            </TinderCard>
                            <div className='mt-4 flex justify-center space-x-24'>
                                <button onClick={() => swipe('left')}>
                                    <DislikeIcon />
                                </button>
                                <button onClick={() => swipe('right')}>
                                    <LikeIcon />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}





