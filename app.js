const express = require("express")
const cors = require("cors")
const fs = require("fs")
const app = express();
const videoDuration = require("get-video-duration")
const videoResolution = require("get-video-dimensions")
const moment = require("moment")
const momentDurFor = require("moment-duration-format")
const folderSize = require("get-folder-size")
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
      let size = fs.statSync("./movies/" + movie).size;
      if (res.height > 480) quality = 720;
      if (res.height > 720 && res.width != 1280) quality = 1080;

      return {
        title: movie.split("_")[0],
        genre: movie.split("_")[1].split("-").sort(),
        year: movie.split("_")[2].split(".")[0],
        quality: quality.toString() + "p",
        size: Number((size / 1000 / 1000).toFixed(1)),
        duration: moment.duration(durationSec, "seconds").format("H [hour] mm [min]"),
        format: movie.split("_")[2].split(".")[1],
        filename: movie
      }
    }))
  res.send(movies)
})

app.get("/api/info", (req, res) => {
  folderSize("./Movies", (error, size) => {
    if (error) res.send(error);
    data = {
      size: (size / 1024 / 1024 / 1024).toFixed(1),
      percentage: (size / 1024 / 1024 / 1024 / 32 * 100).toFixed(0)
    }
    res.send(data)
  })
})

app.delete("/api/delete/:file", async (req, res) => {
  fs.unlink("./Movies/" + req.params.file, error => {
    if (error) {
      res.status(404).send("File not Found!")
    } else {
      res.send("File Deleted.")
    }
  });
});

const server = app.listen(3000, () => {
  console.log("Running on port 3000...");
})
