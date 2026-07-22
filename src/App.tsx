import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import totodile from './assets/totodile_aquarium.png';
import drilbur from './assets/drilbur_golf.png';
import greninja from './assets/greninja_darts.png';
import gengar from './assets/gengar_tube.png';
import lugia from './assets/immersive_lugia_ex.png';
import one from './assets/one_year.png';
import packImage from './assets/pack.png';

type Card = {
  id: number;
  name: string;
  image: string;
};

const cards: Card[] = [
  { id: 1, name: 'Totodile', image: totodile },
  { id: 2, name: 'Drilbur', image: drilbur },
  { id: 3, name: 'Greninja', image: greninja },
  { id: 4, name: 'Gengar', image: gengar },
  { id: 5, name: 'Lugia', image: lugia },
  { id: 6, name: 'One Year', image: one },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const nextCard = () => {
    if (activeIndex >= cards.length - 1) return;
    setDirection(1);
    setActiveIndex((prev) => prev + 1);
  };

  const prevCard = () => {
    if (activeIndex <= 0) return;
    setDirection(-1);
    setActiveIndex((prev) => prev - 1);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const deltaX = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;

    if (!isOpen && deltaX < -80) {
      handleOpen();
    } else if (isOpen && deltaX > 70) {
      prevCard();
    } else if (isOpen && deltaX < -70) {
      nextCard();
    }

    touchStartX.current = null;
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    touchStartX.current = event.clientX;
  };

  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const deltaX = event.clientX - touchStartX.current;

    if (!isOpen && deltaX < -80) {
      handleOpen();
    } else if (isOpen && deltaX > 70) {
      prevCard();
    } else if (isOpen && deltaX < -70) {
      nextCard();
    }

    touchStartX.current = null;
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setShowCard(true), 320);
  };

  return (
    <main className="app-shell">
      <section className="scene">
        <div className="pack-stage">
          {!showCard && (
            <motion.div
              className="pack"
              initial={false}
              animate={isOpen ? { x: -140, rotate: -12, scale: 0.95, opacity: 0 } : { x: 0, rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <img src={packImage} alt="Pack" className="pack-image" />
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {showCard && (
              <motion.div
                key={cards[activeIndex].id}
                className="card-display"
                initial={{ opacity: 0, y: 120, x: 0, scale: 0.82 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: direction * -90, y: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              >
                <img src={cards[activeIndex].image} alt={cards[activeIndex].name} className="card-image" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>
    </main>
  );
}
