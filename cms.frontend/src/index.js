import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* 🌟 Chỉ cần BrowserRouter bọc App ở đây là đủ. Context đã được xử lý trong App.js */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();