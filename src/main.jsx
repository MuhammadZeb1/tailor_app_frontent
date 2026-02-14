import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './app/store.jsx'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Portfolio from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <App />
    {/* <Portfolio />  */}
    </Provider>
    </BrowserRouter>
      
  </StrictMode>,
)
