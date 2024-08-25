import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Appointment } from '../appointment-form/appointment.model';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { NgZone } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    AppointmentFormComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    DragDropModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  days: Date[] = [];
  appointments$: BehaviorSubject<Appointment[]> = new BehaviorSubject<
    Appointment[]
  >([]);
  private appointmentIdCounter = 0;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.generateDays();
  }

  ngOnInit(): void {}

  generateDays(): void {
    const start = new Date();
    start.setDate(1);
    for (let i = 0; i < 30; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      this.days.push(date);
    }
  }

  getAppointmentsForDay(day: Date): Appointment[] {
    return this.appointments$.value.filter(
      (appt) => appt.date.toDateString() === day.toDateString()
    );
  }

  addAppointment(appointment: Appointment): void {
    const newAppointment: Appointment = {
      id: this.generateId(),
      date: appointment.date,
      description: appointment.description,
    };
    const updatedAppointments = [...this.appointments$.value, newAppointment];
    this.appointments$.next(updatedAppointments);
  }

  deleteAppointment(appointment: Appointment): void {
    const confirmation = confirm(
      'Are you sure you want to delete this appointment?'
    );
    if (confirmation) {
      const updatedAppointments = this.appointments$.value.filter(
        (appt) => appt.id !== appointment.id
      );
      this.appointments$.next(updatedAppointments);
    }
  }

  onDrop(event: CdkDragDrop<Appointment[]>, day: Date): void {
    const appointment = event.item.data as Appointment;
    const targetDate = day;

    if (!this.isSameDate(appointment.date, targetDate)) {
      const updatedAppointments = this.appointments$.value.map((appt) =>
        appt.id === appointment.id ? { ...appt, date: targetDate } : appt
      );

      this.ngZone.run(() => {
        this.appointments$.next(updatedAppointments);
        this.cdr.detectChanges();
      });
    }
  }

  private generateId(): number {
    return ++this.appointmentIdCounter;
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  trackById(index: number, item: Appointment): number {
    return item.id;
  }
}
