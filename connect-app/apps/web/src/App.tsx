import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './lib/auth-context';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Skills } from './pages/Skills';
import { SkillDetail } from './pages/SkillDetail';
import { SkillForm } from './pages/SkillForm';
import { Needs } from './pages/Needs';
import { NeedDetail } from './pages/NeedDetail';
import { NeedForm } from './pages/NeedForm';
import { Requests } from './pages/Requests';
import { Profile } from './pages/Profile';
import { Connections } from './pages/Connections';
import { UserProfile } from './pages/UserProfile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="skills" element={<Skills />} />
              <Route path="skills/new" element={<SkillForm />} />
              <Route path="skills/:id" element={<SkillDetail />} />
              <Route path="skills/:id/edit" element={<SkillForm />} />
              <Route path="needs" element={<Needs />} />
              <Route path="needs/new" element={<NeedForm />} />
              <Route path="needs/:id" element={<NeedDetail />} />
              <Route path="needs/:id/edit" element={<NeedForm />} />
              <Route path="requests" element={<Requests />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="users/:id" element={<UserProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
