import { createBrowserRouter } from 'react-router';
import { SurahListPage } from './pages/SurahListPage';
import { AyatPage } from './pages/AyatPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SurahListPage,
  },
  {
    path: '/surah/:surahNumber',
    Component: AyatPage,
  },
]);
