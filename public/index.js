$(document).ready(function () {
  if ($(document).width() < 1024) {
    $(".navhide").next().hide()
  }

  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  $(".navhide").click(function () {
    if ($(document).width() < 1024) {
      $(this).next().toggle()
    }
  });

  $(".about").click(function () {
    Swal({
      type: 'info',
      title: 'A Movie Database',
      text: 'Made with ❤️ by Leon for the Salsiccia Family!',
      footer: '<a target="_blank" href="https://github.com/LonJonn/TheSausageBox">GitHub Repo</a>'
    })
  })
});

var app = new Vue({
  el: '#vue-app',
  data() {
    return {
      loading: true,
      movies: [],
      search: {
        title: "",
        genre: "Any",
        quality: "Any"
      },
      info: {
        size: 0,
        percentage: 0
      },
      add: {
        genres: ["Action", "Adventure", "Animation", "Thriller", "Horror", "Drama"],
        link: "",
        title: "",
        chosenGenres: [],
        year: null,
        passphrase: "",
        errors: ["passphrase"]
      }
    }
  },
  mounted() {
    axios.get("/api").then(response => {
      this.movies = response.data
      this.loading = false
    });
    axios.get("/api/info").then(response => {
      this.info = response.data
    });
  },
  computed: {
    filter: function () {
      var name_re = new RegExp(this.search.title, 'i')
      var filtered = []
      for (i in this.movies) {
        if (this.movies[i].title.match(name_re)
          && (this.movies[i].genre.includes(this.search.genre) || this.search.genre === "Any")
          && (this.movies[i].quality.includes(this.search.quality) || this.search.quality === "Any")) {
          filtered.push(this.movies[i])
        }
      }
      return filtered
    },
    getTitleSuccess: function() {
      if (this.add.title) {
        return "is-success"
      } else {
        return ""
      }
    },
    getYearSuccess: function() {
      if (this.add.year) {
        return "is-success"
      } else {
        return ""
      }
    },
    getPassSuccess: function() {
      if (this.add.passphrase == "Showtime") {
        this.add.errors = this.add.errors.filter(item => item !== "passphrase")
        return "is-success"
      } else if (this.add.passphrase) {
        this.add.errors.indexOf("passphrase") === -1 ? this.add.errors.push("passphrase") : null;
        return "is-danger"
      } else {
        this.add.errors.indexOf("passphrase") === -1 ? this.add.errors.push("passphrase") : null;
        return ""
      }
    },
    getGenreSuccess: function() {
      if (this.add.chosenGenres.length == 0) {
        return ""
      } else if (this.add.chosenGenres.length == 2) {
        return "is-success"
      } else {
        return "is-danger"
      }
    }
  },
   methods: {
     deleteFile(file) {
       $this = this;
       Swal({
         title: "Are you sure?",
         text: "You won't be able to revert this!",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#e74c3c",
         cancelButtonColor: "#3085d6",
         confirmButtonText: "Yes, delete it!"
       }).then(async function (result) {
         if (result.value) {
           $this.loading = true;
           await axios.delete("/api/delete/" + file)
           Swal({
             title: "File Deleted!",
             type: "success",
             toast: true,
             position: "top",
             timer: 4000,
             showConfirmButton: false
           });
           axios.get("/api").then(response => {
             $this.movies = response.data
             $this.loading = false
           });
           axios.get("/api/info").then(response => {
             $this.info = response.data
           });
         }
       });
     }
   }
});