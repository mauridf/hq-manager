import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { HQ, TIPOS_PUBLICACAO, STATUS_HQ } from '../../models/hq.model';
import { EditoraService } from '../../services/editora.service';
import { PersonagemService } from '../../services/personagem.service';
import { EquipeService } from '../../services/equipe.service';

interface HQFormData {
  hq?: HQ;
  isEdit: boolean;
}

@Component({
  selector: 'app-hq-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './hq-form.component.html',
  styleUrl: './hq-form.component.scss'
})
export class HqFormComponent implements OnInit {
  hqForm: FormGroup;
  isEdit: boolean;
  currentYear = new Date().getFullYear();
  
  tiposPublicacao = TIPOS_PUBLICACAO;
  statusHQ = STATUS_HQ;
  editoras: any[] = [];
  personagens: any[] = [];
  equipes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private editoraService: EditoraService,
    private personagemService: PersonagemService,
    private equipeService: EquipeService,
    public dialogRef: MatDialogRef<HqFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HQFormData
  ) {
    this.isEdit = data.isEdit;
    
    this.hqForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      nomeOriginal: [''],
      tipoPublicacao: [null, [Validators.required]],
      status: [null, [Validators.required]],
      totalEdicoes: [0, [Validators.required, Validators.min(0)]],
      sinopse: ['', [Validators.required, Validators.minLength(10)]],
      anoLancamento: [null, [Validators.required, Validators.min(1800), Validators.max(this.currentYear)]],
      imagem: [''],
      tags: this.fb.array([]),
      editoras: [[], [Validators.required]],
      personagens: [[]],
      equipes: [[]]
    });

    if (data.hq) {
      this.hqForm.patchValue(data.hq);
      if (data.hq.tags) {
        data.hq.tags.forEach(tag => this.addTag(tag));
      }
    }
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  get tags(): FormArray {
    return this.hqForm.get('tags') as FormArray;
  }

  addTag(tag: string = ''): void {
    this.tags.push(this.fb.control(tag));
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  carregarDados(): void {
    this.editoraService.getEditoras(1, 100).subscribe({
      next: (response) => this.editoras = response.items,
      error: (error) => console.error('Erro ao carregar editoras:', error)
    });

    this.personagemService.getPersonagens(1, 100).subscribe({
      next: (response) => this.personagens = response.items,
      error: (error) => console.error('Erro ao carregar personagens:', error)
    });

    this.equipeService.getEquipes(1, 100).subscribe({
      next: (response) => this.equipes = response.items,
      error: (error) => console.error('Erro ao carregar equipes:', error)
    });
  }

  onSubmit(): void {
    if (this.hqForm.valid) {
      const formValue = {
        ...this.hqForm.value,
        tags: this.tags.value.filter((tag: string) => tag.trim() !== '')
      };
      this.dialogRef.close(formValue);
    } else {
      this.showError('Por favor, preencha todos os campos obrigatórios corretamente.');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}