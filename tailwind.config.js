module.exports = {
    darkMode: 'class',
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Exact colors from reference design
                primary: '#3B82F6',
                background: {
                    DEFAULT: '#F5F5F5',
                    dark: '#0F172A',
                },
                surface: {
                    DEFAULT: '#FFFFFF',
                    dark: '#1E293B',
                },

                // Text colors
                text: {
                    dark: '#1F2937',
                    medium: '#374151',
                    light: '#6B7280',
                    lighter: '#9CA3AF',
                    // Dark mode variants
                    'dark-d': '#F8FAFC',
                    'medium-d': '#E2E8F0',
                    'light-d': '#94A3B8',
                    'lighter-d': '#64748B',
                },

                // UI colors
                border: {
                    DEFAULT: '#E5E7EB',
                    dark: '#334155',
                },
                'bg-light': {
                    DEFAULT: '#F3F4F6',
                    dark: '#1E293B',
                },

                // Category colors
                'work-bg': '#DBEAFE',
                'work-text': '#2563EB',
                'priority-bg': '#FED7AA',
                'priority-text': '#EA580C',
            },
            spacing: {
                '4.5': '18px',
            },
        },
    },
    plugins: [],
}
