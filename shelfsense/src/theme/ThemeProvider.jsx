import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useThemeStore from "../stores/useThemeStore.js";

export const ThemeProviderWrapper = ({ children }) => {
    const mode = useThemeStore((state) => state.mode); // Only use `mode` from the store

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    background: {
                        default: mode === "light" ? "#ffffff" : "#121212",
                        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
                    },
                    primary: {
                        main: mode === "light" ? "#1976d2" : "#90caf9",
                    },
                    text: {
                        primary: mode === "light" ? "#000000" : "#ffffff",
                        secondary: mode === "light" ? "#757575" : "#bdbdbd",
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};