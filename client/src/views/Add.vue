<template>
  <div>
    <BulmaHeader title="Something to Add? 😊" :subtitle="['You\'re in the right place!']"/>

    <section class="section">
      <div class="container column is-8">
        <h1 class="title">Add a Movie</h1>
        <b-field
          label="Link:"
          :type="{'is-danger': errors.has('link')}"
          :message="errors.first('link') || 'Must be a direct link.'"
        >
          <b-input
            name="link"
            v-model="add.link"
            v-validate="'required'"
            placeholder="E.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          ></b-input>
        </b-field>

        <b-field
          label="Title"
          :type="{'is-danger': errors.has('title')}"
          :message="errors.first('title')"
        >
          <b-input
            name="title"
            v-model="add.title"
            v-validate="'required'"
            placeholder="E.g. Alice in Wonderland"
            maxlength="40"
          ></b-input>
        </b-field>

        <div class="columns">
          <div class="column is-9">
            <b-field
              label="Genres:"
              :type="getGenreSuccess"
              :message="errors.first('genres') || 'Please choose two.'"
            >
              <b-taginput
                autocomplete
                name="genres"
                v-validate="'required'"
                v-model="add.genres"
                :data="genreOptions"
                :open-on-focus="true"
                icon="label"
                placeholder="E.g. Animation"
              ></b-taginput>
            </b-field>
          </div>

          <div class="column">
            <b-field
              label="Year:"
              :type="{'is-danger': errors.has('year')}"
              :message="errors.first('year')"
            >
              <b-select
                expanded
                name="year"
                v-validate="'required'"
                v-model="add.year"
                placeholder="E.g. 2000"
              >
                <option v-for="year in yearRange" :value="year" :key="year">{{ year }}</option>
              </b-select>
            </b-field>
          </div>
        </div>

        <button
          @click="validateBeforeSubmit()"
          centered
          class="button is-medium is-primary"
        >Add the Movie!</button>
      </div>
    </section>
  </div>
</template>

<script>
import BulmaHeader from "@/components/BulmaHeader.vue";
import MoviesService from "@/services/MoviesService";
import swal from "sweetalert2";
import _ from "lodash";

export default {
  name: "Add",
  components: {
    BulmaHeader
  },
  data() {
    return {
      add: {
        link: null,
        title: null,
        genres: [],
        year: null
      },
      yearRange: _.range(new Date().getFullYear(), 1949),
      genreOptions: [
        "Action",
        "Adventure",
        "Animation",
        "Drama",
        "Comedy",
        "Horror",
        "Thriller"
      ]
    };
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (!result || this.add.genres.length != 2) {
          this.$toast.open({
            message: "Form is not valid! Please check the fields.",
            type: "is-danger",
            position: "is-bottom"
          });
          return;
        }
        this.addMovie();
      });
    },
    async addMovie() {
      swal({
        title: "Adding!...",
        text:
          "The download has started and will be added to the home page when done!",
        type: "info"
      });
      try {
        await MoviesService.addMovie({
          link: this.add.link,
          title: this.add.title,
          genres: this.add.genres[0] + "-" + this.add.genres[1],
          year: this.add.year
        });
        swal({
          title: "Finished!",
          text: "Download finished and added to the home page!",
          type: "success"
        });
        this.$router.push("/");
      } catch (error) {
        swal({
          title: "Uh Oh!",
          text: "Download Failed! Your link is Invalid.",
          type: "error"
        });
      }
    }
  },
  computed: {
    getGenreSuccess: function() {
      if (this.add.genres.length == 0) {
        return { "is-danger": this.errors.has("genres") };
      } else if (this.add.genres.length == 2) {
        return "is-success";
      } else {
        return "is-danger";
      }
    }
  }
};
</script>
