import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Appointment } from '../appointment-form/appointment.model';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  DragDropModule,
} from '@angular/cdk/drag-drop';

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
  private draggedAppointmentId: number | null = null;
  private appointmentIdCounter = 0;
  private draggedAppointment: Appointment | null = null;
  currentHoverDate: Date | null = null;

  ngOnInit(): void {
    this.generateDays();
  }

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

  // onDragStart(event: CdkDragStart): void {
  //   this.draggedAppointment = event.source.data as Appointment;
  // }

  // onDragEnd(event: CdkDragEnd): void {
  //   this.draggedAppointment = null;
  // }

  // onDrop(event: CdkDragDrop<Appointment[]>): void {
  //   const draggedAppointment = event.item.data as Appointment;

  //   console.log('Drop event:', event);

  //   const targetElement = event.container.element.nativeElement;
  //   const targetDateStr = targetElement.getAttribute('data-date');

  //   console.log('Target date string:', targetDateStr);

  //   if (targetDateStr) {
  //     const targetDate = new Date(targetDateStr);

  //     console.log('Parsed target date:', targetDate);

  //     if (draggedAppointment && targetDate) {
  //       console.log('Appointments before update:', this.appointments$.value);

  //       const updatedAppointments = this.appointments$.value.map((appt) =>
  //         appt.id === draggedAppointment.id
  //           ? { ...appt, date: targetDate }
  //           : appt
  //       );

  //       console.log('Updated appointments:', updatedAppointments);

  //       this.appointments$.next(updatedAppointments);

  //       console.log('Appointments after update:', this.appointments$.value);
  //     } else {
  //       console.error('Invalid appointment or target date.');
  //     }
  //   } else {
  //     console.error('Target date is missing or invalid.');
  //   }
  // }

  onDragStart(event: DragEvent, appointment: Appointment): void {
    this.draggedAppointmentId = appointment.id;
    event.dataTransfer?.setData('text/plain', appointment.id.toString());
  }

  onDragEnd(event: DragEvent): void {
    this.draggedAppointmentId = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const targetElement = event.currentTarget as HTMLElement;
    const targetDateString = targetElement.getAttribute('data-date') || '';
    const targetDate = new Date(targetDateString);

    if (this.draggedAppointmentId !== null) {
      const draggedAppointment = this.appointments$.value.find(
        (appt) => appt.id === this.draggedAppointmentId
      );
      if (draggedAppointment) {
        const updatedAppointments = this.appointments$.value.map((appt) =>
          appt.id === draggedAppointment.id
            ? { ...appt, date: targetDate }
            : appt
        );
        this.appointments$.next(updatedAppointments);
      }
    }
  }

  private generateId(): number {
    return ++this.appointmentIdCounter;
  }

  trackById(index: number, item: Appointment): number {
    return item.id;
  }
}
