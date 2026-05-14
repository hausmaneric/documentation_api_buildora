import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { applicationsOverview, implementationFlow } from '../../data/applications.data';

@Component({
  selector: 'app-applications-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications-overview.component.html',
  styleUrl: './applications-overview.component.scss'
})
export class ApplicationsOverviewComponent {
  readonly cards = applicationsOverview;
  readonly flow = implementationFlow;
}
