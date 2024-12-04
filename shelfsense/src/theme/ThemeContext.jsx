import React, { createContext, useMemo, useState, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
    const [mode, setMode] = useState("light");

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    background: {
                        default: mode === "light" ? "#ffffff" : "#121212", // Adjust default background
                        paper: mode === "light" ? "#ffffff" : "#1e1e1e", // Adjust card background (modals)
                    },
                    primary: {
                        main: mode === "light" ? "#1976d2" : "#90caf9", // Adjust primary color (buttons etc.)
                    },
                    text: {
                        primary: mode === "light" ? "#000000" : "#ffffff", // Adjust primary text
                        secondary: mode === "light" ? "#757575" : "#bdbdbd", // Adjust secondary text
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);
