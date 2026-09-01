import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface HistoryItem {
  id: number;
  fileName: string;
  score: number;
  atsScore: number;
  skillsMatch: number;
  experience: number;
  userEmail: string;
  createdAt?: string;
}

interface HistoryDetails {
  id: number;
  fileName: string;
  score: number;
  atsScore: number;
  skillsMatch: number;
  experience: number;
  userEmail: string;
  strengths: string[];
  warnings: string[];
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {

  history: HistoryItem[] = [];
  isLoading = true;
  errorMessage = '';
  userEmail = '';

  showDetails = false;
  isLoadingDetails = false;
  selectedDetails: HistoryDetails | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userEmail =
      localStorage.getItem('userEmail') ||
      localStorage.getItem('loggedInEmail') ||
      '';

    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.userEmail) {
      this.errorMessage = 'Please login to view your history.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const url =
      `https://ai-resume-analyzer-backend-wgfm.onrender.com/api/resume/history?userEmail=${encodeURIComponent(this.userEmail)}`;
    this.http.get<HistoryItem[]>(url).subscribe({
      next: (response) => {
        console.log('History Response:', response);
        this.history = Array.isArray(response) ? response : [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('History Error:', error);
        this.history = [];
        this.errorMessage = 'Unable to load analysis history.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewAnalysis(item: HistoryItem): void {
    this.isLoadingDetails = true;
    this.selectedDetails = null;
    this.showDetails = true;
    document.body.style.overflow = 'hidden';

    const url =
  `https://ai-resume-analyzer-backend-wgfm.onrender.com/api/resume/history/details?id=${item.id}&userEmail=${encodeURIComponent(this.userEmail)}`;

    this.http.get<HistoryDetails>(url).subscribe({
      next: (response) => {
        console.log('Analysis Details:', response);
        this.selectedDetails = response;
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('History Details Error:', error);
        this.isLoadingDetails = false;

        this.selectedDetails = {
          id: item.id,
          fileName: item.fileName,
          score: item.score,
          atsScore: item.atsScore,
          skillsMatch: item.skillsMatch,
          experience: item.experience,
          userEmail: item.userEmail,
          strengths: [],
          warnings: [],
          matchedSkills: [],
          missingSkills: [],
          recommendations: []
        };

        this.cdr.detectChanges();
      }
    });
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedDetails = null;
    this.isLoadingDetails = false;
    document.body.style.overflow = '';
  }

  deleteAnalysis(id: number): void {
    if (!id) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this analysis?'
    );

    if (!confirmed) {
      return;
    }

   const url =
  `https://ai-resume-analyzer-backend-wgfm.onrender.com/api/resume/history?id=${id}&userEmail=${encodeURIComponent(this.userEmail)}`;

    this.http.delete(url).subscribe({
      next: () => {
        this.history = this.history.filter(item => item.id !== id);

        if (this.selectedDetails?.id === id) {
          this.closeDetails();
        }

        this.cdr.detectChanges();
        alert('Analysis deleted successfully.');
      },

      error: (error) => {
        console.error('Delete Error:', error);
        alert('Unable to delete analysis.');
      }
    });
  }
}