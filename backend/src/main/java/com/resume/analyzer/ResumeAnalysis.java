package com.resume.analyzer;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "resume_analysis")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String fileName;

    private int score;

    private int atsScore;

    private int skillsMatch;

    private int experience;

    private String userEmail;


    // ==================================================
    // ANALYSIS DETAILS
    // ==================================================

    @ElementCollection
    @CollectionTable(
            name = "resume_strengths",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "strength")
    private List<String> strengths;


    @ElementCollection
    @CollectionTable(
            name = "resume_warnings",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "warning")
    private List<String> warnings;


    @ElementCollection
    @CollectionTable(
            name = "resume_matched_skills",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "skill")
    private List<String> matchedSkills;


    @ElementCollection
    @CollectionTable(
            name = "resume_missing_skills",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "skill")
    private List<String> missingSkills;


    @ElementCollection
    @CollectionTable(
            name = "resume_recommendations",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "recommendation")
    private List<String> recommendations;


    // ==================================================
    // DEFAULT CONSTRUCTOR
    // ==================================================

    public ResumeAnalysis() {
    }


    // ==================================================
    // CONSTRUCTOR
    // ==================================================

    public ResumeAnalysis(

            String fileName,

            int score,

            int atsScore,

            int skillsMatch,

            int experience,

            String userEmail,

            List<String> strengths,

            List<String> warnings,

            List<String> matchedSkills,

            List<String> missingSkills,

            List<String> recommendations) {


        this.fileName = fileName;

        this.score = score;

        this.atsScore = atsScore;

        this.skillsMatch = skillsMatch;

        this.experience = experience;

        this.userEmail = userEmail;

        this.strengths = strengths;

        this.warnings = warnings;

        this.matchedSkills = matchedSkills;

        this.missingSkills = missingSkills;

        this.recommendations = recommendations;
    }


    // ==================================================
    // GETTERS
    // ==================================================

    public Long getId() {

        return id;
    }


    public String getFileName() {

        return fileName;
    }


    public int getScore() {

        return score;
    }


    public int getAtsScore() {

        return atsScore;
    }


    public int getSkillsMatch() {

        return skillsMatch;
    }


    public int getExperience() {

        return experience;
    }


    public String getUserEmail() {

        return userEmail;
    }


    public List<String> getStrengths() {

        return strengths;
    }


    public List<String> getWarnings() {

        return warnings;
    }


    public List<String> getMatchedSkills() {

        return matchedSkills;
    }


    public List<String> getMissingSkills() {

        return missingSkills;
    }


    public List<String> getRecommendations() {

        return recommendations;
    }
}