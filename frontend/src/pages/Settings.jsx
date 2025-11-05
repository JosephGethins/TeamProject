import React, { useState, useEffect } from "react";

const themes = [
  { name: "blue", label: "Blue", gradient: ["#3b82f6", "#0ea5e9"] },
  { name: "dark", label: "Dark", gradient: ["#1e40af", "#0c4a6e"] },
  { name: "light", label: "Light", gradient: ["#dbeafe", "#93c5fd"] },
  { name: "pink", label: "Pink", gradient: ["#f472b6", "#e11d48"] },
];

const Settings = () => {
  const [currentTheme, setCurrentTheme] = useState("blue");

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-gradient-start)] bg-gradient-to-br to-[var(--bg-gradient-end)] flex justify-center items-start py-10 px-6">
      <div className="max-w-3xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => changeTheme(theme.name)}
                className={`relative rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 border-4 ${
                  currentTheme === theme.name
                    ? "border-white"
                    : "border-transparent"
                }`}
              >
                {/* Live gradient preview */}
                <div
                  className="w-full h-24"
                  style={{
                    background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                  }}
                />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-medium text-sm bg-black/30 px-2 py-1 rounded">
                  {theme.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Info</h2>
          <p className="text-white/70 text-sm">
            Your selected theme will be applied instantly and remembered across
            sessions.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
