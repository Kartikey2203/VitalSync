import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="575004927821-arope5t2uqq3ul9h5cv4fkq69r1q4506.apps.googleusercontent.com"> 
  <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>
)
