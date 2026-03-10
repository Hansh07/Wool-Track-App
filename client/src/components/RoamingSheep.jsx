import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SHEEP_CONFIGS = [
    { id: 1, startX: 80,  speed: 0.9, top: 56, scale: 1.0,  delay: 0    },
    { id: 2, startX: 400, speed: 1.6, top: 58, scale: 0.78, delay: 1200 },
    { id: 3, startX: 700, speed: 0.6, top: 54, scale: 1.2,  delay: 600  },
];

const BAAAS = ['Baaa! 🐑', 'Meeeh~', 'Baaaaa!', 'Baa?', 'Floofy!', 'Baa!'];

// Realistic SVG sheep
const SheepSVG = ({ facingLeft, isRunning, legPhase }) => {
    const legSwing = Math.sin(legPhase) * 8;
    return (
        <svg
            width="110"
            height="82"
            viewBox="0 0 110 82"
            style={{
                transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
                transition: 'transform 0.2s ease',
                filter: isRunning
                    ? 'drop-shadow(0 0 10px rgba(134,239,172,0.55))'
                    : 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
                overflow: 'visible',
            }}
        >
            {/* ── Tail ── */}
            <ellipse cx="12" cy="34" rx="7" ry="6" fill="#f0f0f0" />

            {/* ── Wool body – layered circles for fluffy look ── */}
            <circle cx="25" cy="28" r="14" fill="#f5f5f5" />
            <circle cx="39" cy="20" r="16" fill="#f5f5f5" />
            <circle cx="55" cy="17" r="17" fill="#f5f5f5" />
            <circle cx="71" cy="20" r="15" fill="#f5f5f5" />
            <circle cx="81" cy="30" r="12" fill="#f5f5f5" />
            <ellipse cx="50" cy="38" rx="36" ry="18" fill="#f5f5f5" />
            <circle cx="18" cy="37" r="11" fill="#f5f5f5" />
            <circle cx="82" cy="40" r="10" fill="#f5f5f5" />

            {/* Subtle wool shading */}
            <circle cx="38" cy="24" r="5" fill="#e8e8e8" opacity="0.5" />
            <circle cx="56" cy="20" r="6" fill="#e8e8e8" opacity="0.4" />
            <circle cx="70" cy="24" r="4" fill="#e8e8e8" opacity="0.45" />
            <circle cx="26" cy="32" r="4" fill="#e8e8e8" opacity="0.4" />

            {/* ── Animated legs ── */}
            {/* Back legs */}
            <g transform={`rotate(${-legSwing * 0.7} 28 52)`} style={{ transformOrigin: '28px 52px' }}>
                <rect x="24" y="52" width="8" height="20" rx="4" fill="#4a3728" />
                <rect x="23" y="69" width="10" height="5" rx="2.5" fill="#2a1f15" />
            </g>
            <g transform={`rotate(${legSwing * 0.7} 38 52)`} style={{ transformOrigin: '38px 52px' }}>
                <rect x="34" y="52" width="8" height="20" rx="4" fill="#3e2e21" />
                <rect x="33" y="69" width="10" height="5" rx="2.5" fill="#2a1f15" />
            </g>
            {/* Front legs */}
            <g transform={`rotate(${legSwing} 58 52)`} style={{ transformOrigin: '58px 52px' }}>
                <rect x="54" y="52" width="8" height="20" rx="4" fill="#4a3728" />
                <rect x="53" y="69" width="10" height="5" rx="2.5" fill="#2a1f15" />
            </g>
            <g transform={`rotate(${-legSwing} 68 52)`} style={{ transformOrigin: '68px 52px' }}>
                <rect x="64" y="52" width="8" height="20" rx="4" fill="#3e2e21" />
                <rect x="63" y="69" width="10" height="5" rx="2.5" fill="#2a1f15" />
            </g>

            {/* ── Head ── */}
            <ellipse cx="92" cy="42" rx="14" ry="11" fill="#5c4433" />
            {/* Snout */}
            <ellipse cx="102" cy="47" rx="8" ry="6" fill="#4a3426" />
            {/* Nostril */}
            <ellipse cx="107" cy="49" rx="1.8" ry="1.1" fill="#2e1e12" transform="rotate(15 107 49)" />
            <ellipse cx="102" cy="50" rx="1.8" ry="1.1" fill="#2e1e12" transform="rotate(-10 102 50)" />

            {/* Ear */}
            <ellipse cx="85" cy="33" rx="5" ry="9" fill="#5c4433" transform="rotate(-25 85 33)" />
            <ellipse cx="85" cy="33" rx="3" ry="6" fill="#9e7a60" transform="rotate(-25 85 33)" />

            {/* Eye */}
            <ellipse cx="96" cy="40" rx="4" ry="3.5" fill="white" />
            <ellipse cx="97" cy="40" rx="2.5" ry="2.5" fill="#1a0f08" />
            <circle cx="97.8" cy="39.2" r="0.9" fill="white" />

            {/* Mouth curve */}
            <path d="M 99 50 Q 103 53 107 50" stroke="#2e1e12" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
    );
};

const SingleSheep = ({ startX, speed, top, scale, delay }) => {
    const [x, setX] = useState(startX);
    const [facingLeft, setFacingLeft] = useState(false);
    const [baa, setBaa] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [jumping, setJumping] = useState(false);
    const [legPhase, setLegPhase] = useState(0);
    const xRef = useRef(startX);
    const dirRef = useRef(1);
    const speedRef = useRef(speed);
    const activeRef = useRef(true);
    const legRef = useRef(0);

    // Leg animation
    useEffect(() => {
        let raf;
        const animLegs = () => {
            legRef.current += speedRef.current * 0.12;
            setLegPhase(legRef.current);
            raf = requestAnimationFrame(animLegs);
        };
        raf = requestAnimationFrame(animLegs);
        return () => cancelAnimationFrame(raf);
    }, []);

    // Random jump
    useEffect(() => {
        const t = setInterval(() => {
            if (Math.random() < 0.18) {
                setJumping(true);
                setTimeout(() => setJumping(false), 520);
            }
        }, 3500 + Math.random() * 4000);
        return () => clearInterval(t);
    }, []);

    // Random pause (sheep stops to graze)
    useEffect(() => {
        const pause = () => {
            const pauseTime = 1500 + Math.random() * 2500;
            const waitTime = 4000 + Math.random() * 8000;
            const t = setTimeout(() => {
                const prevSpeed = speedRef.current;
                speedRef.current = 0;
                setTimeout(() => {
                    speedRef.current = prevSpeed;
                    pause();
                }, pauseTime);
            }, waitTime);
            return t;
        };
        const t = pause();
        return () => clearTimeout(t);
    }, []);

    // Movement loop
    useEffect(() => {
        const started = setTimeout(() => {
            let raf;
            const SHEEP_W = 110 * scale;
            const move = () => {
                if (!activeRef.current) return;
                const vw = window.innerWidth;
                xRef.current += dirRef.current * speedRef.current;
                if (xRef.current >= vw - SHEEP_W - 8) {
                    xRef.current = vw - SHEEP_W - 8;
                    dirRef.current = -1;
                    setFacingLeft(true);
                } else if (xRef.current <= 4) {
                    xRef.current = 4;
                    dirRef.current = 1;
                    setFacingLeft(false);
                }
                setX(xRef.current);
                raf = requestAnimationFrame(move);
            };
            raf = requestAnimationFrame(move);
            return () => cancelAnimationFrame(raf);
        }, delay);
        return () => {
            clearTimeout(started);
            activeRef.current = false;
        };
    }, [delay, scale]);

    const handleClick = () => {
        const msg = BAAAS[Math.floor(Math.random() * BAAAS.length)];
        setBaa(msg);
        setTimeout(() => setBaa(null), 1800);
        if (isRunning) return;
        setIsRunning(true);
        speedRef.current = speed * 5;
        setTimeout(() => {
            speedRef.current = speed;
            setIsRunning(false);
        }, 2200);
    };

    return (
        <motion.div
            style={{
                position: 'fixed',
                top: top,
                left: x,
                zIndex: 45,
                cursor: 'pointer',
                userSelect: 'none',
                willChange: 'transform',
                transformOrigin: 'bottom center',
                transform: `scale(${scale})`,
            }}
            animate={{
                y: jumping
                    ? [-18, -2, 0]
                    : isRunning
                    ? [0, -4, 0]
                    : [0, -2.5, 0],
            }}
            transition={{
                y: {
                    repeat: Infinity,
                    duration: jumping ? 0.5 : isRunning ? 0.22 : 0.7,
                    ease: jumping ? [0.22, 1.2, 0.36, 1] : 'easeInOut',
                },
            }}
            onClick={handleClick}
            whileHover={{ scale: scale * 1.1 }}
        >
            {/* Speech bubble */}
            <AnimatePresence>
                {baa && (
                    <motion.div
                        key="baa"
                        initial={{ opacity: 0, y: 6, scale: 0.7 }}
                        animate={{ opacity: 1, y: -2, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.75 }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-2xl whitespace-nowrap shadow-xl border border-gray-100 pointer-events-none"
                        style={{ zIndex: 999 }}
                    >
                        {baa}
                        {/* Bubble tail */}
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 block" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Speed lines when running */}
            {isRunning && (
                <div
                    className="absolute top-1/3 pointer-events-none flex flex-col gap-1"
                    style={{ [facingLeft ? 'right' : 'left']: '105%' }}
                >
                    {[10, 7, 5].map((w, i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.8, 0], x: facingLeft ? [0, 10] : [0, -10] }}
                            transition={{ repeat: Infinity, duration: 0.28, delay: i * 0.07 }}
                            style={{ width: w, height: 2, borderRadius: 1, background: '#86efac' }}
                        />
                    ))}
                </div>
            )}

            {/* Dust puff when running */}
            <AnimatePresence>
                {isRunning && (
                    <motion.div
                        key="dust"
                        initial={{ opacity: 0.7, scale: 0.5, x: 0, y: 0 }}
                        animate={{ opacity: 0, scale: 1.8, x: facingLeft ? 20 : -20, y: 8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.55 }}
                        className="absolute bottom-0 pointer-events-none"
                        style={{
                            left: facingLeft ? '55%' : '5%',
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(200,200,200,0.5) 0%, transparent 70%)',
                        }}
                    />
                )}
            </AnimatePresence>

            <SheepSVG facingLeft={facingLeft} isRunning={isRunning} legPhase={legPhase} />
        </motion.div>
    );
};

const RoamingSheep = () => (
    <>
        {SHEEP_CONFIGS.map(cfg => (
            <SingleSheep key={cfg.id} {...cfg} />
        ))}
    </>
);

export default RoamingSheep;
