import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Personagem, TipoPersonagem } from '../../models/personagem.model';
import { PersonagemService } from '../../services/personagem.service';

interface PersonagemFormData {
  personagem?: Personagem;
  isEdit: boolean;
}

@Component({
  selector: 'app-personagem-form',
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
    MatTooltipModule
  ],
  templateUrl: './personagem-form.component.html',
  styleUrl: './personagem-form.component.scss'
})
export class PersonagemFormComponent implements OnInit {
  personagemForm: FormGroup;
  isEdit: boolean;
  tiposPersonagem: TipoPersonagem[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private personagemService: PersonagemService,
    public dialogRef: MatDialogRef<PersonagemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonagemFormData
  ) {
    this.isEdit = data.isEdit;
    
    this.personagemForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      tipo: [null, [Validators.required]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      imagem: [''],
      primeiraAparicao: ['', [Validators.required]]
    });

    if (data.personagem) {
      this.personagemForm.patchValue(data.personagem);
    }
  }

  ngOnInit(): void {
    this.carregarTiposPersonagem();
  }

  carregarTiposPersonagem(): void {
    this.personagemService.getTiposPersonagem().subscribe({
      next: (tipos) => {
        this.tiposPersonagem = tipos;
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de personagem:', error);
        this.showError('Erro ao carregar tipos de personagem');
      }
    });
  }

  onSubmit(): void {
    if (this.personagemForm.valid) {
      this.dialogRef.close(this.personagemForm.value);
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