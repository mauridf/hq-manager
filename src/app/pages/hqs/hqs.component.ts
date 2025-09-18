import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DataTableComponent, ColumnDefinition, ActionDefinition } from '../../components/data-table/data-table.component';
import { HqFormComponent } from '../../components/hq-form/hq-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { DescricaoDialogComponent } from '../../components/descricao-dialog/descricao-dialog.component';
import { EdicoesDialogComponent } from '../../components/edicoes-dialog/edicoes-dialog.component';
import { HqService } from '../../services/hq.service';
import { HQResponse, TIPOS_PUBLICACAO, STATUS_HQ } from '../../models/hq.model';

@Component({
  selector: 'app-hqs',
  standalone: true,
  imports: [CommonModule, DataTableComponent, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './hqs.component.html',
  styleUrl: './hqs.component.scss'
})
export class HqsComponent implements OnInit, OnDestroy {
  hqs: HQResponse[] = [];
  isLoading = false;
  
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  columns: ColumnDefinition[] = [
    { key: 'nome', header: 'Nome', type: 'text' },
    { 
      key: 'nomeOriginal', 
      header: 'Nome Original', 
      type: 'text',
      formatter: (value: string) => value || '-'
    },
    { 
      key: 'tipoPublicacao', 
      header: 'Tipo Publicação', 
      type: 'text',
      formatter: (value: number) => this.getTipoPublicacaoDescricao(value)
    },
    { 
      key: 'status', 
      header: 'Status', 
      type: 'text',
      formatter: (value: number) => this.getStatusDescricao(value)
    },
    { key: 'totalEdicoes', header: 'Total Edições', type: 'number' },
    { 
      key: 'sinopse', 
      header: 'Sinopse', 
      type: 'text',
      formatter: (value: string) => this.formatarSinopse(value)
    },
    { key: 'anoLancamento', header: 'Ano Lançamento', type: 'number' },
    { key: 'imagem', header: 'Imagem', type: 'image' },
    { 
      key: 'tags', 
      header: 'Tags', 
      type: 'text',
      formatter: (value: string[]) => value?.join(', ') || '-'
    }
  ];

  actions: ActionDefinition[] = [
    {
      label: 'Editar',
      icon: 'edit',
      color: 'primary',
      action: (hq) => this.openEditDialog(hq)
    },
    {
      label: 'Excluir',
      icon: 'delete',
      color: 'warn',
      action: (hq) => this.openDeleteDialog(hq)
    },
    {
      label: 'Ver Sinopse',
      icon: 'description',
      color: 'primary',
      action: (hq) => this.mostrarSinopseCompleta(hq.nome, hq.sinopse)
    },
    {
      label: 'Gerenciar Edições',
      icon: 'collections_bookmark',
      color: 'accent',
      action: (hq) => this.openEdicoesDialog(hq)
    }
  ];

  constructor(
    private hqService: HqService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.pageIndex = 0;
      this.loadHQs();
    });
  }

  ngOnInit(): void {
    this.loadHQs();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadHQs(): void {
    this.isLoading = true;
    this.hqService.getHQs(this.pageIndex + 1, this.pageSize, this.searchTerm)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.hqs = response.items;
          this.totalItems = response.total;
        },
        error: (error) => {
          console.error('Erro ao carregar HQs:', error);
          this.showError('Erro ao carregar HQs');
        }
      });
  }

  getTipoPublicacaoDescricao(valor: number): string {
    const tipo = TIPOS_PUBLICACAO.find(t => t.valor === valor);
    return tipo?.descricao || 'Desconhecido';
  }

  getStatusDescricao(valor: number): string {
    const status = STATUS_HQ.find(s => s.valor === valor);
    return status?.descricao || 'Desconhecido';
  }

  formatarSinopse(sinopse: string): string {
    if (sinopse && sinopse.length > 100) {
      return sinopse.substring(0, 100) + '...';
    }
    return sinopse || '-';
  }

  mostrarSinopseCompleta(nome: string, sinopse: string): void {
    this.dialog.open(DescricaoDialogComponent, {
      width: '500px',
      data: {
        titulo: `Sinopse - ${nome}`,
        descricao: sinopse || 'Nenhuma sinopse registrada'
      }
    });
  }

  openEdicoesDialog(hq: HQResponse): void {
    this.dialog.open(EdicoesDialogComponent, {
      width: '800px',
      data: { hq }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHQs();
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onAddNew(): void {
    this.openCreateDialog();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(HqFormComponent, {
      width: '800px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createHQ(result);
      }
    });
  }

  openEditDialog(hq: HQResponse): void {
    const dialogRef = this.dialog.open(HqFormComponent, {
      width: '800px',
      data: { hq, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateHQ(hq.id, result);
      }
    });
  }

  openDeleteDialog(hq: HQResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja excluir a HQ "${hq.nome}"? Todas as edições serão excluídas.`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteHQ(hq.id);
      }
    });
  }

  private createHQ(hqData: any): void {
    this.hqService.createHQ(hqData).subscribe({
      next: () => {
        this.showSuccess('HQ criada com sucesso!');
        this.loadHQs();
      },
      error: (error) => {
        this.showError('Erro ao criar HQ');
      }
    });
  }

  private updateHQ(id: string, hqData: any): void {
    this.hqService.updateHQ(id, hqData).subscribe({
      next: () => {
        this.showSuccess('HQ atualizada com sucesso!');
        this.loadHQs();
      },
      error: (error) => {
        this.showError('Erro ao atualizar HQ');
      }
    });
  }

  private deleteHQ(id: string): void {
    this.hqService.deleteHQ(id).subscribe({
      next: () => {
        this.showSuccess('HQ excluída com sucesso!');
        this.loadHQs();
      },
      error: (error) => {
        this.showError('Erro ao excluir HQ');
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
}