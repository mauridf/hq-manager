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
import { EditoraFormComponent } from '../../components/editora-form/editora-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { EditoraService } from '../../services/editora.service';
import { Editora, EditoraResponse, PaginatedResponse } from '../../models/editora.model';

@Component({
  selector: 'app-editoras',
  standalone: true,
  imports: [CommonModule, DataTableComponent, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './editoras.component.html',
  styleUrl: './editoras.component.scss'
})
export class EditorasComponent implements OnInit, OnDestroy {
  editoras: EditoraResponse[] = [];
  isLoading = false;
  
  // Pagination
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  columns: ColumnDefinition[] = [
    { key: 'nome', header: 'Nome', type: 'text' },
    { key: 'anoCriacao', header: 'Ano Criação', type: 'number' },
    { key: 'logotipo', header: 'Logotipo', type: 'image' },
    { key: 'paisOrigem', header: 'País Origem', type: 'text' },
    { key: 'siteOficial', header: 'Site Oficial', type: 'link' }
  ];

  actions: ActionDefinition[] = [
    {
      label: 'Editar',
      icon: 'edit',
      color: 'primary',
      action: (editora) => this.openEditDialog(editora)
    },
    {
      label: 'Excluir',
      icon: 'delete',
      color: 'warn',
      action: (editora) => this.openDeleteDialog(editora)
    }
  ];

  constructor(
    private editoraService: EditoraService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // Configurar debounce para a pesquisa
    this.searchSubject.pipe(
      debounceTime(300), // Aguarda 300ms após a última tecla
      distinctUntilChanged() // Só emite se o valor mudou
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.pageIndex = 0;
      this.loadEditoras();
    });
  }

  ngOnInit(): void {
    this.loadEditoras();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadEditoras(): void {
    this.isLoading = true;
    this.editoraService.getEditoras(this.pageIndex + 1, this.pageSize, this.searchTerm)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: PaginatedResponse<EditoraResponse>) => {
          this.editoras = response?.items || [];
          this.totalItems = response?.total || 0;
        },
        error: (error) => {
          console.error('Erro ao carregar editoras:', error);
          this.editoras = [];
          this.showError('Erro ao carregar editoras');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEditoras();
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onAddNew(): void {
    this.openCreateDialog();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(EditoraFormComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createEditora(result);
      }
    });
  }

  openEditDialog(editora: EditoraResponse): void {
    const dialogRef = this.dialog.open(EditoraFormComponent, {
      width: '600px',
      data: { editora, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateEditora(editora.id!, result);
      }
    });
  }

  openDeleteDialog(editora: EditoraResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja excluir a editora "${editora.nome}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteEditora(editora.id!);
      }
    });
  }

  private createEditora(editoraData: Editora): void {
    this.editoraService.createEditora(editoraData).subscribe({
      next: () => {
        this.showSuccess('Editora criada com sucesso!');
        this.loadEditoras();
      },
      error: (error) => {
        this.showError('Erro ao criar editora');
      }
    });
  }

  private updateEditora(id: string, editoraData: Editora): void {
    this.editoraService.updateEditora(id, editoraData).subscribe({
      next: () => {
        this.showSuccess('Editora atualizada com sucesso!');
        this.loadEditoras();
      },
      error: (error) => {
        this.showError('Erro ao atualizar editora');
      }
    });
  }

  private deleteEditora(id: string): void {
    this.editoraService.deleteEditora(id).subscribe({
      next: () => {
        this.showSuccess('Editora excluída com sucesso!');
        this.loadEditoras();
      },
      error: (error) => {
        this.showError('Erro ao excluir editora');
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