import { provideRouter, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { bootstrapApplication } from '@angular/platform-browser';

export const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
  },
];

bootstrapApplication(CalendarComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
