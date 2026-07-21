import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Menu, 
  User, 
  Bell, 
  ChevronRight, 
  ArrowRight, 
  Smartphone, 
  Tv, 
  Wifi, 
  FileText, 
  Wrench, 
  HelpCircle, 
  Bot, 
  Send, 
  Paperclip, 
  Mic, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  ExternalLink, 
  ChevronLeft, 
  Plus, 
  Filter, 
  Search, 
  MoreVertical, 
  Sparkles, 
  Trash2, 
  LogOut, 
  Settings, 
  Database, 
  Users, 
  CreditCard, 
  Check, 
  AlertCircle,
  X,
  RefreshCw,
  ShoppingBag,
  Info
} from 'lucide-react';

// Type definitions
interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  hasCard?: boolean;
  cardData?: {
    title: string;
    total: string;
    date: string;
    isPaid: boolean;
    details: { name: string; price: string }[];
  };
  hasRouterAction?: boolean;
  routerStatus?: 'idle' | 'rebooting' | 'completed';
}

interface CMSItem {
  id: string;
  title: string;
  category: string;
  lastModified: string;
  status: 'Published' | 'Draft';
  imageUrl: string;
}

export default function App() {
  // Navigation & Role States
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home'); // customer tabs: 'home' | 'shop' | 'chat' | 'profile'
  const [adminTab, setAdminTab] = useState<string>('dashboard'); // admin tabs: 'dashboard' | 'cms'
  
  // Floating Chat Widget state
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  
  // Interactive Support Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola! Soy el Asistente de Movistar. ¿En qué puedo ayudarte hoy?',
      timestamp: 'Ahora'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Router reboot state
  const [routerProgress, setRouterProgress] = useState<number>(0);

  // Interactive Admin Satisfaction Graph Hover State
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // CMS Items state with filters
  const [cmsItems, setCmsItems] = useState<CMSItem[]>([
    {
      id: '1',
      title: 'Fibra 1Gb + Movistar TV',
      category: 'Fibra & Internet',
      lastModified: '24 Oct 2025',
      status: 'Published',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ-hALtqJTULJi6QzXnJTXLDe-d3iTleGcAfxLYzRy-p3XYOnzeBKeqwmGXd1d3jW_fREyp5tyPjtmng_oadL1aYL3PYLAV5waZtFKpGK3NMpSjYr3BXShbrIlhGWJmJ4D38mrF47RnA6THGrYwZNCzGk7ZYKTWFVvSsWsdTmfoh422_ksh15aTu7RlvyxqeKRJ6nNMOWDaTNxM0naHeySn7N_wmQhj6Ce4vbbky3pkvxn4kKPwNsxLBzn8ij0DURAUX0sbxWTlak'
    },
    {
      id: '2',
      title: 'Guía de Roaming Internacional',
      category: 'Planes Móviles',
      lastModified: '22 Oct 2025',
      status: 'Draft',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASAwDcb8fs-ADJap2sfv1jXtOa4OPymyOVfOZaRoL-OSf23TwYKQRg283JTdRGwt6YAbXDe3Y-RCJw56ihSqBbEETrvRR6c-HS_gwI3vyyvumVw6MF3OwwvsBKjcvOrlsnWmO9cXqfQBhgvvGRZDLeoQmBB-nhqjTlkDZJVu6ievOIRfrVAGgzwqlohzVh2N0rI73Hu_pea5RFefUMOuvhJT45dxxFoFbttipY8Y5x1SjCB2YE2pZV6L6GZEvYwJMhZbYb7W_YNfA'
    },
    {
      id: '3',
      title: 'Reporte de Sostenibilidad 2025',
      category: 'Corporativo',
      lastModified: '19 Oct 2025',
      status: 'Published',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmcGhBRK3mEjjbn35KfAongCyKHSIsDHThhmtiFcQqYSI41aYJ8EoN77qGFhqiUs5hVZqg6AJ6qtj4W3BMC8pqe_Ev4WTZJ_9tIDYmQsOUcXPG8PutRDNLFfrPmGlnSfAuD7tPQIP3Znfw_v8t_OVilBjvofy7ZdpF0uVlzr9fM9z8LOWLZAbjDGsShg6SdinEJ21khAE_nzRqIepq28qxhtzChgybwFrK-nve9P8r5djHD2TZHcY1bxAwMnpqtTn5LHlrEGVPj5I'
    },
    {
      id: '4',
      title: 'Nuevos Lanzamientos: Series Premier',
      category: 'Entretenimiento',
      lastModified: '15 Oct 2025',
      status: 'Draft',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-H9JKd5Xa-jjITLJwE-9E4mAB4-MqXwTEFYN6eaaNaeKL2ldOiUfJnjSQBmxQpVMMywSbY4FFNDfWf_vIqQ4Q1AL-bE9_KrjyerJ2AGEuhWLw5N6FitZAd0wexNhYg8eGqekkiGlw09U81TuUxVKnitJKoLPMcRBWZAidkoXuq3GFcfLI1j7HXL3S6OxRDG77Tb7xCQPvTCxlzumfBN9kqc7T5uR7mdI559tPPZxTjHBWWTELUonaHmduIcEHu_0Qxf5hopfHou0'
    },
    {
      id: '5',
      title: 'Programa de Fidelidad Movistar Plus+',
      category: 'Entretenimiento',
      lastModified: '12 Oct 2025',
      status: 'Published',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzCH52U__KLbXUnUUo-h4-c-X234oNDX6aqp4mOd_kgnxLf0Pw5mEBZqgKbmT1K-yscelD5XEnELNmUEpDbNHr03c2AY24wp-ZP_htBFieTgBqzghDFnq6cFH7mpG2JYQVwGLZzgNzM_smvBbkSaXQUsOQFrttH8zsnsFoQou0iKsfQQ1LWbyHPj-X_l45yKP6nOOTQvT6Cl8GbGJfTr8I4xhgyGG_kvN8dCW7p_asjl1C2y7npJabTm-K2JI-gygBqU-2BPM2_as'
    }
  ]);

  // CMS Filter States
  const [cmsSearch, setCmsSearch] = useState<string>('');
  const [cmsCategoryFilter, setCmsCategoryFilter] = useState<string>('Todas');
  const [cmsStatusFilter, setCmsStatusFilter] = useState<string>('Todos');

  // Interactive Content Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Fibra & Internet');
  const [newStatus, setNewStatus] = useState<'Published' | 'Draft'>('Published');
  const [newImageUrl, setNewImageUrl] = useState<string>('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80');

  // Success feedback states
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Active expanded accordion item for FAQ
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Selected Recent Conversation Detail Modal state
  const [selectedRecentConv, setSelectedRecentConv] = useState<any | null>(null);

  // Scroll to bottom of chat helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Auto-show floating chat bubble hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFloatingChatOpen(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Show Toast helper
  const triggerToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Chat Trigger Actions (Preloaded flows)
  const handlePreloadedChat = (flow: 'factura' | 'averia' | 'oferta') => {
    setActiveTab('chat');
    setIsAdminMode(false);
    
    if (flow === 'factura') {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: 'Quiero revisar mi última factura del mes de Octubre.',
        timestamp: '10:42 AM'
      };
      setChatMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const botMsg1: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Perfecto. Estoy accediendo a tus datos de facturación. Un momento por favor...',
          timestamp: '10:42 AM'
        };
        setChatMessages(prev => [...prev, botMsg1]);
      }, 1000);

      setTimeout(() => {
        const botMsg2: ChatMessage = {
          id: (Date.now() + 2).toString(),
          sender: 'bot',
          text: 'Aquí tienes los detalles de tu última factura mensual:',
          timestamp: '10:42 AM',
          hasCard: true,
          cardData: {
            title: 'Factura Octubre 2025',
            total: '54,90€',
            date: '05/10/2025',
            isPaid: true,
            details: [
              { name: 'Fibra Óptica 1Gb + Router Smart WiFi', price: '34,90€' },
              { name: 'Línea Móvil Ilimitada 5G+', price: '15,00€' },
              { name: 'Movistar TV Básica', price: '5,00€' }
            ]
          }
        };
        setIsTyping(false);
        setChatMessages(prev => [...prev, botMsg2]);
      }, 2500);

    } else if (flow === 'averia') {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: 'Tengo problemas con mi conexión a Internet en casa.',
        timestamp: '11:15 AM'
      };
      setChatMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Lamento mucho escuchar eso. He realizado un diagnóstico rápido de tu línea de fibra y detecto que la señal del router Smart WiFi es algo inestable. ¿Te gustaría intentar un reinicio remoto seguro del dispositivo desde aquí mismo?',
          timestamp: '11:15 AM',
          hasRouterAction: true,
          routerStatus: 'idle'
        };
        setIsTyping(false);
        setChatMessages(prev => [...prev, botMsg]);
      }, 1500);

    } else if (flow === 'oferta') {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: 'Quiero conocer las ofertas exclusivas disponibles.',
        timestamp: '03:10 PM'
      };
      setChatMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: '¡Por supuesto! Actualmente tienes estas ofertas de actualización exclusivas disponibles en tu zona:\n\n1. **Upgrade Fibra 1Gb**: Por solo 5€ adicionales al mes y mantén datos ilimitados móviles.\n2. **Movistar TV Fútbol Total**: Todo el fútbol nacional e internacional con un 20% de descuento durante 6 meses.\n\n¿Te gustaría activar alguna de estas opciones en tu cuenta?',
          timestamp: '03:11 PM'
        };
        setIsTyping(false);
        setChatMessages(prev => [...prev, botMsg]);
      }, 1500);
    }
  };

  // Handle manual message send in Chat
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      timestamp: 'Ahora'
    };

    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    // AI bot simulated responses
    setTimeout(() => {
      let botResponse = '';
      let isBill = false;
      let isDiag = false;

      if (currentInput.includes('factura') || currentInput.includes('pagar') || currentInput.includes('recibo') || currentInput.includes('precio')) {
        botResponse = 'Entendido. Estoy accediendo a tu historial de facturación reciente. He localizado tu última factura de Octubre de 2025.';
        isBill = true;
      } else if (currentInput.includes('internet') || currentInput.includes('wifi') || currentInput.includes('lento') || currentInput.includes('caida') || currentInput.includes('router') || currentInput.includes('averia')) {
        botResponse = 'He recibido tu consulta sobre el servicio de conexión. Permíteme comprobar los parámetros de transmisión del router Smart WiFi... Detecto que podría beneficiarse de un reinicio rápido.';
        isDiag = true;
      } else if (currentInput.includes('hola') || currentInput.includes('buenos') || currentInput.includes('tardes')) {
        botResponse = '¡Hola de nuevo! Soy tu Asistente Inteligente de Movistar. ¿En qué aspecto de tus servicios de Fibra, Móvil o TV puedo colaborar hoy?';
      } else if (currentInput.includes('oferta') || currentInput.includes('contratar') || currentInput.includes('precio') || currentInput.includes('barato')) {
        botResponse = '¡Buenas noticias! Cuentas con ofertas personalizadas de Fibra + Móvil + TV. Por ser cliente fiel, puedes duplicar tu velocidad de Fibra de 500Mb a 1Gb gratis durante 3 meses.';
      } else {
        botResponse = `He recibido tu mensaje: "${userMsg.text}". Como tu asistente virtual, puedo ayudarte a gestionar tus facturas, reportar incidencias técnicas con tu router o consultar promociones de fibra y móvil. ¿Qué te gustaría realizar hoy?`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: 'Ahora',
        hasCard: isBill,
        cardData: isBill ? {
          title: 'Factura Octubre 2025',
          total: '54,90€',
          date: '05/10/2025',
          isPaid: true,
          details: [
            { name: 'Fibra Óptica 1Gb + Router Smart WiFi', price: '34,90€' },
            { name: 'Línea Móvil Ilimitada 5G+', price: '15,00€' },
            { name: 'Movistar TV Básica', price: '5,00€' }
          ]
        } : undefined,
        hasRouterAction: isDiag,
        routerStatus: isDiag ? 'idle' : undefined
      };

      setIsTyping(false);
      setChatMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  // Interactive Router Reboot simulation
  const startRouterReboot = (messageId: string) => {
    setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, routerStatus: 'rebooting' };
      }
      return msg;
    }));

    setRouterProgress(10);
    const interval = setInterval(() => {
      setRouterProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Complete reboot update
          setChatMessages(curr => curr.map(msg => {
            if (msg.id === messageId) {
              return { ...msg, routerStatus: 'completed' };
            }
            return msg;
          }));
          triggerToast('¡Router Smart WiFi reiniciado con éxito!');
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  // CMS Content deletion
  const handleDeleteCMSItem = (itemId: string) => {
    setCmsItems(prev => prev.filter(item => item.id !== itemId));
    triggerToast('Contenido eliminado exitosamente del CMS.');
  };

  // CMS Content status toggle
  const handleToggleStatus = (itemId: string) => {
    setCmsItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextStatus = item.status === 'Published' ? 'Draft' : 'Published';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
    triggerToast('Estado de publicación actualizado.');
  };

  // Add new CMS Content logic
  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: CMSItem = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      lastModified: 'Hoy',
      status: newStatus,
      imageUrl: newImageUrl
    };

    setCmsItems([newItem, ...cmsItems]);
    setNewTitle('');
    setIsCreateModalOpen(false);
    triggerToast('¡Nuevo contenido añadido con éxito al CMS!');
  };

  // Filtering logic for CMS content list
  const filteredCmsItems = cmsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(cmsSearch.toLowerCase());
    const matchesCategory = cmsCategoryFilter === 'Todas' || item.category === cmsCategoryFilter;
    const matchesStatus = cmsStatusFilter === 'Todos' || item.status === cmsStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // KPI counters derived dynamically from the cmsItems list
  const activePagesCount = cmsItems.filter(i => i.status === 'Published').length;
  const draftPagesCount = cmsItems.filter(i => i.status === 'Draft').length;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#faf9f9] text-[#1b1c1c] overflow-x-hidden pb-16 md:pb-0">
      
      {/* Dynamic Success Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#006688] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium"
          >
            <CheckCircle2 className="w-5 h-5 text-[#77d1ff]" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role/Global Mode Selector Top Bar (Specially designed for interactive showcase) */}
      <div className="bg-[#1b1c1c] text-white px-4 py-2 flex justify-between items-center text-xs border-b border-gray-800 z-50">
        <div className="flex items-center gap-2 text-gray-300">
          <Sparkles className="w-4 h-4 text-[#77d1ff] animate-pulse" />
          <span className="font-semibold hidden sm:inline">PROYECTO INTERACTIVO:</span>
          <span className="text-[#c2e8ff] font-medium">Replicas de Pantallas Movistar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-medium">Vistas de Usuario:</span>
          <div className="bg-gray-800 p-0.5 rounded-lg flex">
            <button 
              onClick={() => {
                setIsAdminMode(false);
                setActiveTab('home');
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${!isAdminMode ? 'bg-[#006688] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Cliente Público
            </button>
            <button 
              onClick={() => {
                setIsAdminMode(true);
                setAdminTab('dashboard');
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${isAdminMode ? 'bg-[#006688] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Administrador (CMS)
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="flex flex-1 w-full max-w-[1440px] mx-auto relative">
        
        {/* Admin Left Sidebar Navigation (Desktop only, shown in admin mode) */}
        {isAdminMode && (
          <aside className="hidden md:flex w-64 bg-[#3c6378] text-white flex-col py-6 border-r border-[#6e7980]/20 flex-shrink-0 min-h-[calc(100vh-40px)] sticky top-[40px]">
            <div className="px-6 mb-8">
              <h2 className="text-xl font-extrabold text-[#c2e8ff] tracking-tight">Panel Movistar</h2>
              <p className="text-[11px] uppercase tracking-wider text-[#c2e8ff]/70 mt-1">Global Network CMS & KPI</p>
            </div>
            
            <nav className="flex-1 space-y-1 px-3">
              <button 
                onClick={() => setAdminTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${adminTab === 'dashboard' ? 'bg-[#006688] text-white shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Métricas de Red</span>
              </button>
              
              <button 
                onClick={() => setAdminTab('cms')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${adminTab === 'cms' ? 'bg-[#006688] text-white shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
              >
                <Database className="w-5 h-5" />
                <span>Gestor de Contenido</span>
              </button>

              <div className="pt-4 border-t border-white/10 mt-4 px-4">
                <span className="text-[10px] text-[#c2e8ff]/60 uppercase tracking-wider font-semibold">Módulos Demo</span>
              </div>

              <button 
                onClick={() => triggerToast('Módulo de Clientes: Simulado para demo')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-all text-left"
              >
                <Users className="w-4 h-4" />
                <span>Clientes (1,326)</span>
              </button>

              <button 
                onClick={() => triggerToast('Módulo de Facturas: Simulado para demo')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-all text-left"
              >
                <CreditCard className="w-4 h-4" />
                <span>Facturas Recientes</span>
              </button>

              <button 
                onClick={() => triggerToast('Ajustes del Sistema: Simulado para demo')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-all text-left"
              >
                <Settings className="w-4 h-4" />
                <span>Configuración</span>
              </button>
            </nav>

            <div className="px-4 mt-auto">
              <div className="bg-[#006688]/30 rounded-xl p-3 flex items-center gap-3 border border-[#77d1ff]/20">
                <div className="w-9 h-9 rounded-full bg-[#77d1ff] flex items-center justify-center text-[#001e2c] font-bold text-sm">
                  AD
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">Admin Demo</h4>
                  <p className="text-[10px] text-[#c2e8ff] leading-none mt-0.5">Super Administrador</p>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Primary Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#faf9f9]">
          
          {/* Header Navigation (TopAppBar replica) */}
          <header className="sticky top-0 z-40 bg-[#faf9f9] border-b border-[#bdc8d0]/30 py-3 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => triggerToast('Menú lateral desplegable simulado')}
                className="p-1 rounded-full hover:bg-[#efeded] text-[#006688] transition-colors focus:outline-none focus:ring-2 focus:ring-[#006688]/30"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div 
                onClick={() => {
                  setIsAdminMode(false);
                  setActiveTab('home');
                }}
                className="flex items-center gap-1 cursor-pointer select-none"
              >
                <span className="text-2xl font-black text-[#006688] tracking-tight">Movistar</span>
                {isAdminMode && (
                  <span className="bg-[#bde5fe] text-[#00394e] font-bold text-[10px] px-1.5 py-0.5 rounded ml-2 uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats on top for Admin mode */}
            {isAdminMode && (
              <div className="hidden lg:flex items-center gap-6 text-xs text-[#3e484f]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-semibold">Servidor Cloud:</span>
                  <span className="font-bold text-[#1b1c1c]">ONLINE (Port 3000)</span>
                </div>
                <span className="text-gray-300">|</span>
                <div>
                  <span className="font-semibold text-gray-500">Último Despliegue:</span> <span className="font-bold text-[#1b1c1c]">Hoy 03:38 AM</span>
                </div>
              </div>
            )}

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => triggerToast('Centro de Notificaciones: No hay alertas pendientes')}
                className="p-1.5 rounded-full hover:bg-[#efeded] text-[#3e484f] transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <button 
                onClick={() => {
                  if (isAdminMode) {
                    setIsAdminMode(false);
                    setActiveTab('profile');
                  } else {
                    setActiveTab('profile');
                  }
                }}
                className="flex items-center gap-2 hover:bg-[#efeded] px-3 py-1.5 rounded-full transition-colors text-sm text-[#006688] font-semibold"
              >
                <User className="w-5 h-5 text-[#006688]" />
                <span className="hidden sm:inline">Mi Cuenta</span>
              </button>
            </div>
          </header>

          {/* MAIN PAGE BODY (Render content based on state) */}
          <main className="flex-1 flex flex-col overflow-x-hidden min-h-[calc(100vh-140px)]">
            
            {!isAdminMode ? (
              // CLIENT / CUSTOMER VIEWS
              <AnimatePresence mode="wait">
                {activeTab === 'home' && (
                  <motion.div 
                    key="home"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Hero Section */}
                    <section className="relative w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-video lg:max-h-[500px] overflow-hidden bg-[#1b1c1c]">
                      <div className="absolute inset-0 z-0">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuACfRfKQED0-KB2wOadWfmWDUXfvyZY3-SPfS5GaQNLJacWEtnIZrj49ALxq1yMFajKc8NOffgxiGbJ_11ypCBeuWIcnWpz_uE__EKRajJbzvzjUd7a-ii7TxYqhTPiWCTs4ME6jEFMqgVfvzIoEt0IX0uOTwoG9EdrPNlvIqoKlImIIlcRzodigpBFFIsj1BwgsEKuTCJPHlxy2YxrQVXAMIlUvubhLP2trwH8NTUPkfsVCZZRBBGrB8LHsNNaxsJN9XHPMsZKG6A" 
                          alt="Familia disfrutando Movistar en el salón" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-85 object-center scale-100 hover:scale-105 transition-transform duration-[10s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                      </div>
                      
                      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 flex flex-col gap-3 max-w-2xl text-white">
                        <span className="inline-block px-3 py-1 bg-[#00a9e0] text-[#00394e] font-bold text-xs rounded-lg self-start uppercase tracking-wider shadow-sm">
                          Oferta Exclusiva
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                          Fibra + Móvil + TV <br />
                          <span className="text-[#77d1ff]">Todo en uno.</span>
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-lg">
                          La conexión más rápida con el mejor entretenimiento y fútbol completo desde solo <span className="font-bold text-[#77d1ff]">34,90€/mes</span>.
                        </p>
                        
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button 
                            onClick={() => handlePreloadedChat('factura')}
                            className="bg-[#006688] hover:bg-[#004d68] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2"
                          >
                            Contratar ahora
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handlePreloadedChat('oferta')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm px-6 py-3 rounded-xl active:scale-95 transition-all"
                          >
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* Explora nuestros servicios (Asymmetric layout) */}
                    <section className="px-6 py-12 max-w-5xl mx-auto w-full">
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-[#1b1c1c] tracking-tight">Explora nuestros servicios</h2>
                        <button 
                          onClick={() => setActiveTab('shop')}
                          className="flex items-center gap-1.5 text-sm font-bold text-[#006688] hover:underline"
                        >
                          Ver tienda completa
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Large Banner Service Card */}
                        <div className="md:col-span-3 relative h-52 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-[#bdc8d0]/20 bg-[#bde5fe]/30">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#bde5fe] via-[#bde5fe]/90 to-transparent z-10" />
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx9br93oz2gF_CJSZcPcl0N0jAbY6pbNYcITReSiHp0ze20x8K_pmhaYZrUCeKFNamoC9WFkHHMdBlR6Ap3iSl2tfArO5LMvhbhbX3c8Qj-gK_r541tAaQ8u2m2zNDYPE4UYlaRPcjz6EAj0OpHObSUHJpFG7gEfumYfOiWGS1RLGJdmBDpqTcTsh1VsZNFvtnvuj5vCqZvMPm7YoGqqPhWF-TjmnoY9Uc_tDlwDSXPqb6ylhGD7rNNObtwNFPY8S6OKgsPOfBspo" 
                            alt="Router de fibra óptica de Movistar con luces encendidas" 
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover object-right z-0 group-hover:scale-[1.03] transition-transform duration-700"
                          />
                          <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-center max-w-md">
                            <h3 className="text-2xl font-extrabold text-[#001e2c]">Fibra Óptica</h3>
                            <p className="text-sm font-semibold text-[#004d68] mt-1">
                              Hasta 1Gb real para volar sin interrupciones.
                            </p>
                            <button 
                              onClick={() => handlePreloadedChat('averia')}
                              className="mt-4 text-[#006688] font-bold flex items-center gap-1 text-sm bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 self-start transition-all"
                            >
                              Saber más
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Split Cards */}
                        <div className="bg-white p-6 rounded-2xl flex flex-col gap-4 border border-[#bdc8d0]/30 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-[#006688]/10 rounded-xl flex items-center justify-center text-[#006688]">
                            <Smartphone className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#1b1c1c]">Móvil Ilimitado</h3>
                            <p className="text-xs text-[#3e484f] mt-1 leading-relaxed">
                              Datos ilimitados y red ultrarrápida 5G+ de máxima cobertura en todo el territorio nacional.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl flex flex-col gap-4 border border-[#bdc8d0]/30 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-[#006688]/10 rounded-xl flex items-center justify-center text-[#006688]">
                            <Tv className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#1b1c1c]">Televisión Plus+</h3>
                            <p className="text-xs text-[#3e484f] mt-1 leading-relaxed">
                              Todo el fútbol, las series más premiadas del momento, producciones originales y estrenos de cine.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl flex flex-col gap-4 border border-[#bdc8d0]/30 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-[#00a9e0]/10 rounded-xl flex items-center justify-center text-[#006688]">
                            <Sparkles className="w-6 h-6 text-[#006688]" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#1b1c1c]">Asistencia Virtual AI</h3>
                            <p className="text-xs text-[#3e484f] mt-1 leading-relaxed">
                              Soporte técnico inteligente e inmediato para solucionar tus incidencias, reiniciar routers o consultar facturas.
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Help Section (FAQ) */}
                    <section className="bg-[#e3e2e2] px-6 py-12 rounded-t-[2.5rem] mt-auto">
                      <div className="max-w-5xl mx-auto flex flex-col gap-8">
                        <div className="max-w-xl">
                          <h2 className="text-3xl font-bold text-[#1b1c1c] tracking-tight">¿Necesitas ayuda?</h2>
                          <p className="text-sm text-[#3e484f] mt-1">
                            Estamos aquí para resolver de forma instantánea todas tus consultas sobre facturación, averías o nuevos servicios.
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          {/* FAQ accordion item 1 */}
                          <div className="bg-white rounded-xl border border-[#bdc8d0]/20 overflow-hidden shadow-sm">
                            <button 
                              onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
                              className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-[#1b1c1c] hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-[#006688]" />
                                <span>Consultar mi última factura</span>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaq === 1 ? 'rotate-90' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {expandedFaq === 1 && (
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-[#3e484f] flex flex-col gap-3">
                                    <p>Puedes acceder a todo el histórico detallado de facturas en tu área de cliente de manera rápida. También puedes consultar tu factura mensual interactiva directamente desde el chat.</p>
                                    <button 
                                      onClick={() => handlePreloadedChat('factura')}
                                      className="self-start text-[#006688] font-bold text-xs underline flex items-center gap-1"
                                    >
                                      Ir al Chat de Facturas →
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* FAQ accordion item 2 */}
                          <div className="bg-white rounded-xl border border-[#bdc8d0]/20 overflow-hidden shadow-sm">
                            <button 
                              onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}
                              className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-[#1b1c1c] hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Wifi className="w-5 h-5 text-[#006688]" />
                                <span>Configurar mi router Smart WiFi</span>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaq === 2 ? 'rotate-90' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {expandedFaq === 2 && (
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-[#3e484f] flex flex-col gap-3">
                                    <p>Ajusta el canal, cambia la contraseña o reinicia tu router Movistar Smart WiFi cómodamente a distancia con nuestro diagnóstico integrado.</p>
                                    <button 
                                      onClick={() => handlePreloadedChat('averia')}
                                      className="self-start text-[#006688] font-bold text-xs underline flex items-center gap-1"
                                    >
                                      Diagnosticar y Reiniciar Router en el Chat →
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* FAQ accordion item 3 */}
                          <div className="bg-white rounded-xl border border-[#bdc8d0]/20 overflow-hidden shadow-sm">
                            <button 
                              onClick={() => setExpandedFaq(expandedFaq === 3 ? null : 3)}
                              className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-[#1b1c1c] hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Wrench className="w-5 h-5 text-[#006688]" />
                                <span>Gestionar una avería de línea</span>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaq === 3 ? 'rotate-90' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {expandedFaq === 3 && (
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-[#3e484f] flex flex-col gap-3">
                                    <p>Si sufres cortes o no tienes señal telefónica, abre un parte técnico. Nuestro sistema medirá la atenuación de fibra y agendará una visita técnica en caso necesario.</p>
                                    <button 
                                      onClick={() => handlePreloadedChat('averia')}
                                      className="self-start text-[#006688] font-bold text-xs underline"
                                    >
                                      Reportar Incidencia →
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Comunidad Movistar Banner card */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center text-center gap-4 border border-[#bdc8d0]/30 shadow-sm">
                          <div className="w-16 h-16 bg-[#00a9e0]/10 rounded-full flex items-center justify-center text-[#006688]">
                            <HelpCircle className="w-10 h-10" />
                          </div>
                          <div>
                            <h3 className="text-xl font-extrabold text-[#1b1c1c]">Comunidad Movistar</h3>
                            <p className="text-sm text-[#3e484f] mt-1 max-w-md">
                              Únete al mayor foro técnico donde expertos de la compañía y miles de usuarios resuelven dudas complejas las 24 horas del día.
                            </p>
                          </div>
                          <button 
                            onClick={() => triggerToast('Comunidad: Redirección simulada a los foros')}
                            className="border border-[#006688] text-[#006688] hover:bg-[#006688]/5 font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
                          >
                            Ir a la comunidad
                          </button>
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                {/* SHOP VIEW - Tienda de Planes */}
                {activeTab === 'shop' && (
                  <motion.div 
                    key="shop"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full flex flex-col gap-8"
                  >
                    <div>
                      <h2 className="text-3xl font-extrabold text-[#1b1c1c]">Catálogo de Servicios</h2>
                      <p className="text-sm text-[#3e484f] mt-1">Configura y contrata las mejores tarifas de Fibra, Móvil y TV a tu medida.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Plan 1 */}
                      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:border-[#006688] transition-all">
                        <div className="p-6 bg-[#bde5fe]/20 border-b border-gray-100">
                          <span className="text-xs font-bold text-[#006688] bg-white px-2 py-1 rounded-md uppercase tracking-wider">Recomendado</span>
                          <h3 className="text-xl font-extrabold mt-3 text-gray-900">Fibra 500Mb + Móvil</h3>
                          <p className="text-xs text-gray-500 mt-1">Equilibrado y rápido</p>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                          <ul className="space-y-3 text-xs text-gray-600">
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Fibra Óptica Simétrica 500 Mbps</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Línea Móvil de 50GB con datos 5G+</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Llamadas ilimitadas nacionales</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Router WiFi Smart auto-instalable</span>
                            </li>
                          </ul>
                          <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black text-gray-900">29,90€</span>
                              <span className="text-xs text-gray-500">/ mes</span>
                            </div>
                            <button 
                              onClick={() => {
                                handlePreloadedChat('factura');
                                triggerToast('Iniciando proceso de contratación...');
                              }}
                              className="w-full bg-[#006688] hover:bg-[#004d68] text-white font-bold py-2.5 rounded-xl mt-4 text-xs shadow-sm transition-all text-center block"
                            >
                              Contratar tarifa
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Plan 2 */}
                      <div className="bg-white rounded-2xl border-2 border-[#006688] overflow-hidden shadow-md flex flex-col relative scale-[1.02]">
                        <div className="absolute top-0 right-0 bg-[#006688] text-white text-[9px] font-bold px-3 py-1 uppercase rounded-bl-xl tracking-wider">
                          Más popular
                        </div>
                        <div className="p-6 bg-[#00a9e0]/15 border-b border-gray-100">
                          <span className="text-xs font-bold text-[#006688] bg-white px-2 py-1 rounded-md uppercase tracking-wider">Todo Incluido</span>
                          <h3 className="text-xl font-extrabold mt-3 text-gray-900">Fibra 1Gb + TV Total</h3>
                          <p className="text-xs text-gray-500 mt-1">Conexión máxima y entretenimiento</p>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                          <ul className="space-y-3 text-xs text-gray-600">
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Fibra Óptica Ultra 1 Gbps (1000 Mbps)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Línea Móvil ILIMITADA de datos 5G+</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Canales exclusivos de Movistar TV</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Todo el fútbol de liga y Champions</span>
                            </li>
                          </ul>
                          <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black text-[#006688]">34,90€</span>
                              <span className="text-xs text-gray-500">/ mes</span>
                            </div>
                            <button 
                              onClick={() => {
                                handlePreloadedChat('factura');
                                triggerToast('Iniciando proceso de contratación...');
                              }}
                              className="w-full bg-[#006688] hover:bg-[#004d68] text-white font-bold py-2.5 rounded-xl mt-4 text-xs shadow-md transition-all text-center block"
                            >
                              Contratar tarifa premium
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Plan 3 */}
                      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:border-[#006688] transition-all">
                        <div className="p-6 bg-[#efeded] border-b border-gray-100">
                          <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded-md uppercase tracking-wider">Solo Móvil</span>
                          <h3 className="text-xl font-extrabold mt-3 text-gray-900">Línea Móvil Ilimitada</h3>
                          <p className="text-xs text-gray-500 mt-1">Sencillo y sin ataduras</p>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                          <ul className="space-y-3 text-xs text-gray-600">
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Línea Móvil con llamadas sin límite</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Datos ilimitados a máxima velocidad 5G+</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Roaming libre en toda la Unión Europea</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>Sin permanencia de ningún tipo</span>
                            </li>
                          </ul>
                          <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black text-gray-900">15,00€</span>
                              <span className="text-xs text-gray-500">/ mes</span>
                            </div>
                            <button 
                              onClick={() => {
                                handlePreloadedChat('oferta');
                                triggerToast('Iniciando proceso de contratación...');
                              }}
                              className="w-full bg-[#006688] hover:bg-[#004d68] text-white font-bold py-2.5 rounded-xl mt-4 text-xs shadow-sm transition-all text-center block"
                            >
                              Contratar línea móvil
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUPPORT CHAT VIEW - Asistente Chatbot */}
                {activeTab === 'chat' && (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col h-[calc(100vh-140px)] relative overflow-hidden bg-[#faf9f9]"
                  >
                    {/* Chat Messages Log Scroll */}
                    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 custom-scrollbar pb-24">
                      {chatMessages.map((msg, index) => (
                        <div key={msg.id} className="w-full">
                          <div className={`flex items-start gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.sender === 'bot' ? 'bg-[#bde5fe] text-[#006688]' : 'bg-[#3c6378] text-white'}`}>
                              {msg.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>

                            {/* Text Bubble */}
                            <div className="flex flex-col">
                              <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${msg.sender === 'bot' ? 'bg-[#efeded] text-[#1b1c1c] rounded-tl-none border-[#bdc8d0]/40' : 'bg-[#006688] text-white rounded-tr-none border-transparent'}`}>
                                <p className="font-medium whitespace-pre-line">{msg.text}</p>
                              </div>
                              <span className={`text-[10px] text-gray-400 mt-1 block ${msg.sender === 'user' ? 'text-right' : ''}`}>
                                {msg.sender === 'bot' ? 'Asistente de Movistar' : 'Tú'} • {msg.timestamp}
                              </span>
                            </div>
                          </div>

                          {/* Render dynamic Receipt Card response if requested */}
                          {msg.hasCard && msg.cardData && (
                            <div className="ml-12 mt-2 max-w-sm animate-in slide-in-from-bottom-2 duration-300">
                              <div className="bg-white border border-[#bdc8d0]/40 rounded-xl overflow-hidden shadow-md">
                                <div className="p-4 border-b border-[#bdc8d0]/30 bg-[#f5f3f3] flex justify-between items-center">
                                  <h4 className="text-xs font-bold text-[#006688] uppercase tracking-wider">{msg.cardData.title}</h4>
                                  <FileText className="w-4 h-4 text-[#006688]" />
                                </div>
                                <div className="p-5 space-y-4">
                                  <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-gray-500">Importe Total:</span>
                                    <span className="font-extrabold text-[#1b1c1c] text-2xl">{msg.cardData.total}</span>
                                  </div>
                                  
                                  {/* Detailed receipt breakdown expandable list */}
                                  <div className="border-t border-gray-100 pt-3 space-y-2">
                                    {msg.cardData.details.map((detail, idx) => (
                                      <div key={idx} className="flex justify-between text-xs text-gray-600">
                                        <span>{detail.name}</span>
                                        <span className="font-semibold">{detail.price}</span>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-100">
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-semibold">Pagada el {msg.cardData.date}</span>
                                  </div>
                                </div>
                                <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                                  <button 
                                    onClick={() => triggerToast('¡PDF de factura descargado con éxito!')}
                                    className="flex-1 bg-[#006688] hover:bg-[#004d68] text-white py-2 rounded-lg font-bold text-xs transition-colors shadow-sm text-center"
                                  >
                                    Descargar PDF
                                  </button>
                                  <button 
                                    onClick={() => triggerToast('Desglose de factura: Consumo móvil 0.00€ adicional.')}
                                    className="flex-1 border border-gray-300 hover:bg-gray-100 text-[#3e484f] py-2 rounded-lg font-bold text-xs transition-colors text-center"
                                  >
                                    Ver desglose
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Render router action helper */}
                          {msg.hasRouterAction && (
                            <div className="ml-12 mt-2 max-w-sm">
                              <div className="bg-white border border-[#bdc8d0]/40 rounded-xl p-4 shadow-sm space-y-4">
                                <div className="flex items-start gap-3">
                                  <Wifi className={`w-10 h-10 p-2 bg-[#bde5fe]/50 rounded-full ${msg.routerStatus === 'rebooting' ? 'text-[#006688] animate-spin' : 'text-[#006688]'}`} />
                                  <div>
                                    <h4 className="text-xs font-bold text-gray-900">Estado: Router Smart WiFi</h4>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Modelo: MitraStar HGU-1000</p>
                                  </div>
                                </div>

                                {msg.routerStatus === 'idle' && (
                                  <button 
                                    onClick={() => startRouterReboot(msg.id)}
                                    className="w-full bg-[#006688] hover:bg-[#004d68] text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Reiniciar Router Remotamente
                                  </button>
                                )}

                                {msg.routerStatus === 'rebooting' && (
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                                      <span>Reiniciando y sincronizando con central...</span>
                                      <span>{routerProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-[#00a9e0] transition-all duration-300" style={{ width: `${routerProgress}%` }} />
                                    </div>
                                  </div>
                                )}

                                {msg.routerStatus === 'completed' && (
                                  <div className="text-xs font-bold text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-100 flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    <span>Reinicio completado. Sincronización 100% restablecida.</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Loading typing state */}
                      {isTyping && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#bde5fe] text-[#006688] flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div className="bg-[#efeded] px-4 py-3 rounded-2xl rounded-tl-none border border-[#bdc8d0]/40 flex gap-1 items-center">
                            <span className="w-2 h-2 bg-[#006688] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-[#006688] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-[#006688] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      )}
                      
                      <div ref={chatEndRef} />
                    </div>

                    {/* Persistent quick actions container on top of text box */}
                    {chatMessages.length === 1 && (
                      <div className="absolute bottom-20 left-0 w-full px-4 md:px-8 flex flex-wrap gap-2 py-2 bg-gradient-to-t from-[#faf9f9] to-transparent z-10">
                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider w-full mb-1 ml-1">Consultas rápidas directas:</span>
                        <button 
                          onClick={() => handlePreloadedChat('factura')}
                          className="bg-white border border-[#006688]/30 hover:border-[#006688] text-[#006688] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Revisar mi Factura
                        </button>
                        <button 
                          onClick={() => handlePreloadedChat('averia')}
                          className="bg-white border border-[#006688]/30 hover:border-[#006688] text-[#006688] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Wifi className="w-3.5 h-3.5" />
                          Problema de Conexión
                        </button>
                        <button 
                          onClick={() => handlePreloadedChat('oferta')}
                          className="bg-white border border-[#006688]/30 hover:border-[#006688] text-[#006688] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#00a9e0]" />
                          Ofertas Exclusivas
                        </button>
                      </div>
                    )}

                    {/* Bottom persistent input bar */}
                    <footer className="absolute bottom-0 left-0 w-full bg-[#ffffff] border-t border-[#bdc8d0]/30 px-4 py-3 flex flex-col gap-1 z-20">
                      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto w-full flex items-center gap-2 bg-[#f5f3f3] border border-[#bdc8d0]/40 rounded-full px-4 py-1 shadow-inner focus-within:ring-2 focus-within:ring-[#006688]/20 transition-all">
                        <button 
                          type="button" 
                          onClick={() => triggerToast('Selección de archivo: Simulado para demo')}
                          className="p-1.5 text-gray-500 hover:text-[#006688] transition-colors"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <input 
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Escribe tu consulta aquí..."
                          className="flex-grow border-none focus:ring-0 bg-transparent text-sm text-[#1b1c1c] py-2 outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => triggerToast('Grabación de audio: Simulado para demo')}
                          className="p-1.5 text-gray-500 hover:text-[#006688] transition-colors hidden sm:block"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                        <button 
                          type="submit"
                          disabled={!chatInput.trim()}
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all ${chatInput.trim() ? 'bg-[#006688] hover:bg-[#004d68] active:scale-90 shadow-sm' : 'bg-gray-300'}`}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                      <p className="text-[10px] text-center text-gray-400 mt-1">
                        Soporte Técnico Movistar inteligente seguro. Canal encriptado SSL.
                      </p>
                    </footer>
                  </motion.div>
                )}

                {/* PROFILE VIEW - Mi Cuenta */}
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full flex flex-col gap-8"
                  >
                    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="w-16 h-16 rounded-full bg-[#bde5fe] text-[#006688] font-black flex items-center justify-center text-2xl border border-[#006688]/20">
                        AM
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-gray-900">Ana Martínez</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Cliente Titular • NIF: ***341*K</p>
                        <span className="inline-block mt-2 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">Cuenta Activa</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-[#1b1c1c]">
                        Servicios Contratados (Fibra + Móvil + TV)
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <Wifi className="w-5 h-5 text-[#006688]" />
                            <div>
                              <p className="text-xs font-bold text-gray-900">Fibra Óptica Simétrica 1Gb</p>
                              <p className="text-[10px] text-gray-500">Router Smart WiFi activo</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-900">34,90€/mes</span>
                        </div>

                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-[#006688]" />
                            <div>
                              <p className="text-xs font-bold text-gray-900">Línea Principal Móvil 5G+</p>
                              <p className="text-[10px] text-gray-500">Datos y llamadas ilimitadas</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-900">15,00€/mes</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Tv className="w-5 h-5 text-[#006688]" />
                            <div>
                              <p className="text-xs font-bold text-gray-900">Movistar TV Selección</p>
                              <p className="text-[10px] text-gray-500">Decodificador UHD activo</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-900">5,00€/mes</span>
                        </div>
                      </div>
                    </div>

                    {/* Developer Demo switch */}
                    <div className="bg-[#bde5fe]/30 rounded-2xl p-6 border border-[#77d1ff]/30 flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-[#006688] mt-0.5" />
                        <div>
                          <h3 className="text-sm font-bold text-[#001e2c]">Portal de Administración Demo</h3>
                          <p className="text-xs text-[#004d68] mt-1">
                            Como evaluador del proyecto, puedes acceder al área de control interno administrativa (CMS y Métricas globales de red) haciendo clic abajo.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setIsAdminMode(true);
                          setAdminTab('dashboard');
                        }}
                        className="bg-[#006688] hover:bg-[#004d68] text-white font-bold text-xs py-3 px-6 rounded-xl self-start transition-all shadow-sm"
                      >
                        Entrar al Panel de Administrador CMS
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              // ADMIN VIEWS
              <AnimatePresence mode="wait">
                {adminTab === 'dashboard' && (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex-grow p-4 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#006688] uppercase tracking-wider">Metas de Rendimiento</span>
                      <h2 className="text-2xl font-black text-gray-900 mt-1">Rendimiento del Sistema</h2>
                      <p className="text-xs text-gray-500 mt-1">Consumo de recursos, atenuación de red y resolución de tickets de soporte.</p>
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Conversaciones de Hoy</p>
                          <p className="text-3xl font-black text-gray-900 mt-1">1,247</p>
                        </div>
                        <div className="w-12 h-12 bg-[#006688]/10 rounded-xl flex items-center justify-center text-[#006688]">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-xl border-b-4 border-b-green-500 border-x border-t border-gray-200 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tasa de Resolución</p>
                            <p className="text-2xl font-black text-gray-900 mt-1">89%</p>
                          </div>
                          <span className="text-[10px] text-green-600 bg-green-50 font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            +2.4%
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 leading-none">Meta óptima: &gt;85% mensual</p>
                      </div>

                      <div className="bg-white p-5 rounded-xl border-b-4 border-b-amber-500 border-x border-t border-gray-200 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Escalaciones Técnicas</p>
                            <p className="text-2xl font-black text-gray-900 mt-1">45</p>
                          </div>
                          <span className="text-[10px] text-amber-600 bg-amber-50 font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" />
                            -12%
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 leading-none">Descenso positivo respecto a ayer</p>
                      </div>
                    </div>

                    {/* Customer Satisfaction Chart (Hign Fidelity custom responsive SVG chart) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">Satisfacción del Cliente</h3>
                          <p className="text-[11px] text-gray-500">Puntaje CSAT promedio durante los últimos 7 días</p>
                        </div>
                        <span className="text-[9px] font-bold text-[#006688] bg-[#00a9e0]/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Últimos 7 Días
                        </span>
                      </div>

                      {/* Responsive Interactive SVG Graph */}
                      <div className="relative w-full h-44 mt-6">
                        {/* Grid lines */}
                        <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-40">
                          <div className="border-b border-dashed border-gray-200 w-full" />
                          <div className="border-b border-dashed border-gray-200 w-full" />
                          <div className="border-b border-dashed border-gray-200 w-full" />
                          <div className="w-full" />
                        </div>

                        {/* Curved chart line using SVG path */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#006688" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#006688" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Gradient fill */}
                          <path 
                            d="M 0 70 Q 50 60, 100 45 T 200 55 T 300 20 T 400 35 L 400 100 L 0 100 Z" 
                            fill="url(#chartGradient)"
                            className="transition-all duration-300"
                          />

                          {/* Primary curve line */}
                          <path 
                            d="M 0 70 Q 50 60, 100 45 T 200 55 T 300 20 T 400 35" 
                            fill="none" 
                            stroke="#006688" 
                            strokeWidth="3.5" 
                            strokeLinecap="round"
                            className="chart-path"
                          />

                          {/* Dots coordinates corresponding to: Mon (0), Wed (100), Fri (200), Sun (300, 400) */}
                          <circle cx="0" cy="70" r={hoveredDay === 0 ? "6" : "4"} fill="#006688" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredDay(0)} onMouseLeave={() => setHoveredDay(null)} />
                          <circle cx="100" cy="45" r={hoveredDay === 1 ? "6" : "4"} fill="#006688" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredDay(1)} onMouseLeave={() => setHoveredDay(null)} />
                          <circle cx="200" cy="55" r={hoveredDay === 2 ? "6" : "4"} fill="#006688" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredDay(2)} onMouseLeave={() => setHoveredDay(null)} />
                          <circle cx="300" cy="20" r={hoveredDay === 3 ? "6" : "4"} fill="#00a9e0" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredDay(3)} onMouseLeave={() => setHoveredDay(null)} />
                          <circle cx="400" cy="35" r={hoveredDay === 4 ? "6" : "4"} fill="#006688" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredDay(4)} onMouseLeave={() => setHoveredDay(null)} />
                        </svg>

                        {/* Floating Tooltip Indicator state based on hover */}
                        {hoveredDay !== null && (
                          <div 
                            className="absolute bg-[#1b1c1c] text-white text-[10px] py-1 px-2.5 rounded-lg font-bold shadow-xl flex flex-col items-center gap-0.5 z-30 pointer-events-none -translate-x-1/2"
                            style={{ 
                              left: hoveredDay === 0 ? '0%' : hoveredDay === 1 ? '25%' : hoveredDay === 2 ? '50%' : hoveredDay === 3 ? '75%' : '100%',
                              top: hoveredDay === 0 ? '55px' : hoveredDay === 1 ? '30px' : hoveredDay === 2 ? '40px' : hoveredDay === 3 ? '10px' : '25px'
                            }}
                          >
                            <span className="text-gray-400">CSAT Score</span>
                            <span className="text-sm font-black text-[#77d1ff]">
                              {hoveredDay === 0 ? '82%' : hoveredDay === 1 ? '89%' : hoveredDay === 2 ? '85%' : hoveredDay === 3 ? '96%' : '92%'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* X Axis Legend */}
                      <div className="flex justify-between mt-3 text-[10px] font-bold text-[#3e484f] px-2">
                        <span>Lunes</span>
                        <span>Miércoles</span>
                        <span>Viernes</span>
                        <span>Domingo</span>
                      </div>
                    </div>

                    {/* Recent Conversations lists */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900">Conversaciones Recientes</h3>
                        <button 
                          onClick={() => triggerToast('Mostrando todos los canales de soporte...')}
                          className="text-[#006688] hover:text-[#004d68]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Conversación 1 */}
                        <div 
                          onClick={() => setSelectedRecentConv({
                            name: 'Ana Martínez',
                            topic: 'Facturación / Desglose de Octubre',
                            status: 'RESOLVED',
                            avatar: 'AM',
                            phone: '+34 651 *** 902',
                            messages: [
                              { sender: 'user', text: 'Quiero revisar mi última factura del mes de Octubre.', time: '10:42 AM' },
                              { sender: 'bot', text: 'Perfecto. Accediendo a tus datos de facturación de Octubre.', time: '10:42 AM' }
                            ]
                          })}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-[#efeded]/30 cursor-pointer border border-transparent hover:border-gray-100 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f5f3f3] text-[#006688] flex items-center justify-center font-bold text-xs border border-[#bdc8d0]/20">
                              AM
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">Ana Martínez</p>
                              <p className="text-[10px] text-gray-500">Consulta de Facturación</p>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            Resuelto
                          </span>
                        </div>

                        {/* Conversación 2 */}
                        <div 
                          onClick={() => setSelectedRecentConv({
                            name: 'Luis Ruiz',
                            topic: 'Avería / Atenuación de Señal Router',
                            status: 'OPEN TICKET',
                            avatar: 'LR',
                            phone: '+34 602 *** 451',
                            messages: [
                              { sender: 'user', text: 'Tengo problemas de desconexiones WiFi.', time: '09:15 AM' },
                              { sender: 'bot', text: 'Se ha sugerido reinicio remoto del Smart WiFi.', time: '09:16 AM' }
                            ]
                          })}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-[#efeded]/30 cursor-pointer border border-transparent hover:border-gray-100 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f5f3f3] text-[#3c6378] flex items-center justify-center font-bold text-xs border border-[#bdc8d0]/20">
                              LR
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">Luis Ruiz</p>
                              <p className="text-[10px] text-gray-500">Soporte Técnico WiFi</p>
                            </div>
                          </div>
                          <span className="bg-[#ffdcbe] text-[#2d1600] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            Pendiente
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => triggerToast('Cargando más historial del servidor...')}
                        className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#006688] font-bold text-xs rounded-lg transition-colors text-center"
                      >
                        Ver Todo el Historial de Actividad
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ADMIN CMS CONTENT MANAGEMENT VIEW */}
                {adminTab === 'cms' && (
                  <motion.div 
                    key="cms"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex-grow p-4 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full"
                  >
                    {/* Header action panel */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">Gestor de Contenido (CMS)</h2>
                        <p className="text-xs text-gray-500 mt-1">Modifica, añade y organiza las páginas web públicas del ecosistema Movistar.</p>
                      </div>
                      <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#006688] hover:bg-[#004d68] text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 self-start shadow-sm transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Contenido</span>
                      </button>
                    </div>

                    {/* Bento Filter & Search Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2 bg-white/70 backdrop-blur-md p-3 rounded-xl border border-gray-200 flex items-center gap-2 shadow-sm">
                        <Filter className="w-4 h-4 text-[#006688] flex-shrink-0" />
                        <div className="flex-grow flex gap-2 text-xs">
                          <select 
                            value={cmsCategoryFilter}
                            onChange={(e) => setCmsCategoryFilter(e.target.value)}
                            className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer font-bold text-gray-700 max-w-[140px]"
                          >
                            <option value="Todas">Categorías</option>
                            <option value="Fibra & Internet">Fibra & Internet</option>
                            <option value="Planes Móviles">Planes Móviles</option>
                            <option value="Entretenimiento">Entretenimiento</option>
                            <option value="Corporativo">Corporativo</option>
                          </select>
                          <span className="w-px h-4 bg-gray-300 self-center" />
                          <select 
                            value={cmsStatusFilter}
                            onChange={(e) => setCmsStatusFilter(e.target.value)}
                            className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer font-bold text-gray-700"
                          >
                            <option value="Todos">Publicación</option>
                            <option value="Published">Publicados</option>
                            <option value="Draft">Borradores</option>
                          </select>
                        </div>
                      </div>

                      {/* Quick statistical counters */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Publicados</span>
                        <span className="text-lg font-black text-[#006688]">{activePagesCount}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Borradores</span>
                        <span className="text-lg font-black text-amber-600">{draftPagesCount}</span>
                      </div>
                    </div>

                    {/* Search bar inside container */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        value={cmsSearch}
                        onChange={(e) => setCmsSearch(e.target.value)}
                        placeholder="Buscar páginas por título..."
                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-[#006688]/20 focus:border-[#006688] transition-all"
                      />
                    </div>

                    {/* Content Data Table card */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                              <th className="px-5 py-3">Título de la Página</th>
                              <th className="px-5 py-3">Categoría</th>
                              <th className="px-5 py-3">Modificado</th>
                              <th className="px-5 py-3">Estado</th>
                              <th className="px-5 py-3 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <AnimatePresence>
                              {filteredCmsItems.length > 0 ? (
                                filteredCmsItems.map(item => (
                                  <motion.tr 
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-gray-50/50 transition-colors"
                                  >
                                    <td className="px-5 py-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                                          <img 
                                            src={item.imageUrl} 
                                            alt={item.title} 
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover" 
                                          />
                                        </div>
                                        <span className="font-bold text-gray-900 text-xs">{item.title}</span>
                                      </div>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500 font-medium">{item.category}</td>
                                    <td className="px-5 py-3 text-gray-400 font-medium">{item.lastModified}</td>
                                    <td className="px-5 py-3">
                                      <button 
                                        onClick={() => handleToggleStatus(item.id)}
                                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1 transition-all ${item.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                                      >
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Published' ? 'bg-green-600' : 'bg-amber-500'}`} />
                                        {item.status === 'Published' ? 'Publicado' : 'Borrador'}
                                      </button>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <button 
                                          onClick={() => handleToggleStatus(item.id)}
                                          title="Cambiar Estado"
                                          className="p-1 rounded hover:bg-gray-100 text-[#3e484f] hover:text-[#006688] transition-all"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteCMSItem(item.id)}
                                          title="Eliminar Contenido"
                                          className="p-1 rounded hover:bg-red-50 text-red-500 transition-all"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </motion.tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400 font-medium">
                                    No se encontraron páginas con los filtros actuales.
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>

                      {/* CMS Table pagination footer */}
                      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500 font-medium">Mostrando 1 a {filteredCmsItems.length} de {filteredCmsItems.length} páginas</span>
                        <div className="flex items-center gap-1">
                          <button className="p-1 rounded border border-gray-200 text-gray-400 bg-white" disabled>
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded">1</span>
                          <button className="p-1 rounded border border-gray-200 text-gray-400 bg-white" disabled>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Public Global Brand Footer */}
            <footer className="w-full mt-auto bg-[#e3e2e2] border-t border-[#bdc8d0]/50 py-12 px-6">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <span className="text-2xl font-black text-[#006688] tracking-tight">Movistar</span>
                  <p className="text-xs text-[#3e484f] leading-relaxed">
                    Conectando personas y empresas con la tecnología de fibra y móvil simétrica más avanzada desde hace más de un siglo.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-[#006688] uppercase tracking-wider mb-3">Legal y Privacidad</h4>
                  <ul className="space-y-2 text-xs">
                    <li><a onClick={() => triggerToast('Política de Privacidad')} className="text-[#3e484f] hover:text-[#006688] cursor-pointer hover:underline">Privacy Policy</a></li>
                    <li><a onClick={() => triggerToast('Condiciones del Servicio')} className="text-[#3e484f] hover:text-[#006688] cursor-pointer hover:underline">Terms of Service</a></li>
                    <li><a onClick={() => triggerToast('Uso de Cookies')} className="text-[#3e484f] hover:text-[#006688] cursor-pointer hover:underline">Cookies de sesión</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#006688] uppercase tracking-wider mb-3">Soporte Integral</h4>
                  <ul className="space-y-2 text-xs">
                    <li><a onClick={() => triggerToast('Guías de Accesibilidad')} className="text-[#3e484f] hover:text-[#006688] cursor-pointer hover:underline">Accessibility</a></li>
                    <li><a onClick={() => triggerToast('Contacto con atención al cliente')} className="text-[#3e484f] hover:text-[#006688] cursor-pointer hover:underline">Contact Us</a></li>
                  </ul>
                </div>
              </div>
              <div className="max-w-5xl mx-auto border-t border-gray-300 mt-8 pt-6 text-center text-xs text-gray-500">
                <span>© 2026 Movistar España. Todos los derechos reservados.</span>
              </div>
            </footer>
          </main>

          {/* Bottom Navigation Bar (Standard Mobile replica) */}
          <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#faf9f9] border-t border-[#bdc8d0]/40 flex justify-around items-center h-16 shadow-lg md:shadow-none">
            {!isAdminMode ? (
              // Customer Nav items
              <>
                <button 
                  onClick={() => {
                    setIsAdminMode(false);
                    setActiveTab('home');
                  }}
                  className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors ${activeTab === 'home' ? 'text-[#006688] font-bold' : 'text-gray-500 hover:text-[#006688]'}`}
                >
                  <Wifi className="w-5 h-5 mb-0.5" />
                  <span>Inicio</span>
                </button>
                <button 
                  onClick={() => {
                    setIsAdminMode(false);
                    setActiveTab('shop');
                  }}
                  className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors ${activeTab === 'shop' ? 'text-[#006688] font-bold' : 'text-gray-500 hover:text-[#006688]'}`}
                >
                  <ShoppingBag className="w-5 h-5 mb-0.5" />
                  <span>Tienda</span>
                </button>
                <button 
                  onClick={() => {
                    setIsAdminMode(false);
                    setActiveTab('chat');
                  }}
                  className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors ${activeTab === 'chat' ? 'text-[#006688] font-bold' : 'text-gray-500 hover:text-[#006688]'}`}
                >
                  <Bot className="w-5 h-5 mb-0.5" />
                  <span>Asistente</span>
                </button>
                <button 
                  onClick={() => {
                    setIsAdminMode(false);
                    setActiveTab('profile');
                  }}
                  className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors ${activeTab === 'profile' ? 'text-[#006688] font-bold' : 'text-gray-500 hover:text-[#006688]'}`}
                >
                  <User className="w-5 h-5 mb-0.5" />
                  <span>Mi Perfil</span>
                </button>
              </>
            ) : (
              // Admin Nav items
              <>
                <button 
                  onClick={() => setAdminTab('dashboard')}
                  className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors ${adminTab === 'dashboard' ? 'text-[#006688] font-bold' : 'text-gray-500 hover:text-[#006688]'}`}
                >
                  <TrendingUp className="w-5 h-5 mb-0.5" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => setAdminTab('cms')}
                  className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors ${adminTab === 'cms' ? 'text-[#006688] font-bold' : 'text-gray-500 hover:text-[#006688]'}`}
                >
                  <Database className="w-5 h-5 mb-0.5" />
                  <span>Contenido</span>
                </button>
                <button 
                  onClick={() => triggerToast('Módulo de Ajustes: Simulado para demo')}
                  className="flex flex-col items-center justify-center flex-1 h-full py-1 text-xs text-gray-500 hover:text-[#006688]"
                >
                  <Settings className="w-5 h-5 mb-0.5" />
                  <span>Ajustes</span>
                </button>
                <button 
                  onClick={() => {
                    setIsAdminMode(false);
                    setActiveTab('home');
                  }}
                  className="flex flex-col items-center justify-center flex-1 h-full py-1 text-xs text-red-500 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5 mb-0.5" />
                  <span>Salir</span>
                </button>
              </>
            )}
          </nav>
        </div>

      </div>

      {/* Floating Chat Widget popup (Screen 1 Floating component) */}
      <div className="fixed bottom-20 right-4 z-[45] flex flex-col items-end gap-3 pointer-events-auto">
        <AnimatePresence>
          {isFloatingChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-72 bg-white rounded-2xl shadow-2xl border border-[#bdc8d0]/40 p-4 flex flex-col gap-3 relative"
            >
              <button 
                onClick={() => setIsFloatingChatOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#006688] rounded-full flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-none">Soporte Virtual</h4>
                  <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online ahora
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                ¡Hola! Soy tu asistente de Movistar. ¿En qué puedo ayudarte hoy?
              </p>

              <div className="flex flex-col gap-1.5 mt-1">
                <button 
                  onClick={() => {
                    setIsFloatingChatOpen(false);
                    handlePreloadedChat('factura');
                  }}
                  className="text-left text-xs font-bold text-[#006688] bg-[#00a9e0]/10 hover:bg-[#00a9e0]/20 p-2 rounded-lg transition-all"
                >
                  Ver mi factura reciente
                </button>
                <button 
                  onClick={() => {
                    setIsFloatingChatOpen(false);
                    handlePreloadedChat('averia');
                  }}
                  className="text-left text-xs font-bold text-[#006688] bg-[#00a9e0]/10 hover:bg-[#00a9e0]/20 p-2 rounded-lg transition-all"
                >
                  Diagnosticar mi Router Smart WiFi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => {
            setIsFloatingChatOpen(!isFloatingChatOpen);
            // Toggle to support tab directly if clicked twice or as main focus
            if (activeTab !== 'chat') {
              setActiveTab('chat');
              setIsAdminMode(false);
            }
          }}
          className="w-14 h-14 bg-[#006688] hover:bg-[#004d68] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Bot className="w-6 h-6 animate-pulse" />
        </button>
      </div>

      {/* CREATE NEW CONTENT MODAL FOR CMS */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100"
            >
              <div className="px-6 py-4 bg-[#006688] text-white flex justify-between items-center">
                <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  <span>Nuevo Contenido CMS</span>
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateContent} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Título de la Página</label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej: Oferta Especial Fibra 1Gb"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#006688]/20 focus:border-[#006688]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#006688]/20 focus:border-[#006688]"
                    >
                      <option value="Fibra & Internet">Fibra & Internet</option>
                      <option value="Planes Móviles">Planes Móviles</option>
                      <option value="Entretenimiento">Entretenimiento</option>
                      <option value="Corporativo">Corporativo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Estado Inicial</label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as 'Published' | 'Draft')}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#006688]/20 focus:border-[#006688]"
                    >
                      <option value="Published">Publicado</option>
                      <option value="Draft">Borrador</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Imagen de Portada (Presets de la marca)</label>
                  <select 
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#006688]/20 focus:border-[#006688]"
                  >
                    <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ-hALtqJTULJi6QzXnJTXLDe-d3iTleGcAfxLYzRy-p3XYOnzeBKeqwmGXd1d3jW_fREyp5tyPjtmng_oadL1aYL3PYLAV5waZtFKpGK3NMpSjYr3BXShbrIlhGWJmJ4D38mrF47RnA6THGrYwZNCzGk7ZYKTWFVvSsWsdTmfoh422_ksh15aTu7RlvyxqeKRJ6nNMOWDaTNxM0naHeySn7N_wmQhj6Ce4vbbky3pkvxn4kKPwNsxLBzn8ij0DURAUX0sbxWTlak">Fibra Router Presets</option>
                    <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuASAwDcb8fs-ADJap2sfv1jXtOa4OPymyOVfOZaRoL-OSf23TwYKQRg283JTdRGwt6YAbXDe3Y-RCJw56ihSqBbEETrvRR6c-HS_gwI3vyyvumVw6MF3OwwvsBKjcvOrlsnWmO9cXqfQBhgvvGRZDLeoQmBB-nhqjTlkDZJVu6ievOIRfrVAGgzwqlohzVh2N0rI73Hu_pea5RFefUMOuvhJT45dxxFoFbttipY8Y5x1SjCB2YE2pZV6L6GZEvYwJMhZbYb7W_YNfA">Roaming App Preset</option>
                    <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuDmcGhBRK3mEjjbn35KfAongCyKHSIsDHThhmtiFcQqYSI41aYJ8EoN77qGFhqiUs5hVZqg6AJ6qtj4W3BMC8pqe_Ev4WTZJ_9tIDYmQsOUcXPG8PutRDNLFfrPmGlnSfAuD7tPQIP3Znfw_v8t_OVilBjvofy7ZdpF0uVlzr9fM9z8LOWLZAbjDGsShg6SdinEJ21khAE_nzRqIepq28qxhtzChgybwFrK-nve9P8r5djHD2TZHcY1bxAwMnpqtTn5LHlrEGVPj5I">Corporate Office Preset</option>
                    <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuA-H9JKd5Xa-jjITLJwE-9E4mAB4-MqXwTEFYN6eaaNaeKL2ldOiUfJnjSQBmxQpVMMywSbY4FFNDfWf_vIqQ4Q1AL-bE9_KrjyerJ2AGEuhWLw5N6FitZAd0wexNhYg8eGqekkiGlw09U81TuUxVKnitJKoLPMcRBWZAidkoXuq3GFcfLI1j7HXL3S6OxRDG77Tb7xCQPvTCxlzumfBN9kqc7T5uR7mdI559tPPZxTjHBWWTELUonaHmduIcEHu_0Qxf5hopfHou0">TV Streaming Preset</option>
                    <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuAzCH52U__KLbXUnUUo-h4-c-X234oNDX6aqp4mOd_kgnxLf0Pw5mEBZqgKbmT1K-yscelD5XEnELNmUEpDbNHr03c2AY24wp-ZP_htBFieTgBqzghDFnq6cFH7mpG2JYQVwGLZzgNzM_smvBbkSaXQUsOQFrttH8zsnsFoQou0iKsfQQ1LWbyHPj-X_l45yKP6nOOTQvT6Cl8GbGJfTr8I4xhgyGG_kvN8dCW7p_asjl1C2y7npJabTm-K2JI-gygBqU-2BPM2_as">Rewards Coins Preset</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-xs transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-[#006688] hover:bg-[#004d68] text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-sm"
                  >
                    Crear Contenido
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECENT CONVERSATION DETAILS DIALOG */}
      <AnimatePresence>
        {selectedRecentConv && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100"
            >
              <div className="px-6 py-4 bg-[#3c6378] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Historial de Ticket de Soporte</h3>
                </div>
                <button onClick={() => setSelectedRecentConv(null)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#efeded] text-[#006688] flex items-center justify-center font-extrabold text-xs">
                    {selectedRecentConv.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{selectedRecentConv.name}</h4>
                    <p className="text-[10px] text-gray-500">Móvil: {selectedRecentConv.phone}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Tema del Incidente</p>
                  <p className="text-xs font-bold text-gray-800 bg-[#efeded]/40 p-2.5 rounded-lg border border-[#bdc8d0]/20">
                    {selectedRecentConv.topic}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Mensajes Intercambiados</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                    {selectedRecentConv.messages.map((m: any, i: number) => (
                      <div key={i} className={`flex flex-col max-w-[85%] ${m.sender === 'user' ? 'ml-auto text-right' : ''}`}>
                        <span className="text-[9px] text-gray-400">{m.sender === 'user' ? 'Usuario' : 'Asistente'} • {m.time}</span>
                        <p className={`p-2 rounded-lg text-xs mt-0.5 leading-relaxed ${m.sender === 'user' ? 'bg-[#006688] text-white rounded-tr-none' : 'bg-[#efeded] text-gray-800 rounded-tl-none border border-gray-200'}`}>
                          {m.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedRecentConv(null);
                    triggerToast('Abriendo túnel de chat directo con el cliente...');
                  }}
                  className="w-full bg-[#006688] hover:bg-[#004d68] text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-sm"
                >
                  Asumir Chat Directo con el Cliente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
