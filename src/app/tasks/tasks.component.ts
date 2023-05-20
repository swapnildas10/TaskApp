import { Component, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TasksService } from '../service/tasks.service';
import { EnumMapping, Status, Task } from '../models/task';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-tasks' }
})

export class TasksComponent implements OnInit {

  public isLoading: boolean = true;
  public tasks: Task[] = [];
  public statusEnum = Status;
  public enumMapping = EnumMapping;
  displayedColumns: string[] = ['Id', 'name', 'priority', 'status', 'actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private service: TasksService, private router: Router, private route: ActivatedRoute, private zone: NgZone) { }
  ngOnInit(): void {
    this.service.getTasks().subscribe((result) => {
      this.tasks = result;
      this.dataSource = this.tasks;
      this.isLoading = false;
    });
  }


  onEdit(task: Task) {
    this.router.navigate([task.id], { relativeTo: this.route });
  }


  onDelete(task: Task) {
    this.service.deleteTask(task.id!).pipe(
      mergeMap(() => {
        return this.service.getTasks();
      })
    ).subscribe({
      next: (result) => {
        this.dataSource = result;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


  onClick() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
