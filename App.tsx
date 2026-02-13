
import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { supabase } from '@/supabase/client';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Home } from './components/Home';
import { Community } from './components/Community';
import { Charity } from './components/Charity';
import { BledChat } from './components/BledChat';
import { MessagingLayout } from './components/MessagingLayout';
import { SubscriptionView } from './components/SubscriptionView';
import { CreateListingModal } from './components/CreateListingModal';
import { EditProfileModal } from './components/EditProfileModal';
import { AuthModal } from './components/AuthModal';
import { Profile } from './components/Profile';
import { AppView, UserRole, UserProfile, CharityEvent } from './types';
import { MessageCircle, Loader2 } from 'lucide-react';
import { Toast, ToastType } from './components/Toast';
import { BookingModal } from './components/BookingModal';
import { ContactModal } from './components/ContactModal';
import { CHARITY_EVENTS } from './constants';
import { useNotifications } from './hooks/useNotifications';

// Lazy-loaded heavy components for code splitting
const Marketplace = lazy(() => import('./components/Marketplace').then(m => ({ default: m.Marketplace })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const SellerDashboard = lazy(() => import('./components/SellerDashboard').then(m => ({ default: m.SellerDashboard })));
const ExpatsPage = lazy(() => import('./components/ExpatsPage').then(m => ({ default: m.ExpatsPage })));
const MedicalServices = lazy(() => import('./components/MedicalServices').then(m => ({ default: m.MedicalServices })));
const DeliveryMoving = lazy(() => import('./components/DeliveryMoving').then(m => ({ default: m.DeliveryMoving })));
const Flexy = lazy(() => import('./components/Flexy').then(m => ({ default: m.Flexy })));
const AdminUserManagement = lazy(() => import('./pages/AdminUserManagement'));

const LazyFallback = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState<string>('Vehicles');
  const [language, setLanguage] = useState<'FR' | 'EN' | 'AR'>('FR');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // Loading until session checked
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // RTL support for Arabic
  useEffect(() => {
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'AR' ? 'ar' : language === 'EN' ? 'en' : 'fr';
  }, [language]);

  // Initialize Auth
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email!);
      } else {
        setAuthLoading(false);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email!);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setCurrentUser({
          id: data.id,
          email: data.email || email,
          name: email.split('@')[0], // Fallback name
          role: (data.role as string).toLowerCase() as UserRole,
          isVerified: true // Assumption for now
        });
      } else {
        // Fallback if profile missing
        setCurrentUser({
          id: userId,
          email: email,
          name: email.split('@')[0],
          role: 'user',
          isVerified: true
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  // New Global State for Interactivity
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);
  const [bookingItemName, setBookingItemName] = useState<string | null>(null);
  
  // Chat Context for "Contact Seller" actions
  const [chatContext, setChatContext] = useState<{recipient: string, message: string} | undefined>(undefined);
  const [unreadCount, setUnreadCount] = useState(2); 

  // Lifted State for Persistence
  const [charityEvents, setCharityEvents] = useState<CharityEvent[]>(CHARITY_EVENTS);

  // Refs for click outside handling
  const chatRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Handle Chat Click Outside
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isChatOpen) {
        if (!target.closest('button[data-chat-toggle="true"]')) {
           setIsChatOpen(false);
        }
      }

      // Handle Sidebar Click Outside (only if open/expanded)
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isSidebarOpen) {
        if (!target.closest('button[data-sidebar-toggle="true"]')) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChatOpen, isSidebarOpen]);

  // Handle Theme Change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const notify = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  // Real-time notifications for incoming messages
  useNotifications({
    userId: currentUser?.id,
    currentView,
    onNotification: notify
  });

  const handleContact = (recipient: string = "Seller", initialMsg: string = "") => {
    if (!currentUser) {
      notify('Please log in to contact sellers', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    // Switch to Chat View and pass context
    setChatContext({ recipient, message: initialMsg || `Hi ${recipient}, I'm interested in your listing.` });
    setCurrentView(AppView.CHAT);
    notify(`Starting chat with ${recipient}`, 'success');
  };

  const handleBook = (itemName?: string) => {
    if (!currentUser) {
      notify('Please log in to book services', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setBookingItemName(itemName || "Service");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentView(AppView.HOME);
    notify('Logged out successfully', 'info');
    // setIsAuthModalOpen(true); // Optional: Is this desired?
  };

  const handleLogin = (user: UserProfile) => {
    // setCurrentUser(user); // Handled by onAuthStateChange
    setIsAuthModalOpen(false);
    
    if (user.role === 'super_admin') {
      notify('Welcome, Super Admin! Full access granted.', 'success');
      setCurrentView(AppView.ADMIN_PANEL);
    } else if (user.role === 'admin') {
      notify('Welcome back, Admin! Accessing dashboard...', 'success');
      setCurrentView(AppView.ADMIN_PANEL);
    } else if (user.role === 'seller') {
      notify('Welcome back to your shop!', 'success');
      setCurrentView(AppView.SELLER_DASHBOARD);
    } else {
      notify(`Welcome back!`, 'success');
    }
  };

  const handleViewChange = (view: AppView) => {
    if (view === AppView.ADMIN_PANEL && (currentUser?.role !== 'admin' && currentUser?.role !== 'super_admin')) {
      notify('Access Denied: Super User privileges required.', 'error');
      return;
    }
    if (view === AppView.SELLER_DASHBOARD && currentUser?.role !== 'seller' && currentUser?.role !== 'admin' && currentUser?.role !== 'super_admin') {
      notify('Access Denied: Seller privileges required.', 'error');
      return;
    }
    
    if (view !== AppView.PROFILE) {
        setViewedProfile(null);
    }
    
    setCurrentView(view);
    if (view === AppView.CHAT) {
      setUnreadCount(0);
    }
    // Collapse sidebar on small screens after navigation
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const openCreateListing = (category: string = 'Vehicles') => {
    if (!currentUser) {
      notify('Please log in to post an ad', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setInitialCategory(category);
    setIsCreateModalOpen(true);
  };

  const handleViewOtherProfile = (name: string) => {
    const mockProfile: UserProfile = {
      id: 'other-user',
      name: name,
      email: 'contact@user.com',
      role: 'seller',
      isVerified: true,
      avatar: `https://picsum.photos/200/200?seed=${name}`,
      cover: `https://picsum.photos/1200/400?seed=${name}`
    };
    setViewedProfile(mockProfile);
    setCurrentView(AppView.PROFILE);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Home notify={notify} onContact={handleContact} language={language} searchQuery={globalSearchQuery} onSearchChange={setGlobalSearchQuery} />;
      case AppView.CHAT:
        return currentUser ? (
          <MessagingLayout 
            onClose={() => setCurrentView(AppView.HOME)} 
            currentUser={currentUser} 
            initialContext={chatContext}
          />
        ) : (
            <Home notify={notify} onContact={handleContact} language={language} searchQuery={globalSearchQuery} onSearchChange={setGlobalSearchQuery} />
        );
      case AppView.SELLER_DASHBOARD:
        return (currentUser?.role === 'seller' || currentUser?.role === 'admin' || currentUser?.role === 'super_admin') ? <SellerDashboard onOpenCreate={() => openCreateListing()} currentUser={currentUser} /> : <Home notify={notify} onContact={handleContact} language={language} searchQuery={globalSearchQuery} onSearchChange={setGlobalSearchQuery} />;
      case AppView.ADMIN_PANEL:
        return (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') ? <AdminUserManagement /> : <Home notify={notify} onContact={handleContact} language={language} searchQuery={globalSearchQuery} onSearchChange={setGlobalSearchQuery} />;
      case AppView.SUBSCRIPTION:
        return <SubscriptionView />;
      case AppView.PROFILE:
        return <Profile 
          onEdit={!viewedProfile ? () => setIsProfileModalOpen(true) : undefined} 
          onContact={handleContact} 
          currentUser={viewedProfile || currentUser} 
          onClose={() => {
              setViewedProfile(null);
              setCurrentView(AppView.HOME);
          }} 
          language={language}
        />;
      case AppView.SERVICES:
        return <MedicalServices notify={notify} onBook={handleBook} onOpenCreate={() => openCreateListing('Medical Services')} language={language} onContact={handleContact} />;
      case AppView.DELIVERY:
        return <DeliveryMoving notify={notify} onContact={handleContact} />;
      case AppView.FLEXY:
        return <Flexy notify={notify} currentUser={currentUser} />;
      case AppView.VEHICLES:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-mainText capitalize">Véhicules</h2>
            <Marketplace 
              onContact={handleContact} 
              onBook={() => handleBook("Vehicle Listing")}
              language={language}
              onViewProfile={handleViewOtherProfile}
            />
          </div>
        );
      case AppView.EXPATS:
        return <ExpatsPage onContact={handleContact} notify={notify} currentUser={currentUser} />;
      case AppView.ADMIN_PANEL:
        return (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') ? <AdminUserManagement /> : <Home notify={notify} onContact={handleContact} language={language} searchQuery={globalSearchQuery} onSearchChange={setGlobalSearchQuery} />;
      case AppView.COMMUNITY:
        return <Community />;
      case AppView.CHARITY:
        return <Charity notify={notify} onContact={handleContact} events={charityEvents} setEvents={setCharityEvents} />;
      default:
        return <Home notify={notify} onContact={handleContact} language={language} searchQuery={globalSearchQuery} onSearchChange={setGlobalSearchQuery} />;
    }
  };

  // --- AUTH GATE: Show loading spinner or auth modal if not authenticated ---
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f1117]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f1117]">
        <AuthModal
          isOpen={true}
          onClose={() => { }}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-mainText font-sans selection:bg-indigo-500/30 overflow-hidden transition-colors duration-300">
      
      {/* Sidebar - Mini icons are persistent, expanded grows to overlay/push */}
      <div ref={sidebarRef}>
        <Sidebar 
          currentView={currentView} 
          onChangeView={handleViewChange} 
          currentUser={currentUser}
          onLogout={handleLogout}
          language={language}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area - Content slides when sidebar expands */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-500 ${isSidebarOpen ? 'md:pl-[280px]' : 'md:pl-20'}`}>
        
        <Header 
          onChangeView={handleViewChange} 
          onOpenCreate={() => openCreateListing('Vehicles')}
          currentUser={currentUser}
          onLogin={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          unreadCount={unreadCount}
          language={language}
          setLanguage={setLanguage}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          theme={theme}
          setTheme={setTheme}
          searchQuery={globalSearchQuery}
          onSearchChange={(q) => {
            setGlobalSearchQuery(q);
            if (currentView !== AppView.HOME) setCurrentView(AppView.HOME);
          }}
        />
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-8 pt-6 scroll-smooth">
          <CategoryNav currentView={currentView} onChangeView={handleViewChange} />
          
          <div className="mt-2 md:mt-6">
            <Suspense fallback={<LazyFallback />}>
              {renderView()}
            </Suspense>
          </div>
        </main>

        {/* Floating Chat Button */}
        {currentView !== AppView.CHAT && (
          <div className={`hidden md:block fixed bottom-8 z-40 right-8`}>
            <button 
              data-chat-toggle="true"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 relative"
            >
              <MessageCircle className="w-6 h-6" />
              {isChatOpen && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
            </button>
          </div>
        )}

        {/* AI Chat Overlay */}
        {isChatOpen && currentView !== AppView.CHAT && (
          <div ref={chatRef} className={`fixed bottom-24 w-96 z-40 animate-fade-in-up hidden md:block right-8`}>
             <BledChat />
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <BottomNav 
          currentView={currentView} 
          onChangeView={handleViewChange} 
          currentUser={currentUser}
        />
      </div>

      {/* Global Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Modals */}
      <CreateListingModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        initialCategory={initialCategory}
        language={language}
      />
      <EditProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        onSave={() => {
          notify('Profile updated successfully!', 'success');
          setIsProfileModalOpen(false);
        }}
      />
      {/* AuthModal kept for re-login scenarios (e.g., session expired) */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin} 
      />
      <BookingModal 
        isOpen={!!bookingItemName}
        itemName={bookingItemName || undefined}
        onClose={() => setBookingItemName(null)}
        onConfirm={() => {
            notify('Appointment Request Sent!', 'success');
            handleContact("Service Provider", `Booking request for ${bookingItemName || 'service'}`);
        }}
      />
    </div>
  );
};

export default App;
