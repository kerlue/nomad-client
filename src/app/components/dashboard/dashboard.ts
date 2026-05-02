import { Component } from '@angular/core';
import { StatCard } from './stat-card/stat-card';
import { DashboardStat } from '../../shared/interface';

@Component({
  selector: 'app-dashboard',
  imports: [StatCard],
  styleUrl: './dashboard.scss',
  template: `
    <div class="dashboard">
      <div class="card-grid">
        @for (item of stats; track item.title; let i = $index) {
          <app-stat-card [stat]="item" [style.animation-delay]="i * 55 + 'ms'" />
        }
      </div>
    </div>
  `,
})
export class Dashboard {
  stats: DashboardStat[] = [
    {
      title: 'Integration Overview',
      headerIcon: '/package_2.svg',
      accentColor: '#6c63ff',
      stats: [
        { icon: '', label: 'Pending', value: '4280', trend: 'up', trendValue: '+12%' },
        { icon: '', label: 'Completed', value: '4280', trend: 'up', trendValue: '+12%' },
        { icon: '', label: 'Error', value: '4280', trend: 'up', trendValue: '+12%' },
        {
          icon: '',
          label: 'Total',
          value: '91,340',
          trend: 'up',
          trendValue: '+8%',
        },
      ],
    },
    {
      title: 'Integration Details',
      headerIcon: '/package_2.svg',
      accentColor: '#f59e0b',
      stats: [
        {
          icon: '',
          label: 'Dynamics',
          value: '1223',
          trend: 'up',
          trendValue: '+5%',
        },
        {
          icon: '',
          label: 'Integrated',
          value: '1223',
          trend: 'up',
          trendValue: '+5%',
        },
        {
          icon: 'person_off',
          label: 'Routed',
          value: '233',
          trend: 'down',
          trendValue: '-0.3%',
        },
        {
          icon: 'person_off',
          label: 'Shipped',
          value: '2332',
          trend: 'down',
          trendValue: '-0.3%',
        },
      ],
    },
    {
      title: 'Last Synced',
      headerIcon: '/package_2.svg',
      accentColor: '#0ea5e9',
      stats: [
        {
          icon: '',
          label: 'Dynamics',
          value: '1223',
          trend: 'up',
          trendValue: '+5%',
        },
        {
          icon: '',
          label: 'IntraDB',
          value: '12s',
          trend: 'up',
          trendValue: '+5%',
        },
        {
          icon: 'schedule',
          label: 'WaveDB',
          value: '5s',
          trend: 'up',
          trendValue: '+18s',
        },
        {
          icon: 'person_off',
          label: 'HighJumpDB',
          value: '30s',
          trend: 'down',
          trendValue: '-0.3%',
        },
        {
          icon: 'person_off',
          label: 'DriverDB',
          value: '230s',
          trend: 'down',
          trendValue: '-0.3%',
        },
      ],
    },
    {
      title: 'Avg. Integration Time',
      headerIcon: '/package_2.svg',
      accentColor: '#f59e0b',
      stats: [
        {
          icon: '',
          label: 'Dynamics',
          value: '1223',
          trend: 'up',
          trendValue: '+5%',
        },
        {
          icon: '',
          label: 'IntraDB',
          value: '12s',
          trend: 'up',
          trendValue: '+5%',
        },
        {
          icon: 'schedule',
          label: 'WaveDB',
          value: '5s',
          trend: 'up',
          trendValue: '+18s',
        },
        {
          icon: 'person_off',
          label: 'HighJumpDB',
          value: '30s',
          trend: 'down',
          trendValue: '-0.3%',
        },
        {
          icon: 'person_off',
          label: 'DriverDB',
          value: '230s',
          trend: 'down',
          trendValue: '-0.3%',
        },
      ],
    }
  ];
}
