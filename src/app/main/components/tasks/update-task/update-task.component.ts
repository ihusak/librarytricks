import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { TaskModel } from '../task.model';
import { TaskService } from '../tasks.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateTaskComponent implements OnInit, AfterViewInit, OnDestroy {
  public tasksList: TaskModel[];
  public taskForm: FormGroup;
  public initForm: boolean = false;
  public coursesList;
  public nextTask: string;
  private taskId: string;
  private currentTask: TaskModel;
  private subscription: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private location: Location) {
      activateRoute.params.subscribe(params => {
        this.taskId = params.id;
      });
     }

  ngOnInit() {
    this.getCurrentTasks(this.taskId);
  }
  ngAfterViewInit() {

  }

  public uptadeTask() {
    const updatedTask = new TaskModel(this.taskForm.value);
    if (!this.tasksList.length) {
      updatedTask.allow = true;
    }
    if (this.taskForm.valid) {
     const updateTask = this.taskService.updateTask(this.taskId, updatedTask).subscribe(result => {
        this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.TASK_UPDATED'), '', {
          duration: 2000,
          panelClass: ['success']
        });
        this.location.back();
      });
      this.subscription.add(updateTask);
    }
  }

  private getCurrentTasks(id: string) {
    const getTaskById = this.taskService.getTaskById(id).subscribe((task: TaskModel) => {
      this.nextTask = task.nextTask.id;
      this.currentTask = task;
      this.taskForm = this.formBuilder.group({
        title: [task.title, [Validators.required]],
        description: [task.description, [Validators.required]],
        example: [task.example, [Validators.required, Validators.pattern('^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$')]],
        reward: [task.reward, [Validators.required]],
        nextTask: [task.nextTask.id, [Validators.required]],
        course: [task.course, [Validators.required]],
        allow: [task.allow],
        _id: [task.id],
      });
      this.nextTask = task.nextTask.id;
      this.getAllTasks(task.course.id);
      this.getCourses();
      this.initForm = true;
    });
    this.subscription.add(getTaskById);
  }

  private getAllTasks(courseId?: string) {
    const getAllTasks = this.taskService.getAllTasks().subscribe((tasks: TaskModel[]) => {
      this.tasksList = tasks.filter((task: TaskModel) => task.course.id === courseId && this.currentTask.id !== task.id);
      if (!this.tasksList.length) {
        this.taskForm.removeControl('nextTask');
      } else {
        this.taskForm.setControl('nextTask', new FormControl('', Validators.required));
      }
    });
    this.subscription.add(getAllTasks);
  }

  private getCourses() {
    const getAllCourses = this.taskService.getAllCourses().subscribe(allCourses => {
      this.coursesList = allCourses;
    });
    this.subscription.add(getAllCourses);
  }

  public changeCourse(course) {
    const courseId: string = course.id;
    this.getAllTasks(courseId);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  compareNextTask(o1: any, o2: any): boolean {
    return o1 === o2;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
