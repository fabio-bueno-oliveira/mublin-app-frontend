import {
  Routes,
  Route,
  BrowserRouter
} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import GigDetailsPublic from './pages/GigDetailsPublic';
import BrowseGigs from './pages/BrowseGigs';

function AppRoutes () {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse/gigs" element={<BrowseGigs />} />
        <Route path="/gig/:slug" element={<GigDetailsPublic />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
