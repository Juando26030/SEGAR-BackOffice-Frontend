import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthKeycloakService } from '../../auth/services/auth-keycloak.service';

interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

interface Stat {
  number: string;
  label: string;
  icon: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  badge?: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {

  stats: Stat[] = [
    { number: '500+', label: 'Empresas confían en SEGAR', icon: '🏢' },
    { number: '50K+', label: 'Trámites gestionados', icon: '📊' },
    { number: '99.9%', label: 'Uptime garantizado', icon: '⚡' },
    { number: '24/7', label: 'Soporte disponible', icon: '💬' }
  ];

  features: Feature[] = [
    {
      icon: '📊',
      title: 'Dashboard Inteligente',
      description: 'Visualiza el estado de todos tus trámites en tiempo real con gráficas interactivas y KPIs personalizados',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: '📝',
      title: 'Gestión de Trámites',
      description: 'Crea, edita y da seguimiento completo a registros sanitarios, renovaciones y modificaciones',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: '📅',
      title: 'Calendario Inteligente',
      description: 'Nunca pierdas una fecha límite con recordatorios automáticos y vista de eventos programados',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: '📄',
      title: 'Documentos Dinámicos',
      description: 'Genera automáticamente formularios y documentos oficiales con información pre-cargada',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: '🔔',
      title: 'Notificaciones en Tiempo Real',
      description: 'Mantente informado con alertas personalizadas de cambios de estado y vencimientos próximos',
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: '🔍',
      title: 'Búsqueda Global Avanzada',
      description: 'Encuentra cualquier trámite, documento o registro con filtros inteligentes en segundos',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: '👥',
      title: 'Gestión de Usuarios',
      description: 'Administra equipos con roles y permisos granulares, asignación de tareas y seguimiento',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      icon: '📧',
      title: 'Comunicación Integrada',
      description: 'Envía correos directamente desde la plataforma con plantillas predefinidas y seguimiento',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: '🌍',
      title: 'Multi-País y Multi-Empresa',
      description: 'Gestiona operaciones en múltiples países y empresas desde una sola cuenta',
      gradient: 'from-teal-500 to-teal-600'
    },
    {
      icon: '💰',
      title: 'Control de Costos',
      description: 'Rastrea gastos de tasas regulatorias y honorarios con reportes financieros detallados',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: '🔐',
      title: 'Seguridad Empresarial',
      description: 'Protección de datos con encriptación, autenticación de dos factores y auditoría completa',
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      icon: '📈',
      title: 'Reportes y Análisis',
      description: 'Genera reportes personalizados con métricas de rendimiento y análisis predictivo',
      gradient: 'from-violet-500 to-violet-600'
    }
  ];

  pricingPlans: PricingPlan[] = [
    {
      name: 'Prueba Gratuita',
      price: '$0',
      period: '30 días',
      description: 'Perfecto para conocer la plataforma',
      features: [
        'Hasta 10 trámites activos',
        '1 usuario administrador',
        'Dashboard básico',
        'Notificaciones por email',
        'Soporte por email',
        'Acceso a documentación',
        'Almacenamiento 1GB'
      ],
      highlighted: false,
      cta: 'Comenzar prueba gratis',
      badge: 'Sin tarjeta de crédito'
    },
    {
      name: 'Plan Mensual',
      price: '$99',
      period: 'por mes',
      description: 'Ideal para pequeñas empresas',
      features: [
        'Trámites ilimitados',
        'Hasta 5 usuarios',
        'Dashboard completo con gráficas',
        'Notificaciones multi-canal',
        'Soporte prioritario 24/7',
        'Documentos dinámicos ilimitados',
        'Almacenamiento 50GB',
        'API REST incluida',
        'Calendario inteligente',
        'Búsqueda avanzada'
      ],
      highlighted: false,
      cta: 'Empezar ahora'
    },
    {
      name: 'Plan Anual',
      price: '$990',
      period: 'por año',
      description: 'Mejor valor para empresas en crecimiento',
      features: [
        'Todo del plan mensual',
        'Usuarios ilimitados',
        '2 meses gratis (ahorra $198)',
        'Soporte dedicado 24/7',
        'Almacenamiento 200GB',
        'Capacitación personalizada',
        'Integraciones personalizadas',
        'Reportes avanzados',
        'Multi-empresa incluido',
        'Consultoría regulatoria',
        'SLA 99.9% uptime',
        'Backup diario automático'
      ],
      highlighted: true,
      cta: 'Mejor oferta - Contratar',
      badge: 'Más popular'
    }
  ];

  industries = [
    { name: 'Alimentos y Bebidas', icon: '🍎', color: 'bg-green-100 text-green-600' },
    { name: 'Farmacéutica', icon: '💊', color: 'bg-blue-100 text-blue-600' },
    { name: 'Cosméticos', icon: '💄', color: 'bg-pink-100 text-pink-600' },
    { name: 'Dispositivos Médicos', icon: '🏥', color: 'bg-red-100 text-red-600' },
    { name: 'Productos Veterinarios', icon: '🐾', color: 'bg-purple-100 text-purple-600' },
    { name: 'Suplementos', icon: '💊', color: 'bg-orange-100 text-orange-600' }
  ];

  testimonials = [
    {
      quote: 'SEGAR transformó completamente nuestra gestión regulatoria. Redujimos el tiempo de procesamiento en un 70%.',
      author: 'María González',
      role: 'Directora de Asuntos Regulatorios',
      company: 'AlimentosCol S.A.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      quote: 'La mejor inversión que hicimos. Ahora manejamos registros en 5 países sin complicaciones.',
      author: 'Carlos Ramírez',
      role: 'Gerente de Calidad',
      company: 'FarmaLat Internacional',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      quote: 'El soporte es excepcional. Cada vez que tenemos dudas, responden en minutos.',
      author: 'Ana Martínez',
      role: 'Coordinadora Regulatoria',
      company: 'Cosmética Natural',
      avatar: '👩‍🔬',
      rating: 5
    }
  ];

  faqs = [
    {
      question: '¿Qué incluye la prueba gratuita?',
      answer: 'Acceso completo a todas las funcionalidades durante 30 días sin necesidad de tarjeta de crédito. Puedes gestionar hasta 10 trámites y probar todas las herramientas.',
      open: false
    },
    {
      question: '¿Puedo cambiar de plan en cualquier momento?',
      answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Si cambias a un plan anual, se prorrateará el tiempo restante de tu plan actual.',
      open: false
    },
    {
      question: '¿Los datos están seguros?',
      answer: 'Absolutamente. Utilizamos encriptación de grado bancario, servidores en la nube con certificación ISO 27001, y realizamos backups automáticos diarios.',
      open: false
    },
    {
      question: '¿Ofrecen capacitación?',
      answer: 'Sí, incluimos capacitación en el plan anual. Para otros planes, ofrecemos sesiones de onboarding y documentación completa en video.',
      open: false
    },
    {
      question: '¿Qué países están soportados?',
      answer: 'SEGAR está diseñado para manejar trámites en cualquier país. Actualmente tenemos clientes operando en más de 15 países de Latinoamérica.',
      open: false
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthKeycloakService
  ) {}

  ngOnInit(): void {
    // NO redirigir automáticamente - permitir ver la landing page
    // El usuario decide cuándo hacer login con el botón

    // Animaciones al scroll
    this.setupScrollAnimations();
  }

  async navigateToLogin(): Promise<void> {
    // Redirigir al login del frontend (compartido)
    window.location.href = 'http://localhost:4200/auth/login';
  }

  async startFreeTrial(): Promise<void> {
    // Redirigir al login del frontend para la prueba gratuita
    window.location.href = 'http://localhost:4200/auth/login';
  }

  setupScrollAnimations(): void {
    if (typeof window !== 'undefined') {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      }, observerOptions);

      setTimeout(() => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => observer.observe(el));
      }, 100);
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  contactSales(): void {
    this.scrollToSection('contact');
  }
}

