package com.react.project.controller;

import com.react.project.entity.IntroduceDataEntity;
import com.react.project.service.IntroduceDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/introduceData")
public class IntroduceDataController {
    private final IntroduceDataService introduceDataService;

    @Autowired
    public IntroduceDataController(IntroduceDataService introduceDataService) {
        this.introduceDataService = introduceDataService;
    }

    @PostMapping
    public IntroduceDataEntity addIntroduceData(@RequestBody IntroduceDataEntity introduceData) {
        return introduceDataService.saveIntroduceData(introduceData);
    }
}
