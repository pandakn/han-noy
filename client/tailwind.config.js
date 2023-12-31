/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            boxShadow: {
                b: "0 4px 0",
            },
        },
    },
    daisyui: {
        themes: ["light", "dark", "cupcake"],
    },

    plugins: [require("daisyui")],
    themes: ["light", "lofi", "dark", "cupcake"],
};
