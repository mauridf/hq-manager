import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Edicao } from '../../models/hq.model';

interface EdicaoFormData {
  edicao?: Edicao;
  hqId: string;
  isEdit: boolean;
}

@Component({
  selector: 'app-edicao-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './edicao-form.component.html',
  styleUrl: './edicao-form.component.scss'
})
export class EdicaoFormComponent {
  edicaoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EdicaoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EdicaoFormData
  ) {
    this.edicaoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      sinopse: [''],
      capa: [''],
      lida: [false],
      obs: [''],
      nota: [null, [Validators.min(0), Validators.max(10)]],
      dataLeitura: [null]
    });

    if (data.edicao) {
      this.edicaoForm.patchValue(data.edicao);
    }
  }

  onSubmit(): void {
    if (this.edicaoForm.valid) {
      const formValue = {
        ...this.edicaoForm.value,
        hqId: this.data.hqId
      };
      this.dialogRef.close(formValue);
    } else {
      this.showError('Por favor, preencha os campos obrigatórios corretamente.');
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