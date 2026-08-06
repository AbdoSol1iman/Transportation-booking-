import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Hero3dComponent } from '../../shared/components/hero-3d/hero-3d.component';
import { StationService } from '../../core/services/station.service';
import { TripService } from '../../core/services/trip.service';
import { Station } from '../../core/models/station.model';
import { Trip } from '../../core/models/trip.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent, Hero3dComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private stationService = inject(StationService);
  private tripService = inject(TripService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  stations: Station[] = [];
  featuredTrips: Trip[] = [];
  isLoading = true;
  scrollPercent = 0;
  Math = Math;
  mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (typeof window === 'undefined') return;
    const { innerWidth, innerHeight } = window;
    this.mouse.targetX = (event.clientX / innerWidth) * 2 - 1;
    this.mouse.targetY = -(event.clientY / innerHeight) * 2 + 1;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (typeof window !== 'undefined') {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollPercent = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
    }
  }

  selectedFromStation = '';
  selectedToStation = '';
  selectedSeatsCount = 1;

  faqs = [
    {
      question: 'هو لازم أروح الموقف بدري عشان ألحق كرسيا؟',
      answer: 'تُؤ! تذكرتك محجوزة ومضمونة باسمك ومقعدك متأمن. بتوصل قبل معاد الرحلة بـ 10 دقائق بس، وتركب عربيتك ع الرايق من غير جَري ولا ملاهدة!',
      open: true
    },
    {
      question: 'ينفع أحجز كذا تذكرة ليّا ولأصحابي في نفس الرحلة؟',
      answer: 'أكيد طبعاً! تقدر تختار عدد التذاكر اللي محتاجها دفعة واحدة وتحدد الكراسي اللي جنب بعض عشان تسافروا شلة واحدة وتعيشوا الأجواء.',
      open: false
    },
    {
      question: 'لو ظروفي اتغيرت ينفع ألغي الحجز أو أغير الميعاد؟',
      answer: 'سهلة جداً! من صفحة "حجوزاتي" تقدر تلغي حجزك أو تعدله بسهولة طبقاً لسياسة الإلغاء قبل وقت الرحلة بمرونة كاملة.',
      open: false
    },
    {
      question: 'إزاي أعرف إن الأوتوبيس أو الميكروباص نضيف ومكيف؟',
      answer: 'كل عربية مسجلة عندنا ليها بروفايل كامل بيوضح نوعها وموديلها وإمكانياتها (تكييف، USB، شاشات) بالإضافة لتقييمات الناس اللي سافروا فيها قبلك!',
      open: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  cardImages: string[] = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
  ];

  stationsCount = 0;
  totalTrips = 0;
  dailyTripsCount = 0;

  ngOnInit(): void {
    this.fetchData();
  }

  animateCounters(): void {
    const targetStations = this.stations.length || 0;
    const targetTrips = this.totalTrips || this.featuredTrips.length || 0;

    const duration = 1200;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      this.stationsCount = Math.floor(easeOut * targetStations);
      this.dailyTripsCount = Math.floor(easeOut * targetTrips);

      this.cdr.detectChanges();

      if (step >= steps) {
        clearInterval(timer);
        this.stationsCount = targetStations;
        this.dailyTripsCount = targetTrips;
        this.cdr.detectChanges();
      }
    }, interval);
  }

  fetchData(): void {
    this.isLoading = true;

    this.stationService.getStations().subscribe({
      next: (res) => {
        this.stations = res.data || [];
        this.animateCounters();
        this.cdr.detectChanges();
      },
      error: () => {},
    });

    this.tripService.getTrips({ page: 1, limit: 6 }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.featuredTrips = res.data || [];
        this.totalTrips = res.total || res.data?.length || 0;
        this.animateCounters();
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    this.router.navigate(['/trips'], {
      queryParams: {
        from: this.selectedFromStation || undefined,
        to: this.selectedToStation || undefined,
        seats: this.selectedSeatsCount,
      },
    });
  }

  getRouteStart(trip: Trip): string {
    if (typeof trip.routeId === 'object' && trip.routeId?.startStationId) {
      const s = trip.routeId.startStationId as any;
      return s.name || s.city || 'محطة القيام';
    }
    return 'محطة القيام';
  }

  getRouteEnd(trip: Trip): string {
    if (typeof trip.routeId === 'object' && trip.routeId?.endStationId) {
      const e = trip.routeId.endStationId as any;
      return e.name || e.city || 'محطة الوصول';
    }
    return 'محطة الوصول';
  }

  getVehicleName(trip: Trip): string {
    if (typeof trip.vehicleId === 'object' && trip.vehicleId) {
      const v = trip.vehicleId as any;
      return `${v.model || 'مركبة'} (${v.vehicleType || 'مكيفة'})`;
    }
    return 'مركبة مكيفة VIP';
  }

  getAvailableSeats(trip: Trip): number {
    if (trip.capacity !== undefined && trip.currentPassengers !== undefined) {
      return Math.max(0, trip.capacity - trip.currentPassengers);
    }
    return trip.capacity || 14;
  }

  systemDefaultImages: string[] = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
  ];

  formatDate(dateStr?: string | Date): string {
    if (!dateStr) return 'تاريخ غير محدد';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ar-EG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'تاريخ غير محدد';
    }
  }

  formatTime(dateStr?: string | Date): string {
    if (!dateStr) return '08:00 م';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '08:00 م';
    }
  }

  getTripImage(tripOrIndex: any, index?: number): string {
    if (typeof tripOrIndex === 'object' && tripOrIndex?.imageUrl) {
      return tripOrIndex.imageUrl;
    }
    const idx = typeof tripOrIndex === 'number' ? tripOrIndex : (index || 0);
    return this.systemDefaultImages[idx % this.systemDefaultImages.length];
  }
}
