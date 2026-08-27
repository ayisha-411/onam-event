import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { RouterProvider, useRouter } from '@/lib/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/pages/LandingPage';
import { LoginPage, SignupPage } from '@/pages/AuthPages';
import Dashboard from '@/pages/Dashboard';
import CreateEvent from '@/pages/CreateEvent';
import JoinEvent from '@/pages/JoinEvent';
import EventDetails from '@/pages/EventDetails';
import ProfileSettings from '@/pages/ProfileSettings';
import AboutOnam from '@/pages/AboutOnam';
import ContactUs from '@/pages/ContactUs';
import FAQ from '@/pages/FAQ';
import Notifications from '@/pages/Notifications';

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#fffdf5] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#d4a017] animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { navigate } = useRouter();

  if (loading) return <PageLoader />;
  if (!user) {
    navigate('/login');
    return null;
  }
  return <>{children}</>;
}

function Routes() {
  const { path } = useRouter();

  // Auth pages (no navbar/footer)
  if (path === '/login') return <LoginPage />;
  if (path === '/signup') return <SignupPage />;

  // Public pages with navbar/footer
  const showChrome = true;

  let page: React.ReactNode;
  switch (path) {
    case '/':
      page = <LandingPage />;
      break;
    case '/about':
      page = <AboutOnam />;
      break;
    case '/contact':
      page = <ContactUs />;
      break;
    case '/faq':
      page = <FAQ />;
      break;
    case '/dashboard':
      page = <ProtectedRoute><Dashboard /></ProtectedRoute>;
      break;
    case '/events/create':
      page = <ProtectedRoute><CreateEvent /></ProtectedRoute>;
      break;
    case '/events/join':
      page = <ProtectedRoute><JoinEvent /></ProtectedRoute>;
      break;
    case '/profile':
      page = <ProtectedRoute><ProfileSettings /></ProtectedRoute>;
      break;
    case '/notifications':
      page = <ProtectedRoute><Notifications /></ProtectedRoute>;
      break;
    default:
      if (path.startsWith('/events/')) {
        const eventId = path.split('/')[2];
        if (eventId) {
          page = <ProtectedRoute><EventDetails eventId={eventId} /></ProtectedRoute>;
          break;
        }
      }
      page = <LandingPage />;
  }

  return (
    <>
      {showChrome && <Navbar />}
      <Suspense fallback={<PageLoader />}>{page}</Suspense>
      {showChrome && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <Routes />
      </RouterProvider>
    </AuthProvider>
  );
}

export default App;
