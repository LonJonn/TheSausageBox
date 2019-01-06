const express = require("express");
const router = express.Router();
const fs = require("fs");
const videoDuration = require("get-video-duration");
const videoResolution = require("get-video-dimensions");
const moment = require("moment");
const momentDurFor = require("moment-duration-format");
const folderSize = require("get-folder-size");
const videoDownloader = require("youtube-dl");
const sanitise = require("sanitize-filename");
momentDurFor(moment);

const moviesPath = "./static/movies/";
const tempPath = "./static/temp/";

router.get("/", async (req, res) => {
  const movies = await Promise.all(
    fs
      .readdirSync("./static/movies")
      .filter(file => !file.startsWith("."))
      .map(async movie => {
        const durationSec = await videoDuration.getVideoDurationInSeconds(
          moviesPath + movie
        );
        const res = await videoResolution(moviesPath + movie);
        let quality = res.height;
        let size = fs.statSync(moviesPath + movie).size;
        if (res.height > 480) quality = 720;
        if (res.height > 720 && res.width != 1280) quality = 1080;

        return {
          title: movie.split("_")[0],
          genre: movie
            .split("_")[1]
            .split("-")
            .sort(),
          year: movie.split("_")[2].split(".")[0],
          quality: quality.toString() + "p",
          size: Number((size / 1024 / 1024).toFixed(0)),
          duration: moment
            .duration(durationSec, "seconds")
            .format("H [hour] mm [min]"),
          format: movie.split("_")[2].split(".")[1],
          filename: movie
        };
      })
  );
  res.send(movies);
});

router.get("/info", (req, res) => {
  folderSize(moviesPath, (error, size) => {
    if (error) res.send(error);
    const data = {
      size: (size / 1024 / 1024 / 1024).toFixed(1),
      percentage: ((size / 1024 / 1024 / 1024 / 20) * 100).toFixed(0),
      storageSize: 20
    };
    res.send(data);
  });
});

router.delete("/:file", (req, res) => {
  fs.unlink(moviesPath + req.params.file, error => {
    if (error) {
      res.status(404).send("File not Found!");
    } else {
      res.end();
    }
  });
});

router.post("/", (req, res) => {
  const filename = sanitise(
    `${req.body.title}_${req.body.genres}_${req.body.year}.mp4`
  );

  videoDownloader(req.body.link, err => {
    if (err) {
      res.status(400).end();
    } else {
      res.end();
      const movie = videoDownloader(req.body.link);

      movie.on("info", () => {
        movie.pipe(fs.createWriteStream(tempPath + filename));

        movie.on("end", () => {
          fs.renameSync(tempPath + filename, moviesPath + filename);
        });
      });
    }
  });
});

module.exports = router;
