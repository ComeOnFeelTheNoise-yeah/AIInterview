package com.react.project.service;

import com.react.project.AnalysisResult;
import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;
import kr.co.shineware.util.common.model.Pair;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.json.simple.parser.ParseException;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.similarities.ClassicSimilarity;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.BooleanQuery;
import org.springframework.web.client.RestTemplate;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import java.io.IOException;

import com.react.project.OpenAIApi;

@Service
public class AnalysisService {
    static {
        BooleanQuery.setMaxClauseCount(4096);  // 설정
    }
    private final Komoran komoran;
    private List<String> storedTexts;

    public AnalysisService() throws Exception {
        this.komoran = new Komoran(DEFAULT_MODEL.FULL);
        this.storedTexts = loadStoredTexts();
    }

    public AnalysisResult analyze(String content) {
        AnalysisResult result = new AnalysisResult();

        // 유사도 측정
        double similarity = computeSimilarity(content);
        result.setSimilarity(similarity);

        // 표절도 검사
        boolean isPlagiarized = (similarity > 0.9); // 임의의 임계값
        result.setIsPlagiarized(isPlagiarized);

        // 맞춤법 검사
        List<String> correctedTexts = new ArrayList<>();
        String[] contents = content.split("\n\n");  // 문제와 내용 조합을 분리합니다.
        for (String text : contents) {
            correctedTexts.add(checkSpellingWithGPT(text));
        }
        result.setCorrectedTexts(correctedTexts);


        return result;
    }

    private List<String> loadStoredTexts() throws Exception {
        List<String> texts = new ArrayList<>();
        JSONParser parser = new JSONParser();

        FileReader reader = new FileReader(ResourceUtils.getFile("classpath:intro_full.json"));

        Object obj = parser.parse(reader);
        JSONArray jsonArray = (JSONArray) obj;

        for (Object jsonObject : jsonArray) {
            JSONObject textObj = (JSONObject) jsonObject;
            texts.add(textObj.get("Content").toString());
        }

        return texts;
    }

    private double computeSimilarity(String content) {
        double maxSimilarity = 0.0;

        for (String storedText : storedTexts) {
            double similarity = calculateCosineSimilarity(content, storedText);
            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
            }
        }

        return maxSimilarity;
    }

    private double calculateCosineSimilarity(String text1, String text2) {
        try {
            Directory directory = new RAMDirectory();
            StandardAnalyzer analyzer = new StandardAnalyzer();
            IndexWriterConfig config = new IndexWriterConfig(analyzer);
            IndexWriter writer = new IndexWriter(directory, config);

            addDocument(writer, escapeSpecialChars(text1));
            addDocument(writer, escapeSpecialChars(text2));
            writer.close();

            IndexReader reader = DirectoryReader.open(directory);
            IndexSearcher searcher = new IndexSearcher(reader);
            searcher.setSimilarity(new ClassicSimilarity()); // Use TF-IDF

            QueryParser parser = new QueryParser("content", analyzer);
            Query query = parser.parse(escapeSpecialChars(text2));
            TopDocs results = searcher.search(query, 2); // Search for top 2 documents

            if (results.totalHits.value >= 1) {
                return results.scoreDocs[0].score; // Return the similarity score of the top document
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0.0;
    }

    private static void addDocument(IndexWriter w, String content) throws IOException {
        Document doc = new Document();
        doc.add(new TextField("content", content, Field.Store.YES));
        w.addDocument(doc);
    }

    private String escapeSpecialChars(String text) {
        String[] specialChars = new String[]{"\\", "+", "-", "&&", "||", "!", "(", ")", "{", "}", "[", "]", "^", "~", "*", "?", ":", "/"};
        for (String specialChar : specialChars) {
            text = text.replace(specialChar, "\\" + specialChar);
        }
        return text;
    }

    public String checkSpellingWithHanspell(String text) {
        String apiUrl = "http://localhost:5000/check_spelling";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        JSONObject requestBody = new JSONObject();
        requestBody.put("text", text);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            String responseBody = response.getBody();
            JSONParser parser = new JSONParser();
            try {
                JSONObject jsonResponse = (JSONObject) parser.parse(responseBody);
                return (String) jsonResponse.get("corrected_text");
            } catch (ParseException e) {
                e.printStackTrace();
                System.out.println("Error parsing the response JSON: " + responseBody);
                return null;
            }
        } else {
            // API 호출 오류 처리
            System.out.println("Error calling the Hanspell service: " + response.getStatusCode());
            return null;
        }
    }

    public String checkSpellingWithGPT(String text) {
        OpenAIApi openai = new OpenAIApi();
        String prompt = text + "이 텍스트에서 맞춤법 검사해서 고칠 점만 말해줘";
        String correctedText = openai.askAnalysis(prompt);

        return correctedText;
    }

}
