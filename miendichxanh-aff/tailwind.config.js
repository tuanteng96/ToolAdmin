/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Be Vietnam Pro', 'sans-serif']
            },
            colors: {
                "gray": "#7E8299",
                "primary": "#3699FF",
                "primaryhv": "#187DE4",
                "secondary": "#E4E6EF",
                "success": "#1BC5BD",
                "successhv": '#0BB7AF',
                "info": "#8950FC",
                "warning": "#FFA800",
                "danger": "#F64E60",
                "dangerhv": "#EE2D41",
                "light": "#EBEDF3",
                "muted": "#B5B5C3",
                "gray": {
                    100: '#f9f9f9',
                    200: '#F4F4F4',
                    300: '#d5d7da',
                    400: '#B5B5C3',
                    700: '#5E6278',
                    800: '#3F4254',
                    900: '#222222'
                }
            },
            boxShadow: {
                lg: '0px 0px 50px 0px rgba(82, 63, 105, 0.15)',
                sm: '0px 0px 20px 0px rgba(76, 87, 125, 0.02)',
                xxl: '#919eab4d 0 0 2px,#919eab1f 0 12px 24px -4px'
            },
        },
    },
    plugins: [],
}