const express = require('express');
const app = express();
const nthline = require('nthline')
const PORT = process.env.PORT || 3000;
const path = require("path")
const fs = require('fs');
const readline = require('readline');
const cors = require('cors');
app.use(cors({
  origin: [
    // 'http://127.0.0.1:5500',
  'https://airport-form.netlify.app'
]
}));
app.use(express.json())

app.post("/", async (req, res) => {
    let query = req.body.query;
    let FilteredCity = await CityNameByQuery(query)
    let FilterAirportsAndNumberofCities = await AirportsNameByCity(FilteredCity)
    let FilterAirports = FilterAirportsAndNumberofCities[0]
    let NumberOnCities = FilterAirportsAndNumberofCities[1]

    console.log(query);
    console.log(FilteredCity);

    res.json({ CityArray: FilteredCity, AirportsArr: FilterAirports, NumberOnCitiesArr: NumberOnCities });

})

app.get("/", (req, res) => {
    res.send("Not Allowed")
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
    let AirpotsArr = await FindNthLine(LineForCity, "Airports.txt")
    AirpotsArr = AirpotsArr.split(",");
    AirpotsArr.pop()
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

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    } else {
        console.log('Server not started ' + error);
    }

});