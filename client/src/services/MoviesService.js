import Api from "./Api";

export default {
  getMovies() {
    return Api().get("/");
  },
  getStorageInfo() {
    return Api().get("/info")
  },
  deleteMovie(file) {
    return Api().delete("/" + file)
  },
  addMovie(movieData) {
    return Api().post("/", movieData)
  }
};
