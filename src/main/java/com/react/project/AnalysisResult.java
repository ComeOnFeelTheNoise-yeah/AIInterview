package com.react.project;

import lombok.Getter;

import java.util.List;

@Getter
public class AnalysisResult {

    private double similarity;
    private boolean isPlagiarized;  // 여기 이름을 변경합니다.
    private List<String> grammarErrors;
    private List<String> correctedTexts;

    // 기본 생성자
    public AnalysisResult() {
    }

    // getter와 setter 메소드

    public void setSimilarity(double similarity) {
        this.similarity = similarity;
    }

    public void setIsPlagiarized(boolean isPlagiarized) {  // 여기 이름을 변경합니다.
        this.isPlagiarized = isPlagiarized;
    }

    public void setGrammarErrors(List<String> grammarErrors) {
        this.grammarErrors = grammarErrors;
    }

    public void setCorrectedTexts(List<String> correctedTexts) {  // 추가된 setter 메소드
        this.correctedTexts = correctedTexts;
    }
}
