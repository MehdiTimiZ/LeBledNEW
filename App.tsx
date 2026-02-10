
import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Home } from './components/Home';
import { Marketplace } from './components/Marketplace';
import { Community } from './components/Community';
import { Charity } from './components/Charity';
import { BledChat } from './components/BledChat';
import { MessagingLayout } from './components/MessagingLayout';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { SubscriptionView } from './components/SubscriptionView';
import { CreateListingModal } from './components/CreateListingModal';
import { EditProfileModal } from './components/EditProfileModal';
import { AuthModal } from './components/AuthModal';
import { MedicalServices } from './components/MedicalServices';
import { DeliveryMoving } from './components/DeliveryMoving';
import { Flexy } from './components/Flexy';
import { Profile } from './components/Profile';
import { AppView, UserRole, UserProfile, CharityEvent } from './types';
import { MessageCircle } from 'lucide-react';
import { Toast, ToastType } from './components/Toast';
import { BookingModal } from './components/BookingModal';
import { ContactModal } from './components/ContactModal';
import { CHARITY_EVENTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState<string>('Vehicles');
  const [language, setLanguage] = useState<'FR' | 'EN'>('FR');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'u1',
    name: 'Amine Khelifi',
    email: 'amine@test.com',
    role: 'user', 
    isVerified: true
  });
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // New Global State for Interactivity
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);
  const [bookingItemName, setBookingItemName] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactRecipient, setContactRecipient] = useState("Seller");
  const [contactMessage, setContactMessage] = useState("");
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

  const notify = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const handleContact = (recipient: string = "Seller", initialMsg: string = "") => {
    if (!currentUser) {
      notify('Please log in to contact sellers', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setContactRecipient(recipient);
    setContactMessage(initialMsg);
    setIsContactModalOpen(true);
  };

  const handleBook = (itemName?: string) => {
    if (!currentUser) {
      notify('Please log in to book services', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setBookingItemName(itemName || "Service");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(AppView.HOME);
    notify('Logged out successfully', 'info');
  };

  const handleLogin = (role: UserRole) => {
    let user: UserProfile;
    if (role === 'admin') {
      user = { id: 'admin1', name: 'Super Admin', email: 'admin@lebled.dz', role: 'admin', isVerified: true };
    } else if (role === 'seller') {
      user = { id: 'seller1', name: 'Yacine Tech Shop', email: 'shop@lebled.dz', role: 'seller', isVerified: true };
    } else {
      user = { id: 'user1', name: 'Karim User', email: 'karim@test.com', role: 'user', isVerified: false };
    }
      
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    
    if (role === 'admin') {
      notify('Welcome back, Admin! Accessing dashboard...', 'success');
      setCurrentView(AppView.ADMIN_PANEL);
    } else if (role === 'seller') {
      notify('Welcome back to your shop!', 'success');
      setCurrentView(AppView.SELLER_DASHBOARD);
    } else {
      notify('Welcome back!', 'success');
    }
  };

  const handleViewChange = (view: AppView) => {
    if (view === AppView.ADMIN_PANEL && currentUser?.role !== 'admin') {
      notify('Access Denied: Super User privileges required.', 'error');
      return;
    }
    if (view === AppView.SELLER_DASHBOARD && currentUser?.role !== 'seller' && currentUser?.role !== 'admin') {
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
        return <Home notify={notify} onContact={handleContact} language={language} />;
      case AppView.CHAT:
        return currentUser ? (
          <MessagingLayout onClose={() => setCurrentView(AppView.HOME)} currentUser={currentUser} />
        ) : (
          <Home notify={notify} onContact={handleContact} language={language} />
        );
      case AppView.SELLER_DASHBOARD:
        return (currentUser?.role === 'seller' || currentUser?.role === 'admin') ? <SellerDashboard onOpenCreate={() => openCreateListing()} /> : <Home notify={notify} onContact={handleContact} language={language} />;
      case AppView.ADMIN_PANEL:
        return currentUser?.role === 'admin' ? <AdminPanel /> : <Home notify={notify} onContact={handleContact} language={language} />;
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
        />;
      case AppView.SERVICES:
        return <MedicalServices notify={notify} onBook={handleBook} onOpenCreate={() => openCreateListing('Medical Services')} language={language} />;
      case AppView.DELIVERY:
        return <DeliveryMoving notify={notify} onContact={handleContact} />;
      case AppView.FLEXY:
        return <Flexy notify={notify} />;
      case AppView.VEHICLES:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white capitalize">Véhicules</h2>
            <Marketplace 
              onContact={(recipient) => handleContact(recipient)} 
              onBook={() => handleBook("Vehicle Listing")}
              language={language}
              onViewProfile={handleViewOtherProfile}
            />
          </div>
        );
      case AppView.COMMUNITY:
        return <Community />;
      case AppView.CHARITY:
        return <Charity notify={notify} onContact={handleContact} events={charityEvents} setEvents={setCharityEvents} />;
      default:
        return <Home notify={notify} onContact={handleContact} language={language} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1117] text-gray-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      
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
        />
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-8 pt-6 scroll-smooth">
          <CategoryNav currentView={currentView} onChangeView={handleViewChange} />
          
          <div className="mt-2 md:mt-6">
            {renderView()}
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
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin} 
      />
      <BookingModal 
        isOpen={!!bookingItemName}
        itemName={bookingItemName || undefined}
        onClose={() => setBookingItemName(null)}
        onConfirm={() => notify('Appointment Request Sent!', 'success')}
      />
      <ContactModal 
        isOpen={isContactModalOpen}
        recipient={contactRecipient}
        initialMessage={contactMessage}
        onClose={() => setIsContactModalOpen(false)}
        onSend={() => notify('Message sent successfully!', 'success')}
      />
    </div>
  );
};

export default App;
