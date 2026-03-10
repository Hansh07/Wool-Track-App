import { motion } from 'framer-motion';

/**
 * SheepLoader — replaces the boring spinner.
 * An SVG sheep whose wool "breathes" while orbiting wool puffs spin around it.
 */

// Cute inline SVG sheep body
const SheepSVG = () => (
    <svg viewBox="0 0 80 60" width="80" height="60" style={{ overflow: 'visible' }}>
        {/* Wool body — layered fluffy circles */}
        <motion.g
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '38px 28px' }}
        >
            <circle cx="20" cy="26" r="11" fill="#f0f0f0" />
            <circle cx="31" cy="18" r="13" fill="#f5f5f5" />
            <circle cx="45" cy="16" r="14" fill="#f5f5f5" />
            <circle cx="58" cy="19" r="12" fill="#f5f5f5" />
            <circle cx="64" cy="28" r="10" fill="#f0f0f0" />
            <ellipse cx="42" cy="32" rx="28" ry="16" fill="#f5f5f5" />
            {/* Subtle shadow/depth */}
            <circle cx="31" cy="22" r="5" fill="#e0e0e0" opacity="0.5" />
            <circle cx="46" cy="19" r="6" fill="#e0e0e0" opacity="0.4" />
            <circle cx="58" cy="23" r="4" fill="#e0e0e0" opacity="0.4" />
        </motion.g>

        {/* Legs */}
        <rect x="24" y="44" width="6" height="14" rx="3" fill="#5c4433" />
        <rect x="33" y="44" width="6" height="14" rx="3" fill="#4a3428" />
        <rect x="48" y="44" width="6" height="14" rx="3" fill="#5c4433" />
        <rect x="57" y="44" width="6" height="14" rx="3" fill="#4a3428" />
        {/* Hooves */}
        <rect x="23" y="55" width="8" height="4" rx="2" fill="#2a1f15" />
        <rect x="32" y="55" width="8" height="4" rx="2" fill="#2a1f15" />
        <rect x="47" y="55" width="8" height="4" rx="2" fill="#2a1f15" />
        <rect x="56" y="55" width="8" height="4" rx="2" fill="#2a1f15" />

        {/* Head */}
        <ellipse cx="71" cy="35" rx="11" ry="9" fill="#5c4433" />
        <ellipse cx="79" cy="39" rx="6" ry="5" fill="#4a3428" />
        {/* Ear */}
        <ellipse cx="66" cy="27" rx="4" ry="7" fill="#5c4433" transform="rotate(-20 66 27)" />
        <ellipse cx="66" cy="27" rx="2.5" ry="4.5" fill="#9e7a60" transform="rotate(-20 66 27)" />
        {/* Eye */}
        <ellipse cx="74" cy="33" rx="3" ry="2.5" fill="white" />
        <circle cx="75" cy="33" r="1.8" fill="#1a0f08" />
        <circle cx="75.6" cy="32.4" r="0.7" fill="white" />
        {/* Nostril */}
        <ellipse cx="80" cy="41" rx="1.4" ry="0.9" fill="#2e1e12" transform="rotate(15 80 41)" />
    </svg>
);

// Orbiting wool puff component
const WoolPuff = ({ index, total, radius }) => {
    const angle   = (index / total) * 360;
    const duration = 3.5;
    return (
        <motion.div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 10,
                height: 10,
                marginTop: -5,
                marginLeft: -5,
            }}
            animate={{ rotate: 360 }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
                delay: -(index / total) * duration,
            }}
        >
            <motion.div
                style={{
                    position: 'absolute',
                    top: -radius,
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
                animate={{
                    scale: [0.8, 1.15, 0.8],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.2,
                }}
            >
                <div
                    style={{
                        width: index % 2 === 0 ? 8 : 6,
                        height: index % 2 === 0 ? 8 : 6,
                        borderRadius: '50%',
                        background: index % 3 === 0
                            ? 'rgba(52,211,153,0.85)'
                            : 'rgba(255,255,255,0.75)',
                        boxShadow: index % 3 === 0
                            ? '0 0 8px rgba(52,211,153,0.6)'
                            : '0 0 6px rgba(255,255,255,0.4)',
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

// Loading dots
const Dot = ({ delay }) => (
    <motion.span
        style={{
            display: 'inline-block',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#34d399',
            margin: '0 3px',
        }}
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay }}
    />
);

const SheepLoader = ({ label = 'Loading…', size = 'md' }) => {
    const scale = size === 'xl' ? 1.5 : size === 'lg' ? 1.25 : size === 'sm' ? 0.7 : 1;
    const radius = size === 'xl' ? 72 : size === 'lg' ? 60 : 50;
    const PUFFS  = 6;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                userSelect: 'none',
            }}
        >
            {/* Sheep + orbiting puffs */}
            <div style={{ position: 'relative', width: 160 * scale, height: 130 * scale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Outer glow ring */}
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '1px solid rgba(52,211,153,0.15)',
                        width: radius * 2 + 20,
                        height: radius * 2 + 20,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                    }}
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.97, 1.03, 0.97] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Orbiting puffs */}
                {Array.from({ length: PUFFS }).map((_, i) => (
                    <WoolPuff key={i} index={i} total={PUFFS} radius={radius} />
                ))}

                {/* Sheep body with gentle bob */}
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transform: `scale(${scale})` }}
                >
                    <SheepSVG />
                </motion.div>
            </div>

            {/* Label + loading dots */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.05em' }}>
                    {label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Dot delay={0} />
                    <Dot delay={0.18} />
                    <Dot delay={0.36} />
                </div>
            </div>
        </div>
    );
};

export default SheepLoader;
