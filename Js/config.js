// Development
const API_BASE = "http://localhost:5000/api";

// Production (Render)
// const API_BASE = "https://YOUR-BACKEND.onrender.com/api";
const API_BASE =
    location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "https://YOUR-RENDER-BACKEND.onrender.com/api";