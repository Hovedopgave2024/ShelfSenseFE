import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import CustomizedSnackbar from "./components/snackbar/CustomizedSnackbar.jsx";
import {ThemeProviderWrapper} from "./theme/ThemeContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProviderWrapper>
            <BrowserRouter>
                <App />
                <CustomizedSnackbar />
            </BrowserRouter>
        </ThemeProviderWrapper>
    </StrictMode>,
);