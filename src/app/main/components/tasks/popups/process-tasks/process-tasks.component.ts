import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

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
    console.log(data, 'ProcessTasksComponent DATA');
      this.processingUsers = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
