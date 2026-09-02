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

interface AnalysisDetails {
  id: number;
  fileName: string;
  score: number;
  atsScore: number;
  skillsMatch: number;
  experience: number;
  strengths: string[];
  warnings: string[];
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
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
  latestAnalysis: AnalysisDetails | null = null;

  isLoading = true;
  errorMessage = '';

  selectedAnalysis: AnalysisDetails | null = null;

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

    if (!userEmail) {
      this.errorMessage = 'Please login to view dashboard.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    // Fetch aggregate stats and history in parallel
    const statsUrl = `/api/resume/dashboard?userEmail=${encodeURIComponent(userEmail)}`;
    const historyUrl = `/api/resume/history?userEmail=${encodeURIComponent(userEmail)}`;

    let statsLoaded = false;
    let analysisLoaded = false;

    const finishIfDone = () => {
      if (statsLoaded && analysisLoaded) {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    };

    this.http.get<DashboardStats>(statsUrl).subscribe({
      next: (response) => {
        this.dashboardStats = response;
        statsLoaded = true;
        finishIfDone();
      },
      error: () => {
        this.dashboardStats = null;
        statsLoaded = true;
        finishIfDone();
      }
    });

    this.http.get<AnalysisDetails[]>(historyUrl).subscribe({
      next: (response) => {
        const list = Array.isArray(response) ? response : [];
        this.latestAnalysis = list.length > 0 ? list[list.length - 1] : null;
        this.selectedAnalysis = this.latestAnalysis;
        analysisLoaded = true;
        finishIfDone();
      },
      error: () => {
        this.latestAnalysis = null;
        analysisLoaded = true;
        finishIfDone();
      }
    });
  }

  getMatchedCount(): number {
    return this.selectedAnalysis?.matchedSkills?.length ?? 0;
  }

  getMissingCount(): number {
    return this.selectedAnalysis?.missingSkills?.length ?? 0;
  }

  getTotalKeywords(): number {
    return this.getMatchedCount() + this.getMissingCount();
  }

  getMatchPercentage(): number {
    const total = this.getTotalKeywords();
    if (total === 0) return 0;
    return Math.round((this.getMatchedCount() / total) * 100);
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  }
}
