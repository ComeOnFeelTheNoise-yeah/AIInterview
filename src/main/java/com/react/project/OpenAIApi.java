package com.react.project;

import org.json.JSONArray;
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

        JSONArray messages = new JSONArray();
        messages.put(new JSONObject().put("role", "system").put("content", "You are a helpful assistant."));
        messages.put(new JSONObject().put("role", "user").put("content", prompt));

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("messages", messages);
        jsonBody.put("max_tokens", 150);
        jsonBody.put("temperature", 0.8);
        jsonBody.put("model", "gpt-3.5-turbo");

        try{
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
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
            JSONObject choice = jsonObject.getJSONArray("choices").getJSONObject(0);
            if(choice.has("message")) { // message 키가 있는지 확인
                JSONObject message = choice.getJSONObject("message");
                if(message.has("content")) { // content 키가 있는지 확인
                    return message.getString("content").trim();
                } else {
                    System.out.println("Error: 'content' key not found in message: " + message.toString());
                }
            } else {
                System.out.println("Error: 'message' key not found in choice: " + choice.toString());
            }
        } else {
            System.out.println("Error: 'choices' key not found in response: " + responseJson);
        }
        return "API 호출 중 오류가 발생했습니다. ";
    }
}
