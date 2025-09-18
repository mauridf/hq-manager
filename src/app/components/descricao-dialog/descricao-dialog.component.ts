import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface DescricaoDialogData {
  titulo: string;
  descricao: string;
}

@Component({
  selector: 'app-descricao-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './descricao-dialog.component.html',
  styleUrl: './descricao-dialog.component.scss'
})
export class DescricaoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DescricaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DescricaoDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}