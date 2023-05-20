import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TasksService } from '../service/tasks.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mergeMap, of } from 'rxjs';
import { EnumMapping, Status, Task } from '../models/task';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-task-item' }

})
export class TaskItemComponent implements OnInit {

  public enumMapping = EnumMapping;
  public status = Status;
  public keys = Object.keys(Status).filter(key => !isNaN(Number(key)));
  private Id?: number;
  public task?: Task | null;
  public isLoading = true;
  public taskForm!: FormGroup;
  constructor(private service: TasksService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router) { }
  ngOnInit(): void {
    this.route.params.pipe(
      mergeMap((params: Params) => {
        this.Id = params['id'];
        if (!this.Id) {
          return of(null);
        }
        return this.service.getTask(this.Id!)
      })
    ).subscribe((task: Task | null) => {

      this.task = task;
      this.initForm();
      this.isLoading = false;
    })
  }


  initForm() {
    this.taskForm = this.fb.group({
      id: this.Id ?? null,
      name: [this.task?.name ?? '', Validators.required],
      priority: [this.task?.priority ?? '', [Validators.required, Validators.pattern("^[0-9]*$")]],
      status: [this.task?.status ?? '']
    })
  }


  save() {

    if (this.taskForm.invalid) {
      return;
    }
    let taskItem = this.taskForm.getRawValue() as Task;
    if (taskItem.id) {
      this.service.updateTask(taskItem.id, taskItem).subscribe({
        next: () => {
          this.router.navigate(['/'])
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.service.createTask(taskItem).subscribe({
        next: () => {
          this.router.navigate(['/'])
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

  }
  onCancel() {
    this.router.navigate(['/']);
  }
}
