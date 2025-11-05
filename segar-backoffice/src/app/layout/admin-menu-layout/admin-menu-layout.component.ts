import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminMenuLateralComponent } from '../admin-menu-lateral/admin-menu-lateral.component';
import { AdminBarraSuperiorComponent } from '../admin-barra-superior/admin-barra-superior.component';

/**
 * Layout principal del panel de administración
 * Contiene el menú lateral y la barra superior
 */
@Component({
  standalone: true,
  selector: 'app-admin-menu-layout',
  templateUrl: './admin-menu-layout.component.html',
  styleUrls: ['./admin-menu-layout.component.css'],
  imports: [CommonModule, RouterModule, AdminMenuLateralComponent, AdminBarraSuperiorComponent]
})
export class AdminMenuLayoutComponent implements OnInit {
  constructor(private readonly el: ElementRef) {}

  ngOnInit(): void {
    const button = this.el.nativeElement.querySelector('#mobile-menu-button');
    const menu = this.el.nativeElement.querySelector('#mobile-menu');

    if (button && menu) {
      button.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });

      document.addEventListener('click', (event) => {
        if (!button.contains(event.target) && !menu.contains(event.target)) {
          menu.classList.add('hidden');
        }
      });
    }
  }
}

