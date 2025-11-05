import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-barra-superior',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-barra-superior.component.html',
  styleUrl: './admin-barra-superior.component.css'
})
export class AdminBarraSuperiorComponent {
  currentDate = new Date();
}

