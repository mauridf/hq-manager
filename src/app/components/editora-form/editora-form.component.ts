import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Editora } from '../../models/editora.model';

interface EditoraFormData {
  editora?: Editora;
  isEdit: boolean;
}

@Component({
  selector: 'app-editora-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './editora-form.component.html',
  styleUrl: './editora-form.component.scss'
})
export class EditoraFormComponent {
  editoraForm: FormGroup;
  isEdit: boolean;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditoraFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditoraFormData
  ) {
    this.isEdit = data.isEdit;
    
    this.editoraForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      anoCriacao: [null, [Validators.required, Validators.min(1800), Validators.max(this.currentYear)]],
      logotipo: [''],
      paisOrigem: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      siteOficial: ['']
    });

    if (data.editora) {
      this.editoraForm.patchValue(data.editora);
    }
  }

  onSubmit(): void {
    if (this.editoraForm.valid) {
      this.dialogRef.close(this.editoraForm.value);
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