import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface AnalysisResult {

  score: number;

  atsScore: number;

  skillsMatch: number;

  experience: number;

  fileName: string;

  strengths: string[];

  warnings: string[];

  matchedSkills: string[];

  missingSkills: string[];

  recommendations: string[];
}


// ==============================
// ANALYSIS HISTORY INTERFACE
// ==============================

// ==============================
// DASHBOARD INTERFACE
// ==============================

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


interface AnalysisHistory {

  id: number;

  fileName: string;

  score: number;

  atsScore: number;

  skillsMatch: number;

  experience: number;

  userEmail: string;
}


// ==============================
// HISTORY DETAILS INTERFACE
// ==============================

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
  selector: 'app-root',

  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './app.html',

  styleUrl: './app.css'
})


export class App {


  selectedFile: File | null = null;

  jobDescription = '';

  isDragging = false;

  isAnalyzing = false;

  analysisComplete = false;

  analysisResult: AnalysisResult | null = null;


  // ==============================
  // LOGIN
  // ==============================

  showLogin = false;

  loginEmail = '';

  loginPassword = '';

  showPassword = false;

  rememberMe = false;

  isLoggingIn = false;

  loginError = '';

  loginSuccess = '';

  isLoggedIn = false;

  loggedInEmail = '';

  activeSection = 'home';

  // Logout popup
  showLogoutPopup = false;


  // ==============================
  // SIGN UP
  // ==============================

  showSignup = false;

  signupEmail = '';

  signupPassword = '';


  // ==============================
  // DASHBOARD
  // ==============================

  dashboardStats: DashboardStats | null = null;

  dashboardLoaded = false;

  // Dashboard slide/panel
  showDashboard = false;


  // ==============================
  // ANALYSIS HISTORY
  // ==============================

  analysisHistory: AnalysisHistory[] = [];

  showHistory = false;

  isLoadingHistory = false;


  // ==============================
  // HISTORY DETAILS
  // ==============================

  showHistoryDetails = false;

  selectedHistoryDetails: HistoryDetails | null = null;

  isLoadingHistoryDetails = false;


  constructor(

    private http: HttpClient,

    private cdr: ChangeDetectorRef,

    private router: Router

  ) {

    // Restore the logged-in user after a browser refresh.
    const savedEmail = localStorage.getItem('userEmail');

    if (savedEmail) {

      this.loggedInEmail = savedEmail;

      this.isLoggedIn = true;

      console.log(
        'Session restored for:',
        this.loggedInEmail
      );

    }

  }


  // ==============================
  // OPEN LOGIN
  // ==============================

  openLogin(): void {

    this.showLogin = true;

    this.showSignup = false;

    // Clear old login messages whenever the popup opens.
    this.loginError = '';

    this.loginSuccess = '';

    this.isLoggingIn = false;

  }


  // ==============================
  // CLOSE LOGIN
  // ==============================

  closeLogin(): void {

    this.showLogin = false;

    this.loginEmail = '';

    this.loginPassword = '';

    this.showPassword = false;

    this.loginError = '';

    this.loginSuccess = '';

  }


  // ==============================
  // OPEN SIGNUP
  // ==============================

  openSignup(): void {

    this.showSignup = true;

    this.showLogin = false;

  }


  // ==============================
  // CLOSE SIGNUP
  // ==============================

  closeSignup(): void {

    this.showSignup = false;

    this.signupEmail = '';

    this.signupPassword = '';

  }


  // ==============================
  // FORGOT PASSWORD
  // ==============================

  forgotPassword(): void {

    this.loginError = '';

    this.loginSuccess =
      'Password reset option will be available soon.';

  }


  // ==============================
  // LOGIN
  // ==============================

  login(): void {

    this.loginError = '';

    this.loginSuccess = '';

    if (!this.loginEmail.trim()) {

      this.loginError = 'Please enter your email.';

      return;

    }

    if (!this.loginEmail.includes('@')) {

      this.loginError = 'Please enter a valid email.';

      return;

    }

    if (!this.loginPassword.trim()) {

      this.loginError = 'Please enter your password.';

      return;

    }

    this.isLoggingIn = true;


    const user = {

      email: this.loginEmail.trim(),

      password: this.loginPassword

    };


    console.log(
      'Login Request:',
      user.email
    );


    this.http.post(

       '/api/auth/login',
      user,

      {
        responseType: 'text'
      }

    )

    .subscribe({

      next: (response) => {

        console.log(
          'Login Response:',
          response
        );


        this.isLoggingIn = false;

        this.loginSuccess = response;

        this.isLoggedIn = true;

        this.loggedInEmail =
          this.loginEmail.trim();

        // Save logged-in email so separate pages
        // like History can identify the current user.
        localStorage.setItem(
          'userEmail',
          this.loggedInEmail
        );


        // Load dashboard for logged-in user

        this.loadDashboard();


        this.closeLogin();

        this.isLoggingIn = false;


        // Reset old history

        this.analysisHistory = [];

        this.showHistory = false;


        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'Login Error:',
          error
        );


        this.isLoggingIn = false;

        this.loginError =
          error.error ||
          'Invalid email or password.';

      }

    });

  }


  // ==============================
  // SIGN UP
  // ==============================

  signup(): void {

    if (!this.signupEmail.trim()) {

      alert(
        'Please enter your email.'
      );

      return;

    }


    if (!this.signupPassword.trim()) {

      alert(
        'Please enter your password.'
      );

      return;

    }


    const user = {

      email: this.signupEmail.trim(),

      password: this.signupPassword

    };


    console.log(
      'Signup Request:',
      user.email
    );


    this.http.post(

       '/api/auth/signup',

      user,

      {
        responseType: 'text'
      }

    )

    .subscribe({

      next: (response) => {

        console.log(
          'Signup Response:',
          response
        );


        alert(response);


        this.signupEmail = '';

        this.signupPassword = '';


        this.showSignup = false;

        this.showLogin = true;


        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'Signup Error:',
          error
        );


        alert(
          error.error ||
          'Signup failed.'
        );

      }

    });

  }


  // ==============================
  // LOGOUT POPUP
  // ==============================

  openLogoutPopup(): void {

    if (!this.isLoggedIn) {
      return;
    }

    this.showLogoutPopup = true;

    this.cdr.detectChanges();

  }


  closeLogoutPopup(): void {

    this.showLogoutPopup = false;

    this.cdr.detectChanges();

  }


  // ==============================
  // CONFIRM LOGOUT
  // ==============================

  confirmLogout(): void {

    this.showLogoutPopup = false;

    this.isLoggedIn = false;

    this.loggedInEmail = '';

    // Clear the saved user when logging out.
    localStorage.removeItem('userEmail');

    this.analysisHistory = [];

    this.showHistory = false;

    this.showDashboard = false;

    // Reset dashboard
    this.dashboardStats = null;

    this.dashboardLoaded = false;

    this.analysisComplete = false;

    this.analysisResult = null;

    this.closeHistoryDetails();

    this.cdr.detectChanges();

  }


  // Keep logout() available for any older template/code reference.
  logout(): void {

    this.confirmLogout();

  }


  // ==============================
  // CHECK HOME PAGE
  // ==============================

  isHomePage(): boolean {
  return this.router.url === '/' || this.router.url === '';
}


  goToSection(section: string, event?: Event): void {

    if (event) {
      event.preventDefault();
    }

    if (section !== 'home' &&
        section !== 'features' &&
        section !== 'resume-analyzer') {
      return;
    }

    this.activeSection = section;

    if (this.router.url !== '/') {

      this.router.navigate(['/']).then(() => {

        this.activeSection = section;

        this.cdr.detectChanges();

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

      });

      return;
    }

    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  // ==============================
  // GO TO DASHBOARD PAGE
  // ==============================

  goToDashboard(): void {

    if (!this.isLoggedIn) {

      alert('Please login first.');

      this.openLogin();

      return;

    }

    // Leave the home-page section state when opening Dashboard.
    this.activeSection = '';
    this.router.navigate(['/dashboard']);

  }

  // ==============================
// GO TO HISTORY PAGE
// ==============================

goToHistory(): void {

  if (!this.isLoggedIn) {

    alert('Please login first.');

    this.openLogin();

    return;

  }

  // Leave the home-page section state when opening History.
  this.activeSection = '';
  this.router.navigate(['/history']);

}


  // ==============================
  // OPEN DASHBOARD
  // ==============================

  openDashboard(): void {

    if (!this.isLoggedIn) {

      alert(
        'Please login first.'
      );

      this.openLogin();

      return;

    }

    // Open Dashboard as a separate full-screen screen
    this.showDashboard = true;
    this.showHistory = false;
    this.closeHistoryDetails();

    this.loadDashboard();

    this.cdr.detectChanges();

  }


  // ==============================
  // CLOSE DASHBOARD
  // ==============================

  closeDashboard(): void {

    this.showDashboard = false;

    this.cdr.detectChanges();

  }


  // ==============================
  // LOAD DASHBOARD
  // ==============================

  loadDashboard(): void {

    if (
      !this.isLoggedIn ||
      !this.loggedInEmail
    ) {

      this.dashboardLoaded = false;

      return;

    }


    console.log(
      'Loading Dashboard for:',
      this.loggedInEmail
    );


    this.http.get<DashboardStats>(

      `/api/resume/dashboard?userEmail=${encodeURIComponent(this.loggedInEmail)}`

    )

    .subscribe({

      // ============================
      // SUCCESS
      // ============================

      next: (response) => {

        console.log(
          'Dashboard Response:',
          response
        );


        this.dashboardStats =
          response;


        this.dashboardLoaded =
          true;


        this.cdr.detectChanges();

      },


      // ============================
      // ERROR
      // ============================

      error: (error) => {

        console.error(
          'Dashboard Error:',
          error
        );


        this.dashboardStats =
          null;


        this.dashboardLoaded =
          false;

      }

    });

  }


  // ==============================
  // LOAD ANALYSIS HISTORY
  // ==============================

  loadHistory(): void {

    if (
      !this.isLoggedIn ||
      !this.loggedInEmail
    ) {

      alert(
        'Please login first.'
      );

      return;

    }


    // Prevent duplicate history API requests
    if (this.isLoadingHistory) {
      console.log('History request already in progress.');
      return;
    }

    this.isLoadingHistory = true;

    // Open History as a separate full-screen screen
    this.showHistory = true;
    this.showDashboard = false;
    this.closeHistoryDetails();


    this.http.get<AnalysisHistory[]>(

      `/api/resume/history?userEmail=${encodeURIComponent(this.loggedInEmail)}`

    )

    .subscribe({

      next: (response) => {

        console.log(
          'Analysis History:',
          response
        );


        this.analysisHistory =
          response;

        this.isLoadingHistory = false;


        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'History Error:',
          error
        );


        this.isLoadingHistory = false;


        alert(
          'Unable to load analysis history.'
        );

      }

    });

  }


  // ==============================
  // DELETE HISTORY ANALYSIS
  // ==============================

  deleteAnalysis(id: number): void {

    if (!id) {

      alert(
        'Analysis ID is missing.'
      );

      return;

    }


    const confirmed =
      confirm(
        'Are you sure you want to delete this analysis?'
      );


    if (!confirmed) {

      return;

    }


    console.log(
      'Deleting Analysis:',
      id
    );


    this.http.delete(

      `/api/resume/history?id=${id}`

    )

    .subscribe({

      // ============================
      // SUCCESS
      // ============================

      next: () => {

        console.log(
          'Analysis deleted successfully:',
          id
        );


        // Remove deleted item
        // from current history list

        this.analysisHistory =
          this.analysisHistory.filter(
            item => item.id !== id
          );


        // Refresh dashboard statistics

        this.loadDashboard();


        this.cdr.detectChanges();


        alert(
          'Analysis deleted successfully.'
        );

      },


      // ============================
      // ERROR
      // ============================

      error: (error) => {

        console.error(
          'Delete Analysis Error:',
          error
        );


        alert(
          error.status === 404
            ? 'Analysis not found.'
            : 'Unable to delete analysis.'
        );

      }

    });

  }


  // ==============================
  // CLOSE HISTORY
  // ==============================

  closeHistory(): void {

    this.showHistory = false;

    this.closeHistoryDetails();

    this.cdr.detectChanges();

  }


  // ==============================
  // VIEW HISTORY DETAILS
  // ==============================

  viewHistoryDetails(id: number): void {

    if (!id) {

      alert(
        'Analysis ID is missing.'
      );

      return;

    }


    this.isLoadingHistoryDetails = true;

    this.showHistoryDetails = false;

    this.selectedHistoryDetails = null;


    console.log(
      'Loading Analysis Details:',
      id
    );


    this.http.get<HistoryDetails>(

      `/api/resume/history/details?id=${id}`

    )

    .subscribe({

      // ============================
      // SUCCESS
      // ============================

      next: (response) => {

        console.log(
          'Analysis Details:',
          response
        );


        this.selectedHistoryDetails =
          response;


        this.isLoadingHistoryDetails =
          false;


        this.showHistoryDetails =
          true;


        this.cdr.detectChanges();

      },


      // ============================
      // ERROR
      // ============================

      error: (error) => {

        console.error(
          'History Details Error:',
          error
        );


        this.isLoadingHistoryDetails =
          false;


        this.showHistoryDetails =
          false;


        alert(
          error.status === 404
            ? 'Analysis details not found.'
            : 'Unable to load analysis details.'
        );


        this.cdr.detectChanges();

      }

    });

  }


  // ==============================
  // CLOSE HISTORY DETAILS
  // ==============================

  closeHistoryDetails(): void {

    this.showHistoryDetails = false;

    this.selectedHistoryDetails = null;

    this.isLoadingHistoryDetails = false;

  }


  // ==============================
  // FILE SELECT
  // ==============================

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;


    if (
      input.files &&
      input.files.length > 0
    ) {

      this.validateFile(
        input.files[0]
      );

    }

  }


  // ==============================
  // DRAG OVER
  // ==============================

  onDragOver(event: DragEvent): void {

    event.preventDefault();

    event.stopPropagation();

    this.isDragging = true;

  }


  // ==============================
  // DRAG LEAVE
  // ==============================

  onDragLeave(event: DragEvent): void {

    event.preventDefault();

    event.stopPropagation();

    this.isDragging = false;

  }


  // ==============================
  // DROP FILE
  // ==============================

  onDrop(event: DragEvent): void {

    event.preventDefault();

    event.stopPropagation();

    this.isDragging = false;


    const files =
      event.dataTransfer?.files;


    if (
      files &&
      files.length > 0
    ) {

      this.validateFile(
        files[0]
      );

    }

  }


  // ==============================
  // VALIDATE FILE
  // ==============================

  private validateFile(file: File): void {

    if (
      file.type !==
      'application/pdf'
    ) {

      alert(
        'Please select a PDF file.'
      );

      return;

    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        'File size must be less than 5MB.'
      );

      return;

    }


    this.selectedFile = file;

    this.analysisComplete = false;

    this.analysisResult = null;


    console.log(
      'Selected Resume:',
      file.name
    );

  }


  // ==============================
  // ANALYZE RESUME
  // ==============================

  analyzeResume(): void {


    // ==============================
    // CHECK LOGIN
    // ==============================

    if (!this.isLoggedIn) {

      alert(
        'Please login before analyzing your resume.'
      );

      this.openLogin();

      return;

    }


    // ==============================
    // CHECK RESUME
    // ==============================

    if (!this.selectedFile) {

      alert(
        'Please select a resume first.'
      );

      return;

    }


    // ==============================
    // CHECK JOB DESCRIPTION
    // ==============================

    if (
      !this.jobDescription.trim()
    ) {

      alert(
        'Please enter a Job Description first.'
      );

      return;

    }


    // ==============================
    // START ANALYSIS
    // ==============================

    this.isAnalyzing = true;

    this.analysisComplete = false;

    this.analysisResult = null;


    // ==============================
    // FORM DATA
    // ==============================

    const formData =
      new FormData();


    // Resume PDF

    formData.append(
      'file',
      this.selectedFile
    );


    // Job Description

    formData.append(
      'jobDescription',
      this.jobDescription.trim()
    );


    // ==============================
    // USER EMAIL
    // ==============================

    formData.append(
      'userEmail',
      this.loggedInEmail
    );


    // ==============================
    // DEBUG LOGS
    // ==============================

    console.log(
      'Sending Resume:',
      this.selectedFile.name
    );


    console.log(
      'Sending Job Description:',
      this.jobDescription
    );


    console.log(
      'Sending User Email:',
      this.loggedInEmail
    );


    // ==============================
    // API REQUEST
    // ==============================

    this.http.post<AnalysisResult>(

      '/api/resume/upload',

      formData

    )

    .subscribe({

      // ============================
      // SUCCESS
      // ============================

      next: (response) => {

        console.log(
          'Backend Response:',
          response
        );


        this.analysisResult =
          response;


        this.isAnalyzing =
          false;


        this.analysisComplete =
          true;


        // Refresh history after
        // successful analysis

        this.loadHistory();


        // Refresh dashboard after
        // successful analysis

        this.loadDashboard();


        this.cdr.detectChanges();

      },


      // ============================
      // ERROR
      // ============================

      error: (error) => {

        console.error(
          'Upload Error:',
          error
        );


        this.isAnalyzing =
          false;


        this.analysisComplete =
          false;


        alert(
          'Resume analysis failed. Please check if backend is running.'
        );


        this.cdr.detectChanges();

      }

    });

  }

}