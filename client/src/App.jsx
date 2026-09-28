import { useEffect } from "react";

import AppRoutes from "./routes/AppRoutes";
import Starfield from "./components/common/Starfield";
import useThemeStore from "./store/themeStore";

function App() {
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <>
      <Starfield />
      <AppRoutes />
    </>
  );
}

export default App;
