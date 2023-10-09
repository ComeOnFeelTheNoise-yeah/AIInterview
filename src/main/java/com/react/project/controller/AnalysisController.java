package com.react.project.controller;

import com.react.project.AnalysisResult;
import com.react.project.service.AnalysisService;
import com.react.project.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AnalysisController {

    @Autowired
    AnalysisService analysisService;
    @PostMapping("/api/checkPlagiarism")
    public AnalysisResult analyze(@RequestBody String content) {
        // 실제 분석 서비스를 호출하여 결과를 받아옵니다.
        AnalysisResult result = analysisService.analyze(content);
        return result;
    }

    @PostMapping("/api/checkSpellingWithGPT")
    public ResponseEntity<Map<String, String>> checkSpelling(@RequestBody String content) {
        String correctedText = analysisService.checkSpellingWithGPT(content);
        Map<String, String> response = new HashMap<>();
        response.put("corrected_text", correctedText);
        return ResponseEntity.ok(response);
    }

}

