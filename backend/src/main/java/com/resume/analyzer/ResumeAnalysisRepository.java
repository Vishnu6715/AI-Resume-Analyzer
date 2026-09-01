package com.resume.analyzer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Long> {

    List<ResumeAnalysis> findByUserEmail(String userEmail);

    Optional<ResumeAnalysis> findByIdAndUserEmail(Long id, String userEmail);
}
