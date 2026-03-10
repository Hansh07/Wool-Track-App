import { useEffect, useRef } from 'react';

/**
 * WoolParticles — GPU-accelerated canvas background.
 * Draws slowly drifting wool fiber particles (curved bezier lines)
 * in very low opacity so they add texture without distracting from content.
 */
const WoolParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let particles = [];
        let W = 0, H = 0;

        const resize = () => {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Wool fiber particle class
        class Fiber {
            constructor(randomY = false) {
                this.init(randomY);
            }
            init(randomY) {
                this.x       = Math.random() * W;
                this.y       = randomY ? Math.random() * H : H + 30;
                this.len     = 22 + Math.random() * 38;          // fiber length
                this.angle   = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
                this.vy      = 0.25 + Math.random() * 0.45;      // upward speed
                this.vx      = (Math.random() - 0.5) * 0.18;     // lateral drift
                this.wave    = Math.random() * Math.PI * 2;       // wave phase
                this.waveSpd = 0.008 + Math.random() * 0.012;
                this.thick   = 0.7 + Math.random() * 1.4;
                this.alpha   = 0;
                this.maxAlpha= 0.045 + Math.random() * 0.07;
                this.fading  = false;
                // alternate between gray-green fibers and cadet-blue fibers
                this.emerald = Math.random() < 0.35;
            }
            update() {
                this.y     -= this.vy;
                this.x     += this.vx + Math.sin(this.wave) * 0.25;
                this.wave  += this.waveSpd;

                // fade in
                if (!this.fading && this.alpha < this.maxAlpha) {
                    this.alpha = Math.min(this.alpha + 0.003, this.maxAlpha);
                }
                // start fading when near top third
                if (this.y < H * 0.3) this.fading = true;
                if (this.fading) this.alpha -= 0.002;

                // recycle when invisible or out of bounds
                if (this.alpha <= 0 || this.y < -60) this.init(false);
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                // On a light background: cadet-blue for accent fibers, soft gray-green for neutral
                ctx.strokeStyle = this.emerald ? '#5F9EA0' : '#8aab8c';
                ctx.lineWidth   = this.thick;
                ctx.lineCap     = 'round';

                // Quadratic bezier curve — gives wavy, organic fiber look
                const ex  = this.x + Math.cos(this.angle) * this.len;
                const ey  = this.y + Math.sin(this.angle) * this.len;
                const cpx = this.x + Math.cos(this.angle + 0.55) * this.len * 0.55;
                const cpy = this.y + Math.sin(this.angle + 0.55) * this.len * 0.55;

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.quadraticCurveTo(cpx, cpy, ex, ey);
                ctx.stroke();
                ctx.restore();
            }
        }

        // Seed initial particles spread across screen so there's no empty startup
        const COUNT = 55;
        for (let i = 0; i < COUNT; i++) particles.push(new Fiber(true));

        const loop = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            animId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
};

export default WoolParticles;
