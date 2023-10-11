/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            boxShadow: {
                b: "0 4px 0"
            }
        },
    },
    plugins: [require("daisyui")],
};
