import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Appointment } from './appointment.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppointmentFormComponent {
  appointmentForm!: FormGroup;

  @Output() appointmentAdded = new EventEmitter<Appointment>();

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      date: [null, Validators.required],
      description: ['', Validators.required],
    });
  }

  get dateControl() {
    return this.appointmentForm.get('date');
  }

  get descriptionControl() {
    return this.appointmentForm.get('description');
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const newAppointment: Appointment = {
        id: 0,
        date: new Date(this.appointmentForm.value.date),
        description: this.appointmentForm.value.description,
      };
      this.appointmentAdded.emit(newAppointment);
      this.appointmentForm.reset();
    }
  }
}
