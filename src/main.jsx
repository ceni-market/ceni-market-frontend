import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {StrictMode} from "react";
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)
