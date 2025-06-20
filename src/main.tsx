import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createInitialAdminUser } from "./lib/dbTest";

// Initialize database and create initial admin user
const initializeApp = async () => {
  try {
    await createInitialAdminUser();
    console.log("✅ App initialized with database connection");
  } catch (error) {
    console.error("❌ App initialization failed:", error);
  }
};

// Initialize app
initializeApp();

createRoot(document.getElementById("root")!).render(<App />);
