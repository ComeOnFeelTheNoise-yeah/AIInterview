package com.react.project.controller;

import com.react.project.service.PythonModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PredictionController {

    @Autowired
    private PythonModelService pythonModelService;

    @PostMapping("/predict")
    public String predict(@RequestBody String content) {
        String label = pythonModelService.predict(content);
        return label;
    }
}

