package com.resume.analyzer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/resume")
public class ResumeController {


    // ==================================================
    // REPOSITORY
    // ==================================================

    private final ResumeAnalysisRepository analysisRepository;


    public ResumeController(
            ResumeAnalysisRepository analysisRepository) {

        this.analysisRepository =
                analysisRepository;
    }


    // ==================================================
    // UPLOAD RESUME
    // ==================================================

    @PostMapping("/upload")
    public ResponseEntity<ResumeAnalysisResponse> uploadResume(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam(
                    value = "jobDescription",
                    required = false,
                    defaultValue = ""
            )
            String jobDescription,

            @RequestParam(
                    value = "userEmail",
                    required = false,
                    defaultValue = ""
            )
            String userEmail) {


        try {

            // ==================================================
            // FILE VALIDATION
            // ==================================================

            if (file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .build();
            }


            // ==================================================
            // PDF VALIDATION
            // ==================================================

            if (!"application/pdf".equals(
                    file.getContentType())) {

                return ResponseEntity
                        .badRequest()
                        .build();
            }


            // ==================================================
            // PDF TEXT EXTRACTION
            // ==================================================

            PDDocument document =
                    Loader.loadPDF(file.getBytes());


            PDFTextStripper stripper =
                    new PDFTextStripper();


            String resumeText =
                    stripper.getText(document);


            document.close();


            // ==================================================
            // ANALYZE RESUME
            // ==================================================

            ResumeAnalysisResponse response =
                    analyzeResume(
                            resumeText,
                            jobDescription,
                            file.getOriginalFilename()
                    );


            // ==================================================
            // SAVE COMPLETE ANALYSIS
            // ==================================================

            ResumeAnalysis analysis =
                    new ResumeAnalysis(

                            response.getFileName(),

                            response.getScore(),

                            response.getAtsScore(),

                            response.getSkillsMatch(),

                            response.getExperience(),

                            userEmail,

                            response.getStrengths(),

                            response.getWarnings(),

                            response.getMatchedSkills(),

                            response.getMissingSkills(),

                            response.getRecommendations()
                    );


            analysisRepository.save(analysis);


            System.out.println(
                    "Complete resume analysis saved to database."
            );


            return ResponseEntity.ok(response);


        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }


    // ==================================================
    // GET USER ANALYSIS HISTORY
    // ==================================================

    @GetMapping("/history")
    public ResponseEntity<List<ResumeAnalysis>>
    getHistory(

            @RequestParam("userEmail")
            String userEmail) {


        if (userEmail == null || userEmail.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        List<ResumeAnalysis> history =
                analysisRepository
                        .findByUserEmail(userEmail);


        return ResponseEntity.ok(history);
    }


    // ==================================================
    // GET SINGLE ANALYSIS DETAILS
    // ==================================================

    @GetMapping("/history/details")
    public ResponseEntity<ResumeAnalysis>
    getAnalysisDetails(

            @RequestParam("id")
            Long id,

            @RequestParam("userEmail")
            String userEmail) {


        if (userEmail == null || userEmail.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        return analysisRepository
                .findByIdAndUserEmail(
                        id,
                        userEmail
                )

                .map(ResponseEntity::ok)

                .orElseGet(
                        () -> ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // ==================================================
    // DELETE ANALYSIS
    // ==================================================

    @DeleteMapping("/history")
    public ResponseEntity<Void> deleteAnalysis(
            @RequestParam("id")
            Long id,

            @RequestParam("userEmail")
            String userEmail) {

        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        return analysisRepository
                .findByIdAndUserEmail(id, userEmail)
                .map(analysis -> {
                    analysisRepository.delete(analysis);

                    System.out.println(
                            "Resume analysis deleted. ID: " + id
                    );

                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }


    // ==================================================
    // DASHBOARD STATISTICS
    // ==================================================

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats>
    getDashboard(

            @RequestParam("userEmail")
            String userEmail) {


        if (userEmail == null || userEmail.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        List<ResumeAnalysis> analyses =
                analysisRepository
                        .findByUserEmail(userEmail);


        if (analyses.isEmpty()) {

            return ResponseEntity.ok(
                    new DashboardStats()
            );
        }


        int totalAnalyses =
                analyses.size();


        int totalScore = 0;
        int totalAtsScore = 0;
        int totalSkillsMatch = 0;


        ResumeAnalysis bestAnalysis =
                analyses.get(0);


        for (ResumeAnalysis analysis : analyses) {

            totalScore +=
                    analysis.getScore();

            totalAtsScore +=
                    analysis.getAtsScore();

            totalSkillsMatch +=
                    analysis.getSkillsMatch();


            if (
                    analysis.getScore()
                            > bestAnalysis.getScore()
            ) {

                bestAnalysis =
                        analysis;
            }
        }


        int averageScore =
                totalScore / totalAnalyses;


        int averageAtsScore =
                totalAtsScore / totalAnalyses;


        int averageSkillsMatch =
                totalSkillsMatch / totalAnalyses;


        ResumeAnalysis latestAnalysis =
                analyses.get(
                        analyses.size() - 1
                );


        DashboardStats stats =
                new DashboardStats(

                        totalAnalyses,

                        averageScore,

                        averageAtsScore,

                        averageSkillsMatch,

                        bestAnalysis.getScore(),

                        bestAnalysis.getFileName(),

                        latestAnalysis.getFileName(),

                        latestAnalysis.getScore()
                );


        return ResponseEntity.ok(stats);
    }


    // ==================================================
    // DASHBOARD RESPONSE
    // ==================================================

    public static class DashboardStats {

        private int totalAnalyses;

        private int averageScore;

        private int averageAtsScore;

        private int averageSkillsMatch;

        private int bestScore;

        private String bestResume;

        private String latestResume;

        private int latestScore;


        public DashboardStats() {

            this.totalAnalyses = 0;

            this.averageScore = 0;

            this.averageAtsScore = 0;

            this.averageSkillsMatch = 0;

            this.bestScore = 0;

            this.bestResume = "";

            this.latestResume = "";

            this.latestScore = 0;
        }


        public DashboardStats(

                int totalAnalyses,

                int averageScore,

                int averageAtsScore,

                int averageSkillsMatch,

                int bestScore,

                String bestResume,

                String latestResume,

                int latestScore) {


            this.totalAnalyses =
                    totalAnalyses;


            this.averageScore =
                    averageScore;


            this.averageAtsScore =
                    averageAtsScore;


            this.averageSkillsMatch =
                    averageSkillsMatch;


            this.bestScore =
                    bestScore;


            this.bestResume =
                    bestResume;


            this.latestResume =
                    latestResume;


            this.latestScore =
                    latestScore;
        }


        public int getTotalAnalyses() {

            return totalAnalyses;
        }


        public int getAverageScore() {

            return averageScore;
        }


        public int getAverageAtsScore() {

            return averageAtsScore;
        }


        public int getAverageSkillsMatch() {

            return averageSkillsMatch;
        }


        public int getBestScore() {

            return bestScore;
        }


        public String getBestResume() {

            return bestResume;
        }


        public String getLatestResume() {

            return latestResume;
        }


        public int getLatestScore() {

            return latestScore;
        }
    }


    // ==================================================
    // RESUME ANALYSIS
    // ==================================================

    private ResumeAnalysisResponse analyzeResume(

            String resumeText,

            String jobDescription,

            String fileName) {


        String text =
                resumeText
                        .toLowerCase(Locale.ROOT);


        String jobText =
                jobDescription == null
                        ? ""
                        : jobDescription
                                .toLowerCase(Locale.ROOT);


        // ==================================================
        // SKILLS DATABASE
        // ==================================================

        String[] skills = {

                "java",
                "python",
                "c",
                "c++",
                "javascript",
                "html",
                "css",
                "sql",
                "mysql",
                "postgresql",
                "spring boot",
                "angular",
                "react",
                "node.js",
                "git",
                "github",
                "docker",
                "machine learning",
                "artificial intelligence",
                "data structures",
                "algorithms"

        };


        // ==================================================
        // RESUME SKILLS
        // ==================================================

        int skillCount = 0;


        for (String skill : skills) {

            if (containsSkill(text, skill)) {

                skillCount++;
            }
        }


        // ==================================================
        // JOB SKILL MATCHING
        // ==================================================

        List<String> matchedSkills =
                new ArrayList<>();


        List<String> missingSkills =
                new ArrayList<>();


        if (!jobText.isBlank()) {

            for (String skill : skills) {

                boolean jobRequires =
                        containsSkill(
                                jobText,
                                skill
                        );


                boolean resumeHas =
                        containsSkill(
                                text,
                                skill
                        );


                if (
                        jobRequires
                                && resumeHas
                ) {

                    matchedSkills.add(skill);
                }


                else if (jobRequires) {

                    missingSkills.add(skill);
                }
            }
        }


        // ==================================================
        // SKILLS MATCH SCORE
        // ==================================================

        int skillsMatch;


        if (
                !matchedSkills.isEmpty()
                        || !missingSkills.isEmpty()
        ) {

            int totalJobSkills =
                    matchedSkills.size()
                            + missingSkills.size();


            skillsMatch =
                    (
                            matchedSkills.size()
                                    * 100
                    )
                            / totalJobSkills;

        }

        else {

            skillsMatch =
                    Math.min(
                            skillCount * 10,
                            100
                    );
        }


        // ==================================================
        // ATS KEYWORDS
        // ==================================================

        String[] atsKeywords = {

                "skills",
                "experience",
                "education",
                "projects",
                "summary",
                "objective",
                "certification",
                "certifications",
                "achievements",
                "github",
                "linkedin",
                "technical skills",
                "contact"

        };


        int atsCount = 0;


        for (String keyword : atsKeywords) {

            if (containsSkill(text, keyword)) {

                atsCount++;
            }
        }


        int atsScore =
                Math.min(
                        atsCount * 9,
                        100
                );


        // ==================================================
        // EXPERIENCE
        // ==================================================

        int experience =
                calculateExperienceScore(text);


        // ==================================================
        // STRENGTHS
        // ==================================================

        List<String> strengths =
                new ArrayList<>();


        if (skillCount >= 5) {

            strengths.add(
                    "Good Technical Skills"
            );
        }


        if (containsSkill(text, "projects")) {

            strengths.add(
                    "Projects Section Present"
            );
        }


        if (containsSkill(text, "education")) {

            strengths.add(
                    "Education Section Present"
            );
        }


        if (containsSkill(text, "linkedin")) {

            strengths.add(
                    "Professional LinkedIn Profile"
            );
        }


        if (
                containsSkill(text, "certification")
                        ||
                        containsSkill(text, "certifications")
        ) {

            strengths.add(
                    "Certifications Present"
            );
        }


        if (
                text.contains("@")
                        &&
                        (
                                text.contains("gmail")
                                        ||
                                        text.contains("email")
                        )
        ) {

            strengths.add(
                    "Contact Information Complete"
            );
        }


        if (
                !jobText.isBlank()
                        &&
                        !matchedSkills.isEmpty()
        ) {

            int totalJobSkills =
                    matchedSkills.size()
                            + missingSkills.size();


            strengths.add(
                    "Matched "
                            + matchedSkills.size()
                            + " of "
                            + totalJobSkills
                            + " Job Skills"
            );
        }


        if (strengths.isEmpty()) {

            strengths.add(
                    "Resume Successfully Parsed"
            );
        }


        // ==================================================
        // WARNINGS
        // ==================================================

        List<String> warnings =
                new ArrayList<>();


        if (skillCount < 5) {

            warnings.add(
                    "Add More Technical Skills"
            );
        }


        if (!containsSkill(text, "experience")) {

            warnings.add(
                    "Add Experience Section"
            );
        }


        if (!containsSkill(text, "github")) {

            warnings.add(
                    "Add GitHub Profile"
            );
        }


        if (!missingSkills.isEmpty()) {

            warnings.add(
                    "Add Missing Job-Specific Skills"
            );
        }


        // ==================================================
        // RECOMMENDATIONS
        // ==================================================

        List<String> recommendations =
                new ArrayList<>();


        for (String skill : missingSkills) {

            recommendations.add(
                    "Add "
                            + skill
                            + " to your resume if you have experience with it."
            );
        }


        if (!containsSkill(text, "github")) {

            recommendations.add(
                    "Add your GitHub profile to showcase your projects."
            );
        }


        if (!containsSkill(text, "linkedin")) {

            recommendations.add(
                    "Add your LinkedIn profile to improve your professional presence."
            );
        }


        if (
                !containsSkill(text, "summary")
                        &&
                        !containsSkill(text, "objective")
        ) {

            recommendations.add(
                    "Add a short professional summary at the beginning of your resume."
            );
        }


        if (containsSkill(text, "projects")) {

            recommendations.add(
                    "Add measurable results and technologies used in your projects."
            );
        }


        if (
                !containsSkill(text, "experience")
                        &&
                        !containsSkill(text, "internship")
        ) {

            recommendations.add(
                    "If you have internship or work experience, include it with measurable achievements."
            );
        }


        // ==================================================
        // LIMIT RECOMMENDATIONS
        // ==================================================

        if (recommendations.size() > 6) {

            recommendations =
                    new ArrayList<>(
                            recommendations.subList(
                                    0,
                                    6
                            )
                    );
        }


        // ==================================================
        // OVERALL SCORE
        // ==================================================

        int score =
                (
                        atsScore
                                + skillsMatch
                                + experience
                )
                        / 3;


        // ==================================================
        // FINAL RESPONSE
        // ==================================================

        return new ResumeAnalysisResponse(

                score,

                atsScore,

                skillsMatch,

                experience,

                fileName,

                strengths,

                warnings,

                matchedSkills,

                missingSkills,

                recommendations
        );
    }


    // ==================================================
    // EXACT SKILL MATCHING
    // ==================================================

    private boolean containsSkill(

            String text,

            String skill) {


        String pattern =

                "(?i)(?<![a-zA-Z0-9+#.])"
                        + Pattern.quote(skill)
                        + "(?![a-zA-Z0-9+#.])";


        return Pattern
                .compile(pattern)
                .matcher(text)
                .find();
    }


    // ==================================================
    // EXPERIENCE SCORE
    // ==================================================

    private int calculateExperienceScore(

            String text) {


        if (
                containsSkill(text, "internship")
                        ||
                        containsSkill(text, "intern")
                        ||
                        containsSkill(text, "work experience")
                        ||
                        containsSkill(text, "professional experience")
        ) {

            return 90;
        }


        if (
                containsSkill(text, "projects")
                        ||
                        containsSkill(text, "project")
        ) {

            return 70;
        }


        if (
                containsSkill(text, "student")
                        ||
                        containsSkill(text, "fresher")
        ) {

            return 50;
        }


        return 40;
    }

}