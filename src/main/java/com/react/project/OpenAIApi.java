package com.react.project;

import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class OpenAIApi {
    private static final String API_KEY = "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";

    public String ask(String prompt){
        String responeBody = "";
        String formattedPrompt = String.format("답변은 한국어로 해주세요: %s", prompt);

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("prompt", formattedPrompt);
        jsonBody.put("max_tokens", 50);
        jsonBody.put("n", 1);
        jsonBody.put("temperature", 0.7);

        try{
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/engines/text-davinci-002/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + API_KEY)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody.toString()))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            responeBody = extractAnswer(response.body());

        } catch (Exception e) {
            e.printStackTrace();
        }

        return responeBody;
    }

    private String extractAnswer(String responseJson){
        JSONObject jsonObject = new JSONObject(responseJson);

        if(jsonObject.has("choices")){
            return jsonObject.getJSONArray("choices")
                    .getJSONObject(0)
                    .getString("text")
                    .trim();
        }else{
            System.out.println(responseJson);
            return "API 호출 중 오류가 발생했습니다. ";
        }
    }
}
