import { Amplify } from 'aws-amplify'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AWS_RESOURCES } from './aws-resources.ts'
import './index.css'

Amplify.configure(AWS_RESOURCES.dev)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
