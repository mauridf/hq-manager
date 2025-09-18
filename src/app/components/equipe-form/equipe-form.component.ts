import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Equipe } from '../../models/equipe.model';

interface EquipeFormData {
  equipe?: Equipe;
  isEdit: boolean;
}

@Component({
  selector: 'app-equipe-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './equipe-form.component.html',
  styleUrl: './equipe-form.component.scss'
})
export class EquipeFormComponent {
  equipeForm: FormGroup;
  isEdit: boolean;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EquipeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EquipeFormData
  ) {
    this.isEdit = data.isEdit;
    
    this.equipeForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      imagem: [''],
      anoCriacao: [null, [Validators.required, Validators.min(1800), Validators.max(this.currentYear)]]
    });

    if (data.equipe) {
      this.equipeForm.patchValue(data.equipe);
    }
  }

  onSubmit(): void {
    if (this.equipeForm.valid) {
      this.dialogRef.close(this.equipeForm.value);
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