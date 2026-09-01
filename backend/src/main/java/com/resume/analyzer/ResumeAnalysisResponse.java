package com.resume.analyzer;

import java.util.List;

public class ResumeAnalysisResponse {

    private int score;

    private int atsScore;

    private int skillsMatch;

    private int experience;

    private String fileName;

    private List<String> strengths;

    private List<String> warnings;

    private List<String> matchedSkills;

    private List<String> missingSkills;

    // NEW
    private List<String> recommendations;


    // ==================================================
    // CONSTRUCTOR
    // ==================================================

    public ResumeAnalysisResponse(

            int score,

            int atsScore,

            int skillsMatch,

            int experience,

            String fileName,

            List<String> strengths,

            List<String> warnings,

            List<String> matchedSkills,

            List<String> missingSkills,

            // NEW
            List<String> recommendations) {


        this.score =
                score;


        this.atsScore =
                atsScore;


        this.skillsMatch =
                skillsMatch;


        this.experience =
                experience;


        this.fileName =
                fileName;


        this.strengths =
                strengths;


        this.warnings =
                warnings;


        this.matchedSkills =
                matchedSkills;


        this.missingSkills =
                missingSkills;


        // NEW
        this.recommendations =
                recommendations;
    }


    // ==================================================
    // GETTERS
    // ==================================================

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


    public String getFileName() {

        return fileName;
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


    // ==================================================
    // RECOMMENDATIONS
    // ==================================================

    public List<String> getRecommendations() {

        return recommendations;
    }

}