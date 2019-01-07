const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");
const moment = require("moment");
const momentDurFor = require("moment-duration-format");
const folderSize = require("get-folder-size");
const videoDownloader = require("youtube-dl");
const sanitise = require("sanitize-filename");
momentDurFor(moment);

const moviesPath = path.join(__dirname, "../static/movies/");
const tempPath = path.join(__dirname, "../static/temp/");

router.get("/", async (req, res) => {
  const movies = await Promise.all(
    fs
      .readdirSync(moviesPath)
      .filter(file => !file.startsWith("."))
      .map(async movie => {
        const metadata = (await ffprobe(path.join(moviesPath, movie), {
          path: ffprobeStatic.path
        })).streams[0];
        const durationSec = Number(metadata.duration).toFixed(0);
        let quality = metadata.height;
        if (metadata.height > 480) quality = 720;
        if (metadata.height > 720 && metadata.width != 1280) quality = 1080;
        let size = fs.statSync(path.join(moviesPath, movie)).size;

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
            .duration(Number(durationSec), "seconds")
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

  videoDownloader.exec(
    req.body.link,
    ["-o", path.join(tempPath, filename), "-f", "22"],
    {},
    err => {
      if (err) {
        res.status(400).end();
      } else {
        fs.renameSync(
          path.join(tempPath, filename),
          path.join(moviesPath, filename)
        );
        res.end();
      }
    }
  );
});

module.exports = router;
