module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}",
  'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
],
plugins: [require('flowbite/plugin')],
  theme: {
    extend: {

      minHeight: {
        '1/2': '50vh',
        'full': '100%',
        'screen': '100vh',
        '80': '80%'
      }, 
      height: {      
        '1/2': '25vh',
      'full': '100%',
      'screen': '100vh',
      '80': '80%'
    }
  },
  },
  plugins: [],
};