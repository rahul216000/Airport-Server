const express = require("express");
const router = express.Router();
const nthline = require('nthline')
const path = require("path")
const fs = require('fs');
const readline = require('readline');

router.post("/", async (req, res) => {
    let query = req.body.query;
    let count = req.body.count;
    try {
        query = query.split(" ");

        for (let i = 0; i < query.length; i++) {
            query[i] = query[i][0].toUpperCase() + query[i].substr(1);
        }

        query = query.join(" ");


        let FilterAirports = await Mediator(query)
        res.json({ countNo: count, CityArray: [query], AirportsArr: FilterAirports, NumberOnCitiesArr: [1] });

    } catch (error) {
        console.log(error);
        res.json({ countNo: count, CityArray: [], AirportsArr: [], NumberOnCitiesArr: [] });

    }

})

router.get("/", (req, res) => {
    res.send("Allowed")
})


async function CityNameByQuery(query) {
    let FilteredCityArr = []
    let CityArr = await CityArray(query)
    for (i = 0; i < CityArr.length; i++) {
        if (CityArr[i].substr(0, query.length).toUpperCase() == query.toUpperCase()) {
            FilteredCityArr.push(CityArr[i])
        }
    }
    FilteredCityArr = FilteredCityArr.slice(0, 5)
    return FilteredCityArr
}

async function CityArray(query) {
    query = query.charAt(0)
    query = query.toUpperCase()

    let FirstCharofCity = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `a`, `c`, `e`, `f`, `h`, `l`, `m`, `n`, `p`, `t`, `u`, `w`, `Á`, `Â`, `Ä`, `Å`, `Æ`, `Ç`, `É`, `Í`, `Î`, `Ñ`, `Ó`, `Ö`, `Ø`, `Ú`, `Ü`, `Þ`, `Ā`, `Č`, `Đ`, `İ`, `Ĳ`, `Ł`, `Ō`, `Ő`, `Ś`, `Ş`, `Š`, `Ż`, `Ž`, `Л`]
    let IndexofCity
    for (let i = 0; i < FirstCharofCity.length; i++) {
        if (query == FirstCharofCity[i]) {
            IndexofCity = i
        }
    }

    let CityArr = await FindNthLine(IndexofCity, "Cities.txt")
    CityArr = CityArr.split(", ");
    return CityArr
}

async function AirportsNameByCity(arr) {
    let AllAirportsArr = []
    let NumberofCitiesArr = []

    for (let i = 0; i < arr.length; i++) {
        let MediatorArr = await Mediator(arr[i])
        NumberofCitiesArr.push(MediatorArr.length);
        AllAirportsArr.push(...MediatorArr)

    }
    return [AllAirportsArr, NumberofCitiesArr]
}

async function Mediator(CityName) {
    let LineForCity = await LineForCityFn(CityName)
    if (LineForCity == 0) {
        return []
    }
    let AirpotsArr = await FindNthLine(LineForCity, "Airports.txt")
    AirpotsArr = AirpotsArr.split(",");
    AirpotsArr.pop()
    AirpotsArr = AirpotsArr.slice(0, 10)
    return AirpotsArr
}

function LineForCityFn(CityName) {
    return new Promise((resolve, reject) => {
        const file = readline.createInterface({
            input: fs.createReadStream('CityNames.txt'),
            output: process.stdout,
            terminal: false
        });

        let count = 0
        let LineForCity = 0
        file.on('line', (line) => {
            if (line == CityName) {
                LineForCity = count
            }
            count++
        });

        file.on('close', function () {
            resolve(LineForCity)
        })
    });
}

async function FindNthLine(line, filePath) {
    filePath = `${__dirname}/${filePath}`
    let data = await nthline(line, filePath)
    return data;
}

module.exports = router;