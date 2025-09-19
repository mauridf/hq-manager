import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardResponse, EstatisticasEditorasResponse, DashboardEstatisticas, HQRecente, EstatisticaEditora } from '../../models/dashboard.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BaseChartDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isLoading = true;
  estatisticas: DashboardEstatisticas | null = null;
  hqsRecentes: HQRecente[] = [];
  estatisticasEditoras: EstatisticaEditora[] = [];

  // Gráfico de Pizza - Distribuição de HQs por Editora
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      title: {
        display: true,
        text: 'HQs por Editora'
      }
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#FF6384', '#C9CBCF', '#4BC0C0', '#FFCD56', '#FF6384', '#36A2EB'
      ]
    }]
  };

  public pieChartType: ChartType = 'pie';

  // Gráfico de Barras - Status das HQs por Editora
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Status das HQs por Editora'
      }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Em Andamento',
        data: [],
        backgroundColor: '#36A2EB'
      },
      {
        label: 'Finalizadas',
        data: [],
        backgroundColor: '#4BC0C0'
      },
      {
        label: 'Canceladas',
        data: [],
        backgroundColor: '#FF6384'
      },
      {
        label: 'Incompletas',
        data: [],
        backgroundColor: '#FFCE56'
      }
    ]
  };

  public barChartType: ChartType = 'bar';

  // Gráfico de Donut - Taxa de Leitura por Editora
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      title: {
        display: true,
        text: 'Taxa de Leitura por Editora (%)'
      }
    }
  };

  public doughnutChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#FF6384', '#C9CBCF', '#4BC0C0', '#FFCD56', '#FF6384', '#36A2EB'
      ]
    }]
  };

  public doughnutChartType: ChartType = 'doughnut';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.isLoading = true;

    // Carregar dados do dashboard
    this.dashboardService.getDashboard().subscribe({
      next: (response) => {
        this.estatisticas = response.estatisticas;
        this.hqsRecentes = response.hQsRecentes;
        this.carregarEstatisticasEditoras();
      },
      error: (error) => {
        console.error('Erro ao carregar dashboard:', error);
        this.isLoading = false;
      }
    });
  }

  carregarEstatisticasEditoras(): void {
    this.dashboardService.getEstatisticasEditoras().subscribe({
      next: (response) => {
        this.estatisticasEditoras = response.estatisticas;
        this.configurarGraficos();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas das editoras:', error);
        this.isLoading = false;
      }
    });
  }

  configurarGraficos(): void {
    this.configurarGraficoPizza();
    this.configurarGraficoBarras();
    this.configurarGraficoDonut();
  }

  configurarGraficoPizza(): void {
    const editorasComHQs = this.estatisticasEditoras.filter(e => e.totalHQs > 0);
    
    this.pieChartData = {
      labels: editorasComHQs.map(e => e.editoraNome),
      datasets: [{
        data: editorasComHQs.map(e => e.totalHQs),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FF6384', '#C9CBCF', '#4BC0C0', '#FFCD56', '#FF6384', '#36A2EB'
        ].slice(0, editorasComHQs.length)
      }]
    };
  }

  configurarGraficoBarras(): void {
    const editorasComHQs = this.estatisticasEditoras.filter(e => e.totalHQs > 0);
    
    this.barChartData = {
      labels: editorasComHQs.map(e => e.editoraNome),
      datasets: [
        {
          label: 'Em Andamento',
          data: editorasComHQs.map(e => e.hQsEmAndamento),
          backgroundColor: '#36A2EB'
        },
        {
          label: 'Finalizadas',
          data: editorasComHQs.map(e => e.hQsFinalizadas),
          backgroundColor: '#4BC0C0'
        },
        {
          label: 'Canceladas',
          data: editorasComHQs.map(e => e.hQsCanceladas),
          backgroundColor: '#FF6384'
        },
        {
          label: 'Incompletas',
          data: editorasComHQs.map(e => e.hQsIncompletas),
          backgroundColor: '#FFCE56'
        }
      ]
    };
  }

  configurarGraficoDonut(): void {
    const editorasComEdicoes = this.estatisticasEditoras.filter(e => e.totalEdicoes > 0);
    
    this.doughnutChartData = {
      labels: editorasComEdicoes.map(e => e.editoraNome),
      datasets: [{
        data: editorasComEdicoes.map(e => 
          e.totalEdicoes > 0 ? (e.edicoesLidas / e.totalEdicoes) * 100 : 0
        ),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FF6384', '#C9CBCF', '#4BC0C0', '#FFCD56', '#FF6384', '#36A2EB'
        ].slice(0, editorasComEdicoes.length)
      }]
    };
  }

  getPorcentagemLeitura(edicoesLidas: number, totalEdicoes: number): number {
    return totalEdicoes > 0 ? Math.round((edicoesLidas / totalEdicoes) * 100) : 0;
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completo':
        return '#4caf50';
      case 'em andamento':
        return '#2196f3';
      case 'finalizado':
        return '#ff9800';
      case 'cancelado':
        return '#f44336';
      case 'incompleto':
        return '#9e9e9e';
      default:
        return '#607d8b';
    }
  }
}