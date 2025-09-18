import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DataTableComponent, ColumnDefinition, ActionDefinition } from '../data-table/data-table.component';
import { EdicaoFormComponent } from '../edicao-form/edicao-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DescricaoDialogComponent } from '../descricao-dialog/descricao-dialog.component';
import { HqService } from '../../services/hq.service';
import { EdicaoResponse, EstatisticasEdicoes, HQResponse } from '../../models/hq.model';

interface EdicoesDialogData {
  hq: HQResponse;
}

@Component({
  selector: 'app-edicoes-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    DataTableComponent
  ],
  templateUrl: './edicoes-dialog.component.html',
  styleUrl: './edicoes-dialog.component.scss'
})
export class EdicoesDialogComponent implements OnInit {
  edicoes: EdicaoResponse[] = [];
  estatisticas: EstatisticasEdicoes | null = null;
  isLoading = false;
  isLoadingEstatisticas = false;

  columns: ColumnDefinition[] = [
    { key: 'titulo', header: 'Título', type: 'text' },
    { key: 'numero', header: 'Número', type: 'text' },
    { 
      key: 'sinopse', 
      header: 'Sinopse', 
      type: 'text',
      formatter: (value: string) => this.formatarTexto(value)
    },
    { key: 'capa', header: 'Capa', type: 'image' },
    { 
      key: 'lida', 
      header: 'Lida', 
      type: 'text',
      formatter: (value: boolean) => value ? '✓' : '✗'
    },
    { 
      key: 'obs', 
      header: 'Observação', 
      type: 'text',
      formatter: (value: string) => this.formatarTexto(value)
    },
    { key: 'nota', header: 'Nota', type: 'number' },
    { 
      key: 'dataLeitura', 
      header: 'Data Leitura', 
      type: 'text',
      formatter: (value: Date) => value ? new Date(value).toLocaleDateString('pt-BR') : '-'
    }
  ];

  actions: ActionDefinition[] = [
    {
      label: 'Editar',
      icon: 'edit',
      color: 'primary',
      action: (edicao) => this.openEditDialog(edicao)
    },
    {
      label: 'Excluir',
      icon: 'delete',
      color: 'warn',
      action: (edicao) => this.openDeleteDialog(edicao)
    },
    {
      label: 'Ver Sinopse',
      icon: 'description',
      color: 'primary',
      action: (edicao) => this.mostrarSinopse(edicao)
    },
    {
      label: 'Ver Observação',
      icon: 'notes',
      color: 'accent',
      action: (edicao) => this.mostrarObservacao(edicao)
    },
    {
      label: 'Marcar como Lida',
      icon: 'check_circle',
      color: 'primary',
      action: (edicao) => this.marcarComoLida(edicao, true)
    },
    {
      label: 'Marcar como Não Lida',
      icon: 'radio_button_unchecked',
      color: 'accent',
      action: (edicao) => this.marcarComoLida(edicao, false)
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<EdicoesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EdicoesDialogData,
    private dialog: MatDialog,
    private hqService: HqService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEdicoes();
    this.loadEstatisticas();
  }

  loadEdicoes(): void {
    this.isLoading = true;
    this.hqService.getEdicoesByHQ(this.data.hq.id)
      .subscribe({
        next: (edicoes) => {
          this.edicoes = edicoes;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar edições:', error);
          this.isLoading = false;
          this.showError('Erro ao carregar edições');
        }
      });
  }

  loadEstatisticas(): void {
    this.isLoadingEstatisticas = true;
    this.hqService.getEstatisticasEdicoes(this.data.hq.id)
      .subscribe({
        next: (estatisticas) => {
          this.estatisticas = estatisticas;
          this.isLoadingEstatisticas = false;
        },
        error: (error) => {
          console.error('Erro ao carregar estatísticas:', error);
          this.isLoadingEstatisticas = false;
        }
      });
  }

  formatarTexto(texto: string): string {
    if (!texto) return '-';
    if (texto.length > 50) {
      return texto.substring(0, 50) + '...';
    }
    return texto;
  }

  mostrarSinopse(edicao: EdicaoResponse): void {
    this.dialog.open(DescricaoDialogComponent, {
      width: '500px',
      data: {
        titulo: `Sinopse - ${edicao.titulo} #${edicao.numero}`,
        descricao: edicao.sinopse || 'Nenhuma sinopse registrada'
      }
    });
  }

  mostrarObservacao(edicao: EdicaoResponse): void {
    this.dialog.open(DescricaoDialogComponent, {
      width: '500px',
      data: {
        titulo: `Observação - ${edicao.titulo} #${edicao.numero}`,
        descricao: edicao.obs || 'Nenhuma observação registrada'
      }
    });
  }

  marcarComoLida(edicao: EdicaoResponse, lida: boolean): void {
    this.hqService.marcarComoLida(edicao.id, lida)
      .subscribe({
        next: () => {
          this.showSuccess(`Edição marcada como ${lida ? 'lida' : 'não lida'}!`);
          this.loadEdicoes();
          this.loadEstatisticas();
        },
        error: (error) => {
          console.error('Erro ao marcar edição:', error);
          this.showError('Erro ao marcar edição');
        }
      });
  }

  onAddNovaEdicao(): void {
    const dialogRef = this.dialog.open(EdicaoFormComponent, {
      width: '600px',
      data: {
        hqId: this.data.hq.id,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createEdicao(result);
      }
    });
  }

  openEditDialog(edicao: EdicaoResponse): void {
    const dialogRef = this.dialog.open(EdicaoFormComponent, {
      width: '600px',
      data: {
        edicao,
        hqId: this.data.hq.id,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateEdicao(edicao.id, result);
      }
    });
  }

  openDeleteDialog(edicao: EdicaoResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja excluir a edição "${edicao.titulo} #${edicao.numero}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteEdicao(edicao.id);
      }
    });
  }

  private createEdicao(edicaoData: any): void {
    this.hqService.createEdicao(edicaoData)
      .subscribe({
        next: () => {
          this.showSuccess('Edição criada com sucesso!');
          this.loadEdicoes();
          this.loadEstatisticas();
        },
        error: (error) => {
          console.error('Erro ao criar edição:', error);
          this.showError('Erro ao criar edição');
        }
      });
  }

  private updateEdicao(id: string, edicaoData: any): void {
    this.hqService.updateEdicao(id, edicaoData)
      .subscribe({
        next: () => {
          this.showSuccess('Edição atualizada com sucesso!');
          this.loadEdicoes();
          this.loadEstatisticas();
        },
        error: (error) => {
          console.error('Erro ao atualizar edição:', error);
          this.showError('Erro ao atualizar edição');
        }
      });
  }

  private deleteEdicao(id: string): void {
    this.hqService.deleteEdicao(id)
      .subscribe({
        next: () => {
          this.showSuccess('Edição excluída com sucesso!');
          this.loadEdicoes();
          this.loadEstatisticas();
        },
        error: (error) => {
          console.error('Erro ao excluir edição:', error);
          this.showError('Erro ao excluir edição');
        }
      });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}