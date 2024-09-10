function toggleTheme (setThemeIcon) {
  const currentTheme  = window.localStorage.getItem("theme") || "dark";

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  window.localStorage.setItem("theme", newTheme);

  document.documentElement.classList.toggle("dark", newTheme === "dark");

  document.body.classList.remove("bg-zinc-950", "bg-zinc-50");
  document.body.classList.add(newTheme === "dark" ? "bg-zinc-950" : "bg-zinc-50");

  requestAnimationFrame(() => {
    setThemeIcon(newTheme);
  });
  
}

export { toggleTheme };