import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ConfigTab {
  id: string;
  label: string;
  icon: string;
}

interface SystemConfig {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  theme: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
  sessionTimeout: number;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  activeTab = 'preferences';
  hasChanges = false;
  saving = false;
  mensajeExito = '';
  mensajeError = '';

  tabs: ConfigTab[] = [
    {
      id: 'preferences',
      label: 'Preferencias',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: 'M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z'
    },
    {
      id: 'security',
      label: 'Seguridad',
      icon: 'M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z'
    },
    {
      id: 'system',
      label: 'Sistema',
      icon: 'M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z'
    }
  ];

  config: SystemConfig = {
    timezone: 'America/Bogota',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    language: 'es',
    theme: 'purple',
    emailNotifications: true,
    desktopNotifications: true,
    soundEnabled: true,
    autoSave: true,
    sessionTimeout: 30
  };

  private originalConfig: SystemConfig = { ...this.config };

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Configuración del sistema cargada');
    this.originalConfig = { ...this.config };
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  checkChanges() {
    this.hasChanges = JSON.stringify(this.config) !== JSON.stringify(this.originalConfig);
  }

  getPreviewDate(): string {
    const now = new Date();
    let dateStr = '';

    switch (this.config.dateFormat) {
      case 'DD/MM/YYYY':
        dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        break;
      case 'MM/DD/YYYY':
        dateStr = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
        break;
      case 'YYYY-MM-DD':
        dateStr = `${now.getFullYear}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        break;
    }

    let timeStr = '';
    if (this.config.timeFormat === '24h') {
      timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    } else {
      const hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      timeStr = `${hours12}:${now.getMinutes().toString().padStart(2, '0')} ${ampm}`;
    }

    return `${dateStr} ${timeStr}`;
  }

  guardarConfiguracion() {
    this.saving = true;

    setTimeout(() => {
      this.originalConfig = { ...this.config };
      this.hasChanges = false;
      this.saving = false;
      this.mensajeExito = 'Configuración guardada exitosamente';

      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  restaurarDefaults() {
    if (confirm('¿Estás seguro de que deseas restaurar la configuración por defecto?')) {
      this.config = {
        timezone: 'America/Bogota',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        language: 'es',
        theme: 'purple',
        emailNotifications: true,
        desktopNotifications: true,
        soundEnabled: true,
        autoSave: true,
        sessionTimeout: 30
      };
      this.checkChanges();
      this.mensajeExito = 'Configuración restaurada a valores por defecto';

      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
    }
  }

  cancelarCambios() {
    if (confirm('¿Estás seguro de que deseas descartar los cambios?')) {
      this.config = { ...this.originalConfig };
      this.hasChanges = false;
    }
  }

  goBack() {
    if (this.hasChanges) {
      if (confirm('Tienes cambios sin guardar. ¿Deseas salir de todos modos?')) {
        this.router.navigate(['/admin/dashboard']);
      }
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}

