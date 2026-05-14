import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { apiURL, defaultAccountCode } from '../../resources';

@Component({
  selector: 'app-docs-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './docs-shell.component.html',
  styleUrl: './docs-shell.component.scss'
})
export class DocsShellComponent {
  readonly tabs = [
    { label: 'Aplicações', route: '/applications', icon: 'pi pi-sitemap' },
    { label: 'Documentação da API', route: '/api', icon: 'pi pi-code' }
  ];

  readonly baseUrl = apiURL;
  readonly accountCode = defaultAccountCode;
}
