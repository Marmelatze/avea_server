"use strict";

const express = require("express");
const avea = require("avea_bulb");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))


app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.listen(3000, function () {
    console.log("Example app listening on port 3000!");
});


const router = express.Router();

const registry = new avea.Registry();
registry.discover();

router.route("/bulbs")
    .get((req, res) => {
        res.json({bulbs: registry.all()});
    });

router.route("/bulbs/:id")
    .get((req, res) => {
        res.json(registry.getBulb(req.params.id));
    })
    .post((req, res) => {
        const color = req.body.color;
        if (undefined !== color) {
            const rgb = color.split(",");
            registry.setColor(req.params.id, new avea.Color(rgb[0], rgb[1], rgb[2], rgb[3]));
        }
        const brightness = req.body.brightness;
        if (undefined !== brightness) {
            registry.setBrightness(req.params.id, brightness);
        }
        registry.update(req.params.id).then(state => {
            res.json(state);
        });
    })
;


app.use("/api", router);
