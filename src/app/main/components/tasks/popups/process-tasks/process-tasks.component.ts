import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-process-tasks',
  templateUrl: './process-tasks.component.html',
  styleUrls: ['./process-tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessTasksComponent implements OnInit {
  public processingUsers: any[];

  constructor(
    public dialogRef: MatDialogRef<ProcessTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]) {
      this.processingUsers = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
