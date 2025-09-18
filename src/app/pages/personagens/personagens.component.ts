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
import { PersonagemFormComponent } from '../../components/personagem-form/personagem-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { DescricaoDialogComponent } from '../../components/descricao-dialog/descricao-dialog.component';
import { PersonagemService } from '../../services/personagem.service';
import { Personagem, PersonagemResponse, PaginatedResponse } from '../../models/personagem.model';

@Component({
  selector: 'app-personagens',
  standalone: true,
  imports: [CommonModule, DataTableComponent, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './personagens.component.html',
  styleUrl: './personagens.component.scss'
})
export class PersonagensComponent implements OnInit, OnDestroy {
  personagens: PersonagemResponse[] = [];
  isLoading = false;
  
  // Pagination
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  // Mapeamento de tipos
  private tipoMap: { [key: number]: string } = {
    0: 'Herói',
    1: 'Vilão',
    2: 'Anti-herói',
    3: 'Fantasia',
    4: 'Histórico',
    5: 'Real',
    6: 'Fábula',
    7: 'Outro'
  };

  columns: ColumnDefinition[] = [
    { key: 'nome', header: 'Nome', type: 'text' },
    { 
      key: 'tipo', 
      header: 'Tipo', 
      type: 'text',
      formatter: (value: number) => this.getTipoDescricao(value)
    },
    { 
      key: 'descricao', 
      header: 'Descrição', 
      type: 'text',
      formatter: (value: string) => this.formatarDescricao(value)
    },
    { key: 'imagem', header: 'Imagem', type: 'image' },
    { key: 'primeiraAparicao', header: 'Primeira Aparição', type: 'text' }
  ];

  actions: ActionDefinition[] = [
    {
      label: 'Editar',
      icon: 'edit',
      color: 'primary',
      action: (personagem) => this.openEditDialog(personagem)
    },
    {
      label: 'Excluir',
      icon: 'delete',
      color: 'warn',
      action: (personagem) => this.openDeleteDialog(personagem)
    },
    {
      label: 'Ver Descrição',
      icon: 'description',
      color: 'primary',
      action: (personagem) => this.mostrarDescricaoCompleta(personagem.nome, personagem.descricao)
    }
  ];

  constructor(
    private personagemService: PersonagemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.pageIndex = 0;
      this.loadPersonagens();
    });
  }

  ngOnInit(): void {
    this.loadPersonagens();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadPersonagens(): void {
    this.isLoading = true;
    this.personagemService.getPersonagens(this.pageIndex + 1, this.pageSize, this.searchTerm)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: PaginatedResponse<PersonagemResponse>) => {
          this.personagens = response?.items || [];
          this.totalItems = response?.total || 0;
        },
        error: (error) => {
          console.error('Erro ao carregar personagens:', error);
          this.personagens = [];
          this.showError('Erro ao carregar personagens');
        }
      });
  }

  getTipoDescricao(tipo: number): string {
    return this.tipoMap[tipo] || 'Desconhecido';
  }

  formatarDescricao(descricao: string): string {
    // Limitar a descrição a 100 caracteres e adicionar "..."
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
    this.loadPersonagens();
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onAddNew(): void {
    this.openCreateDialog();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PersonagemFormComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createPersonagem(result);
      }
    });
  }

  openEditDialog(personagem: PersonagemResponse): void {
    const dialogRef = this.dialog.open(PersonagemFormComponent, {
      width: '600px',
      data: { personagem, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePersonagem(personagem.id!, result);
      }
    });
  }

  openDeleteDialog(personagem: PersonagemResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja excluir o personagem "${personagem.nome}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deletePersonagem(personagem.id!);
      }
    });
  }

  private createPersonagem(personagemData: Personagem): void {
    this.personagemService.createPersonagem(personagemData).subscribe({
      next: () => {
        this.showSuccess('Personagem criado com sucesso!');
        this.loadPersonagens();
      },
      error: (error) => {
        this.showError('Erro ao criar personagem');
      }
    });
  }

  private updatePersonagem(id: string, personagemData: Personagem): void {
    this.personagemService.updatePersonagem(id, personagemData).subscribe({
      next: () => {
        this.showSuccess('Personagem atualizado com sucesso!');
        this.loadPersonagens();
      },
      error: (error) => {
        this.showError('Erro ao atualizar personagem');
      }
    });
  }

  private deletePersonagem(id: string): void {
    this.personagemService.deletePersonagem(id).subscribe({
      next: () => {
        this.showSuccess('Personagem excluído com sucesso!');
        this.loadPersonagens();
      },
      error: (error) => {
        this.showError('Erro ao excluir personagem');
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