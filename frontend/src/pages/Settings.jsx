import React, { useState, useEffect } from "react";

const themes = [
  { name: "professional", label: "Professional", gradient: ["#1e3a8a", "#2563eb"] },
  { name: "dark", label: "Dark", gradient: ["#0f172a", "#1e293b"] },
  { name: "light", label: "Light", gradient: ["#dbeafe", "#93c5fd"] },
  { name: "pink", label: "Pink", gradient: ["#f472b6", "#e11d48"] },
  { name: "red", label: "Red", gradient: ["#ef4444", "#b91c1c"] },
  { name: "warm", label: "Warm", gradient: ["#fb923c", "#ea580c"] },
  { name: "purple", label: "Purple", gradient: ["#a855f7", "#6d28d9"] },
  { name: "green", label: "Green", gradient: ["#22c55e", "#15803d"] },
];

const Settings = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "professional";
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const themeToApply = savedTheme || "professional";
    setCurrentTheme(themeToApply);
    document.documentElement.setAttribute("data-theme", themeToApply);
  }, []);

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[var(--page-bg-color)]">
      <div className="max-w-3xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Settings</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center text-black">Select Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => changeTheme(theme.name)}
                className={`relative rounded-xl shadow-lg overflow-hidden border-4 w-28 h-28 transition-transform transform hover:scale-105 ${
                  currentTheme === theme.name ? "border-white" : "border-transparent"
                }`}
              >
                {/* Live gradient preview */}
                <div
                  className="w-full h-full rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                  }}
                />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-black font-medium text-sm bg-white/70 px-2 py-1 rounded">
                  {theme.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-center text-black">Info</h2>
          <p className="text-black/80 text-sm text-center">
            Your selected theme will be applied instantly and remembered across sessions.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
