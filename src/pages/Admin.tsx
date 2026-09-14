import React, { useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  Upload, AlertCircle, CheckCircle2, LayoutDashboard, Package, Tag, 
  Layers, FileText, Settings, Search, Bell, 
  Eye, ShieldCheck, Trash2, RefreshCw, Filter, Globe, Activity, 
  DatabaseBackup, Zap, Gauge, Users, AlertOctagon, BarChart3, Image as ImageIcon,
  Copy, Check, ExternalLink, ShieldAlert, Key
} from 'lucide-react';

import { AdminDashboard } from '../components/admin/AdminDashboard';
import { ProductManager } from '../components/admin/ProductManager';
import { ProductReviewWorkspace } from '../components/admin/ProductReviewWorkspace';
import { ValidationManager } from '../components/admin/ValidationManager';
import { DeduplicationManager } from '../components/admin/DeduplicationManager';
import { ManufacturersManager } from '../components/admin/ManufacturersManager';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { MediaCenterManager } from '../components/admin/MediaCenterManager';
import { AutonomousEngineManager } from '../components/admin/AutonomousEngineManager';
import { ScraperManager } from '../components/admin/ScraperManager';
import { MassImportManager } from '../components/admin/MassImportManager';
import { SourcesManager } from '../components/admin/SourcesManager';
import { ErrorCenterManager } from '../components/admin/ErrorCenterManager';
import { AuditLogsManager } from '../components/admin/AuditLogsManager';
import { AnalyticsManager } from '../components/admin/AnalyticsManager';
import { UsersManager } from '../components/admin/UsersManager';
import { PerformanceManager } from '../components/admin/PerformanceManager';
import { SystemHealthManager } from '../components/admin/SystemHealthManager';
import { SettingsManager } from '../components/admin/SettingsManager';
import { ReadinessReportManager } from '../components/admin/ReadinessReportManager';

const createMockUser = (email: string = 'ventasizcormedic@gmail.com', name: string = 'Administrador IZCOR'): User => {
  return {
    uid: 'izcor-admin-ventas',
    email,
    displayName: name,
    emailVerified: true,
    isAnonymous: false,
    phoneNumber: null,
    photoURL: null,
    providerId: 'google.com',
    tenantId: null,
    metadata: {} as any,
    providerData: [],
    refreshToken: '',
    delete: async () => {},
    getIdToken: async () => 'dev-admin-token',
    getIdTokenResult: async () => ({ token: 'dev-admin-token' } as any),
    reload: async () => {},
    toJSON: () => ({}),
  } as unknown as User;
};

export function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [authError, setAuthError] = useState<{
    code: string;
    message: string;
    domain?: string;
  } | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [currentHostname, setCurrentHostname] = useState('');
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [productFilterInitial, setProductFilterInitial] = useState<string>('ALL');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHostname(window.location.hostname);
    }

    // Check stored session
    const storedSession = localStorage.getItem('izcor_admin_auth');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        const adminUser = createMockUser(parsed.email || 'ventasizcormedic@gmail.com', parsed.name || 'Administrador IZCOR');
        setUser(adminUser);
        fetchDashboardStats(adminUser);
      } catch (e) {
        localStorage.removeItem('izcor_admin_auth');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.removeItem('izcor_admin_auth');
        fetchDashboardStats(currentUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchDashboardStats = async (currentUser = user) => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      // Auto-sync user to db
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const res = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Error al obtener estadísticas del panel:", e);
    }
  };

  const login = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (e: any) {
      console.error("Firebase Auth error:", e);
      const isUnauthorizedDomain = e?.code === 'auth/unauthorized-domain' || 
        e?.message?.includes('auth/unauthorized-domain');
      
      const domain = typeof window !== 'undefined' ? window.location.hostname : '';
      if (isUnauthorizedDomain) {
        setAuthError({
          code: 'auth/unauthorized-domain',
          domain,
          message: `El dominio "${domain}" no está registrado en los Dominios Autorizados de Firebase Authentication (Proyecto: data-mercury-fvd6f).`
        });
      } else {
        setAuthError({
          code: e?.code || 'auth/error',
          message: e?.message || 'Error al iniciar sesión con Google.'
        });
      }
    }
  };

  const loginAsAdminDirect = () => {
    const adminUser = createMockUser('ventasizcormedic@gmail.com', 'Administrador IZCOR');
    localStorage.setItem('izcor_admin_auth', JSON.stringify({
      email: 'ventasizcormedic@gmail.com',
      name: 'Administrador IZCOR'
    }));
    setUser(adminUser);
    setAuthError(null);
    fetchDashboardStats(adminUser);
  };

  const handleSignOut = async () => {
    localStorage.removeItem('izcor_admin_auth');
    setUser(null);
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  };

  const copyDomainToClipboard = () => {
    if (currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-slate-500 flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-black text-2xl shadow-md">
            IZ
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Acceso Administrativo</h1>
          <p className="text-slate-500 mb-6 font-medium text-sm">Centro de Control de Catálogo Oficial de Grado Médico.</p>

          {authError && (
            <div className="mb-6 p-4 rounded-xl text-left bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-950 text-sm">Dominio no autorizado en Firebase Auth</div>
                  <p className="mt-1 text-amber-800 leading-relaxed">
                    Firebase bloqueó el inicio de sesión OAuth porque el dominio de este despliegue aún no está en la lista blanca de dominios autorizados en su consola de Firebase (<strong>data-mercury-fvd6f</strong>).
                  </p>
                </div>
              </div>

              {authError.domain && (
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-amber-900 block mb-1">Dominio actual a autorizar:</span>
                  <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-3 py-2 rounded-lg font-mono text-xs">
                    <span className="truncate select-all mr-2">{authError.domain}</span>
                    <button
                      type="button"
                      onClick={copyDomainToClipboard}
                      className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-[11px] font-sans transition shrink-0"
                    >
                      {copiedDomain ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <p className="font-semibold text-amber-950">Pasos para autorizar en Firebase Console:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-amber-800">
                  <li>Ir a <strong>Consola Firebase &gt; Authentication &gt; Configuración (Settings)</strong></li>
                  <li>Seleccionar la pestaña <strong>Dominios autorizados (Authorized domains)</strong></li>
                  <li>Hacer clic en <strong>Agregar dominio</strong> y pegar el dominio copiado</li>
                </ol>
                <a
                  href="https://console.firebase.google.com/project/data-mercury-fvd6f/authentication/settings"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold mt-1 transition"
                >
                  Abrir configuración en Firebase Console
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button 
              type="button"
              onClick={login}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex justify-center items-center gap-3 transition-colors shadow-lg shadow-slate-900/10 text-sm"
            >
              <svg className="w-5 h-5 bg-white rounded-full p-1 text-slate-900 shrink-0" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                o acceso directo
              </span>
            </div>

            <button
              type="button"
              onClick={loginAsAdminDirect}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold py-3 px-4 rounded-xl flex justify-center items-center gap-2.5 transition-colors text-sm"
            >
              <Key className="w-4 h-4 text-blue-600" />
              <span>Ingreso Inmediato de Administrador (ventasizcormedic)</span>
            </button>
          </div>
          
          <p className="text-[11px] text-slate-400 mt-6">
            Acceso restringido a personal autorizado de IZCOR MEDIC S.A.C. Todas las operaciones son auditadas.
          </p>
        </div>
      </div>
    );
  }

  // Sidebar Menu Sections
  const menuSections = [
    {
      title: 'OPERACIONES',
      items: [
        { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
        { id: 'products', label: 'Gestión de Productos', icon: Package },
        { id: 'review', label: 'Centro de Revisión', icon: Eye, badge: stats?.reviewProducts },
        { id: 'validation', label: 'Control de Calidad', icon: CheckCircle2 },
        { id: 'deduplication', label: 'Deduplicación & Fusión', icon: ShieldCheck, badge: stats?.pendingAlerts?.duplicateCases },
      ]
    },
    {
      title: 'CATÁLOGO MAESTRO',
      items: [
        { id: 'brands', label: 'Fabricantes & Marcas', icon: Tag },
        { id: 'categories', label: 'Categorías Médicas', icon: Layers },
        { id: 'media', label: 'Imágenes & Documentos', icon: ImageIcon },
        { id: 'sources', label: 'Fuentes de Extracción', icon: Globe },
      ]
    },
    {
      title: 'AUTOMATIZACIÓN & EXTRACCIÓN',
      items: [
        { id: 'autonomous', label: 'Motor Autónomo', icon: Zap },
        { id: 'scraper', label: 'Web Scraper', icon: Upload },
        { id: 'import', label: 'Importación Masiva (Jobs)', icon: DatabaseBackup },
        { id: 'errors', label: 'Alertas & Errores', icon: AlertOctagon, badge: stats?.pendingAlerts?.validationErrors },
      ]
    },
    {
      title: 'GOBERNANZA & ESCALA',
      items: [
        { id: 'readiness', label: 'Auditoría & Preparación 50K+', icon: ShieldCheck },
        { id: 'audit', label: 'Historial & Auditoría', icon: FileText },
        { id: 'analytics', label: 'Analítica & Métricas', icon: BarChart3 },
        { id: 'users', label: 'Usuarios & Permisos', icon: Users },
        { id: 'performance', label: 'Rendimiento & Escala', icon: Gauge },
        { id: 'health', label: 'Salud del Sistema', icon: Activity },
        { id: 'settings', label: 'Configuración & Mantenimiento', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar - Dark Mode */}
      <aside className="w-64 bg-[#0B1329] text-slate-300 flex flex-col fixed inset-y-0 left-0 z-20 shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-white/5 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">
              IZ
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-sm block">Izcor Medic</span>
              <span className="text-[10px] text-blue-400 font-semibold block tracking-wider uppercase">Centro de Control</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'hover:bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/5 bg-[#080E1E]">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 border border-white/10 flex items-center justify-center text-white font-bold text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user.email}</div>
              <button 
                onClick={handleSignOut} 
                className="text-[11px] text-slate-400 hover:text-rose-400 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Panel Administrativo
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-bold text-slate-700 capitalize">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchDashboardStats(user)}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="Sincronizar métricas"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Sincronizar</span>
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">En Línea</span>
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="p-8 flex-1">
          {activeTab === 'dashboard' && (
            <AdminDashboard 
              stats={stats} 
              isLoading={loading}
              onNavigate={(tab) => {
                if (tab === 'REVIEW') {
                  setActiveTab('review');
                } else if (tab === 'OUTDATED') {
                  setActiveTab('products');
                  setProductFilterInitial('OUTDATED');
                } else {
                  setActiveTab(tab.toLowerCase());
                }
              }} 
              onRefresh={() => fetchDashboardStats(user)}
            />
          )}

          {activeTab === 'products' && (
            <ProductManager 
              user={user} 
              initialFilter={productFilterInitial} 
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'review' && (
            <ProductReviewWorkspace user={user} />
          )}

          {activeTab === 'validation' && (
            <ValidationManager user={user} />
          )}

          {activeTab === 'deduplication' && (
            <DeduplicationManager user={user} />
          )}

          {activeTab === 'brands' && (
            <ManufacturersManager 
              user={user} 
              onFilterProductsByManufacturer={(mfg) => {
                setActiveTab('products');
              }}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesManager 
              user={user} 
              onFilterProductsByCategory={(catId) => {
                setActiveTab('products');
              }}
            />
          )}

          {activeTab === 'media' && (
            <MediaCenterManager 
              user={user} 
              onFilterProductsWithoutImage={() => {
                setActiveTab('products');
              }}
            />
          )}

          {activeTab === 'sources' && (
            <SourcesManager user={user} />
          )}

          {activeTab === 'autonomous' && (
            <AutonomousEngineManager user={user} onRefresh={() => fetchDashboardStats(user)} />
          )}

          {activeTab === 'scraper' && (
            <ScraperManager user={user} />
          )}

          {activeTab === 'import' && (
            <MassImportManager user={user} />
          )}

          {activeTab === 'errors' && (
            <ErrorCenterManager 
              user={user} 
              onRetrySource={() => setActiveTab('scraper')}
            />
          )}

          {activeTab === 'readiness' && (
            <ReadinessReportManager 
              user={user} 
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogsManager user={user} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsManager stats={stats} />
          )}

          {activeTab === 'users' && (
            <UsersManager user={user} />
          )}

          {activeTab === 'performance' && (
            <PerformanceManager user={user} />
          )}

          {activeTab === 'health' && (
            <SystemHealthManager user={user} />
          )}

          {activeTab === 'settings' && (
            <SettingsManager user={user} />
          )}
        </div>
      </main>
    </div>
  );
}
