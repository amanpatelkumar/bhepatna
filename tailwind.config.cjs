module.exports = {
  content: ["./*.html", "./brands/*.html", "./product/*.html", "./assets/js/*.js", "./data/*.json", "./build.mjs"],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        stone: '#F8FAFC',
        line: '#E2E8F0',
        em: '#059669',
        emDark: '#047857',
        royal: '#1E3A8A',
        electric: '#2563EB',
        amberGold: '#F59E0B'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(15, 23, 42, 0.08)',
        glow: '0 14px 32px -10px rgba(37, 99, 235, 0.25)'
      }
    }
  }
};
