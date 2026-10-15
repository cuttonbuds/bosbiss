import { createContext, useContext } from 'react';
import { staticContent } from '../data/content.js';

export const ContentContext = createContext(staticContent);
export const useContent = () => useContext(ContentContext);
