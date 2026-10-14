import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Traceability from './Traceability.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Traceability />
  </StrictMode>,
);
