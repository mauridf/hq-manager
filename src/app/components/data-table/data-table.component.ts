import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface ColumnDefinition {
  key: string;
  header: string;
  type?: 'text' | 'image' | 'link' | 'number' | 'date' | 'custom';
  customTemplate?: TemplateRef<any>;
}

export interface ActionDefinition {
  label: string;
  icon: string;
  color: 'primary' | 'accent' | 'warn';
  action: (item: any) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: ColumnDefinition[] = [];
  @Input() actions: ActionDefinition[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() searchPlaceholder: string = 'Pesquisar...';
  
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() addNew = new EventEmitter<void>();

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor() {
    // Configurar debounce para a pesquisa
    this.searchSubject.pipe(
      debounceTime(300), // Aguarda 300ms após a última tecla
      distinctUntilChanged() // Só emite se o valor mudou
    ).subscribe(searchTerm => {
      this.searchChange.emit(searchTerm);
    });
  }

  // Garantir que data nunca seja undefined
  get tableData(): any[] {
    return this.data || [];
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onAddNew(): void {
    this.addNew.emit();
  }

  getDisplayedColumns(): string[] {
    const columnKeys = this.columns.map(col => col.key);
    return this.actions.length > 0 ? [...columnKeys, 'actions'] : columnKeys;
  }

  // Limpar subscription quando o componente for destruído
  ngOnDestroy() {
    this.searchSubject.complete();
  }
}