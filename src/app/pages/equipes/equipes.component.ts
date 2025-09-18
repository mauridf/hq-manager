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
import { EquipeFormComponent } from '../../components/equipe-form/equipe-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { DescricaoDialogComponent } from '../../components/descricao-dialog/descricao-dialog.component';
import { EquipeService } from '../../services/equipe.service';
import { Equipe, EquipeResponse, PaginatedResponse } from '../../models/equipe.model';

@Component({
  selector: 'app-equipes',
  standalone: true,
  imports: [CommonModule, DataTableComponent, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './equipes.component.html',
  styleUrl: './equipes.component.scss'
})
export class EquipesComponent implements OnInit, OnDestroy {
  equipes: EquipeResponse[] = [];
  isLoading = false;
  
  // Pagination
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  columns: ColumnDefinition[] = [
    { key: 'nome', header: 'Nome', type: 'text' },
    { 
      key: 'descricao', 
      header: 'Descrição', 
      type: 'text',
      formatter: (value: string) => this.formatarDescricao(value)
    },
    { key: 'imagem', header: 'Imagem', type: 'image' },
    { key: 'anoCriacao', header: 'Ano de Criação', type: 'number' }
  ];

  actions: ActionDefinition[] = [
    {
      label: 'Editar',
      icon: 'edit',
      color: 'primary',
      action: (equipe) => this.openEditDialog(equipe)
    },
    {
      label: 'Excluir',
      icon: 'delete',
      color: 'warn',
      action: (equipe) => this.openDeleteDialog(equipe)
    },
    {
      label: 'Ver Descrição',
      icon: 'description',
      color: 'primary',
      action: (equipe) => this.mostrarDescricaoCompleta(equipe.nome, equipe.descricao)
    }
  ];

  constructor(
    private equipeService: EquipeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.pageIndex = 0;
      this.loadEquipes();
    });
  }

  ngOnInit(): void {
    this.loadEquipes();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadEquipes(): void {
    this.isLoading = true;
    this.equipeService.getEquipes(this.pageIndex + 1, this.pageSize, this.searchTerm)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: PaginatedResponse<EquipeResponse>) => {
          this.equipes = response?.items || [];
          this.totalItems = response?.total || 0;
        },
        error: (error) => {
          console.error('Erro ao carregar equipes:', error);
          this.equipes = [];
          this.showError('Erro ao carregar equipes');
        }
      });
  }

  formatarDescricao(descricao: string): string {
    if (descricao && descricao.length > 100) {
      return descricao.substring(0, 100) + '...';
    }
    return descricao || '-';
  }

  mostrarDescricaoCompleta(nome: string, descricao: string): void {
    this.dialog.open(DescricaoDialogComponent, {
      width: '500px',
      data: {
        titulo: `Descrição - ${nome}`,
        descricao: descricao
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEquipes();
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onAddNew(): void {
    this.openCreateDialog();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(EquipeFormComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createEquipe(result);
      }
    });
  }

  openEditDialog(equipe: EquipeResponse): void {
    const dialogRef = this.dialog.open(EquipeFormComponent, {
      width: '600px',
      data: { equipe, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateEquipe(equipe.id!, result);
      }
    });
  }

  openDeleteDialog(equipe: EquipeResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja excluir a equipe "${equipe.nome}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteEquipe(equipe.id!);
      }
    });
  }

  private createEquipe(equipeData: Equipe): void {
    this.equipeService.createEquipe(equipeData).subscribe({
      next: () => {
        this.showSuccess('Equipe criada com sucesso!');
        this.loadEquipes();
      },
      error: (error) => {
        this.showError('Erro ao criar equipe');
      }
    });
  }

  private updateEquipe(id: string, equipeData: Equipe): void {
    this.equipeService.updateEquipe(id, equipeData).subscribe({
      next: () => {
        this.showSuccess('Equipe atualizada com sucesso!');
        this.loadEquipes();
      },
      error: (error) => {
        this.showError('Erro ao atualizar equipe');
      }
    });
  }

  private deleteEquipe(id: string): void {
    this.equipeService.deleteEquipe(id).subscribe({
      next: () => {
        this.showSuccess('Equipe excluída com sucesso!');
        this.loadEquipes();
      },
      error: (error) => {
        this.showError('Erro ao excluir equipe');
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