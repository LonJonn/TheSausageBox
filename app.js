const express = require("express")
const cors = require("cors")
const fs = require("fs")
const app = express();
const videoDuration = require("get-video-duration")
const videoResolution = require("get-video-dimensions")
const moment = require("moment")
const momentDurFor = require("moment-duration-format")
momentDurFor(moment)

app.use(cors());
app.use(express.static("Movies"))
app.use(express.static("public"))

app.get("/api/", async (req, res) => {
  const movies = await Promise.all(fs.readdirSync("Movies")
  .filter(file => !file.startsWith("."))
  .map(async movie => {
    const durationSec = await videoDuration.getVideoDurationInSeconds("./movies/" + movie)
    const res = await videoResolution("./movies/" + movie)
    let quality = res.height
    if (res.height > 480) quality = 720;
    if (res.height > 720 && res.width != 1280) quality = 1080;

    return {
      title: movie.split("_")[0],
      genre: movie.split("_")[1].split("-").sort(),
      year: movie.split("_")[2].split(".")[0],
      quality: quality.toString() + "p",
      duration: moment.duration(durationSec, "seconds").format("H [hour] mm [min]"),
      format: movie.split("_")[2].split(".")[1],
      filename: movie
    }
  }))
  res.send(movies)
})

const server = app.listen(3000, () => {
  console.log("Running on port 3000...");
})
