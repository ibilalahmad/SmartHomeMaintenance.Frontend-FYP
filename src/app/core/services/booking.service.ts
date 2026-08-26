import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {

  private bookings: Booking[] = [
    { id: 'BK-3021', customer: 'Ayesha Noor',   provider: 'Imran Plumbing Co.',    service: 'Pipe Leakage Repair',  when: 'Jul 6, 10:00 AM', status: 'Completed'  },
    { id: 'BK-3022', customer: 'Hamza Sheikh',  provider: 'Bright Spark Electric', service: 'Wiring Inspection',    when: 'Jul 6, 2:30 PM',  status: 'In Progress'},
    { id: 'BK-3023', customer: 'Sara Khan',     provider: 'CleanPro Sanitary',     service: 'Bathroom Fitting',     when: 'Jul 8, 11:00 AM', status: 'Confirmed'  },
    { id: 'BK-3024', customer: 'Bilal Raza',    provider: 'Imran Plumbing Co.',    service: 'Water Tank Cleaning',  when: 'Jul 5, 9:00 AM',  status: 'Cancelled'  },
    { id: 'BK-3025', customer: 'Fatima Malik',  provider: 'Volt Masters',          service: 'AC Installation',      when: 'Jul 4, 4:00 PM',  status: 'Completed'  },
    { id: 'BK-3026', customer: 'Waqas Hussain', provider: 'QuickFix Repairs',      service: 'Switchboard Repair',   when: 'Jul 9, 1:00 PM',  status: 'Confirmed'  },
    { id: 'BK-3027', customer: 'Zainab Ali',    provider: 'Al-Madina HVAC',        service: 'AC Gas Refill',        when: 'Jul 10, 10:00 AM', status: 'In Progress'},
    { id: 'BK-3028', customer: 'Usman Tariq',   provider: 'Faisal Woodworks',      service: 'Custom Wardrobe',      when: 'Jul 11, 3:00 PM', status: 'Confirmed'  },
    { id: 'BK-3029', customer: 'Mariam Ahmed',  provider: 'Smart Home Solutions',  service: 'CCTV Installation',    when: 'Jul 12, 9:00 AM', status: 'Completed'  },
    { id: 'BK-3030', customer: 'Ali Hassan',    provider: 'Deep Clean Services',   service: 'Full House Cleaning',  when: 'Jul 13, 8:00 AM', status: 'Cancelled'  },
    { id: 'BK-3031', customer: 'Sana Qureshi',  provider: 'Ali Tech Works',        service: 'Washing Machine Repair',when: 'Jul 14, 2:00 PM', status: 'In Progress'},
    { id: 'BK-3032', customer: 'Kamran Shah',   provider: 'Zaman Plumbing',        service: 'Drain Unblocking',     when: 'Jul 15, 11:30 AM', status: 'Confirmed'  },
    { id: 'BK-3033', customer: 'Hina Javed',    provider: 'Cooling Masters',       service: 'AC Servicing',         when: 'Jul 16, 4:30 PM', status: 'Completed'  },
    { id: 'BK-3034', customer: 'Fahad Mustafa', provider: 'A-1 Electric',          service: 'Fan Installation',     when: 'Jul 17, 10:00 AM', status: 'Completed'  },
    { id: 'BK-3035', customer: 'Rabia Aslam',   provider: 'Shiny Floors Co.',      service: 'Floor Polishing',      when: 'Jul 18, 12:00 PM', status: 'Cancelled'  },
    { id: 'BK-3036', customer: 'Noman Ejaz',    provider: 'Woodcrafters Pro',      service: 'Kitchen Cabinets',     when: 'Jul 19, 9:00 AM', status: 'In Progress'},
    { id: 'BK-3037', customer: 'Mehwish Hayat', provider: 'TechFix Solutions',     service: 'Refrigerator Repair',  when: 'Jul 20, 3:00 PM', status: 'Confirmed'  },
    { id: 'BK-3038', customer: 'Atif Aslam',    provider: 'Bros Plumbing',         service: 'Geyser Repair',        when: 'Jul 21, 11:00 AM', status: 'Completed'  },
    { id: 'BK-3039', customer: 'Mahira Khan',   provider: 'Breeze AC Services',    service: 'AC Repair',            when: 'Jul 22, 10:30 AM', status: 'Confirmed'  },
    { id: 'BK-3040', customer: 'Fawad Khan',    provider: 'Sparky Electrics',      service: 'UPS Installation',     when: 'Jul 23, 2:00 PM', status: 'In Progress'},
    { id: 'BK-3041', customer: 'Sajal Aly',     provider: 'Dust Busters',          service: 'Carpet Cleaning',      when: 'Jul 24, 9:30 AM', status: 'Completed'  },
    { id: 'BK-3042', customer: 'Ahad Raza Mir', provider: 'Perfect Fit Carpentry', service: 'Door Polish',          when: 'Jul 25, 4:00 PM', status: 'Confirmed'  },
  ];

  getAll(): Observable<Booking[]> { return of(this.bookings); }

  cancelBooking(id: string): Observable<boolean> {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'Cancelled';
      return of(true);
    }
    return of(false);
  }
}
