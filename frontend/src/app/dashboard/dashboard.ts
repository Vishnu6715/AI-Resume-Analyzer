import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface DashboardStats {
  totalAnalyses: number;
  averageScore: number;
  averageAtsScore: number;
  averageSkillsMatch: number;
  bestScore: number;
  bestResume: string;
  latestResume: string;
  latestScore: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  dashboardStats: DashboardStats | null = null;

  isLoading = true;

  errorMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.isLoading = true;
    this.errorMessage = '';

    const userEmail =
      localStorage.getItem('userEmail') ||
      localStorage.getItem('loggedInEmail') ||
      '';

    console.log('Loading Dashboard for:', userEmail);

    if (!userEmail) {

      this.errorMessage =
        'Please login to view dashboard.';

      this.isLoading = false;

      this.cdr.detectChanges();

      return;
    }

    this.http.get<DashboardStats>(
      `https://ai-resume-analyzer-backend-wgfm.onrender.com/api/resume/dashboard?userEmail=${encodeURIComponent(userEmail)}`
    )
    .subscribe({

      next: (response) => {

        console.log('Dashboard Response:', response);

        this.dashboardStats = response;

        this.isLoading = false;

        // Force dashboard UI update
        this.cdr.detectChanges();

        console.log(
          'Dashboard loaded:',
          this.dashboardStats
        );
      },

      error: (error) => {

        console.error('Dashboard Error:', error);

        this.dashboardStats = null;

        this.errorMessage =
          'Unable to load dashboard data.';

        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });
  }

}