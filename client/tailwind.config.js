/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // ── Primary: Evergreen (#1F6131) ─────────────────────────
                primary: {
                    DEFAULT: '#1F6131',
                    hover: '#13401F',
                    50: '#E6F4EA',
                    100: '#CDE9D5',
                    200: '#9BCEAB',
                    300: '#69B382',
                    400: '#40985E',
                    500: '#1F6131',
                    600: '#13401F',
                    700: '#071F0F',
                    800: '#041208',
                    900: '#020A05',
                    950: '#000000',
                },
                // ── Secondary ───────────────────────────
                secondary: {
                    DEFAULT: '#1F4D2E',
                    400: '#69B382',
                    500: '#1F4D2E',
                    600: '#0B2E17',
                    900: '#020A05',
                },
                // ── Backgrounds (Balanced) ───────────────────────────────
                background: '#F6FBEF',   // Soft Neutral Lime-tint
                surface: '#FFFFFF',      // White cards
                surfaceHighlight: '#DCE8CF',   // Soft highlight 
                surfaceAlt: '#F6FBEF',
                // ── Glass ───────────────────────────────────────────
                glass: {
                    100: '#FFFFFF',
                    200: '#F6FBEF',
                    border: '#DCE8CF',
                },
                // ── Helpers ─────────────────────────────────────
                magnolia: { DEFAULT: '#F6FBEF', light: '#FFFFFF', dark: '#DCE8CF' },
                lime: { DEFAULT: '#8ED968', light: '#DCE8CF', darker: '#6FBF4B' },
                // ── Semantic tokens ──────────────────────────────────────
                border: '#DCE8CF',
                textPrimary: '#1F6131',
                textSecondary: '#1F4D2E',
                textMuted: '#13401F',
                accent: {
                    DEFAULT: '#8ED968',
                    soft: '#DCE8CF'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Poppins', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                // Smooth SaaS-like shadows with soft Evergreen glow
                'neon': '0 8px 25px rgba(31,97,49,0.12)',
                'neon-sm': '0 4px 14px rgba(31,97,49,0.08)',
                'purple': '0 4px 14px rgba(31,97,49,0.08)',
                'purple-lg': '0 10px 40px rgba(31,97,49,0.06)',
                'card': '0 4px 20px rgba(31,97,49,0.05), 0 1px 3px rgba(31,97,49,0.02)',
                'card-hover': '0 10px 30px rgba(31,97,49,0.12), 0 4px 12px rgba(31,97,49,0.06)',
                'glass': 'inset 0 1px 0 rgba(255,255,255,0.8)',
                'sidebar': '2px 0 16px rgba(31,97,49,0.06)',
            },
            backgroundImage: {
                'hero-pattern': 'radial-gradient(ellipse at 20% 50%, rgba(31,97,49,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(31,97,49,0.04) 0%, transparent 60%)',
                'primary-gradient': 'linear-gradient(135deg, #1F6131 0%, #13401F 100%)',
                'background-gradient': 'linear-gradient(135deg, #F6FBEF 0%, #FFFFFF 100%)',
                'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, transparent 50%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
                'slide-in': 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1)',
                'pulse-purple': 'pulsePurple 2.5s infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp: { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                slideIn: { '0%': { transform: 'translateX(-16px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
                pulsePurple: { '0%,100%': { boxShadow: '0 0 0 0 rgba(16,60,31,0.35)' }, '50%': { boxShadow: '0 0 0 8px rgba(16,60,31,0)' } },
                float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
                glow: { '0%': { boxShadow: '0 0 5px rgba(16,60,31,0.25)' }, '100%': { boxShadow: '0 0 20px rgba(16,60,31,0.55)' } },
            },
        },
    },
    plugins: [],
}
