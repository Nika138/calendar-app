import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Appointment } from '../appointment-form/appointment.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CdkDrag, CommonModule],
  providers: [DatePipe],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent {
  @Input() appointments: Appointment[] = [];
  @Output() appointmentDeleted = new EventEmitter<Appointment>();

  onDelete(appointment: Appointment) {
    const confirmation = confirm(
      'Are you sure you want to delete this appointment?'
    );
    if (confirmation) {
      this.appointmentDeleted.emit(appointment);
    }
  }
}
