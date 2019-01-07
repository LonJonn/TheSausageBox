<template>
  <div>
    <BulmaHeader
      title="The Sausage Box! 🌭"
      v-bind:subtitle="['A movie database for the fam,',
    'full of HD flicks!']"
    />

    <section id="content" class="section">
      <div class="container">
        <div id="search" class="columns">
          <b-field class="column is-7" label="Search">
            <b-input v-model="search.title" placeholder="Eg. Big Hero 6" icon="magnify"/>
          </b-field>
          <b-field class="column" label="Quality">
            <b-dropdown class="dropdown-select" v-model="search.quality">
              <button class="select button" slot="trigger">{{ search.quality }}</button>
              <b-dropdown-item
                v-for="quality in qualityOptions"
                :value="quality"
                :key="quality"
              >{{ quality }}</b-dropdown-item>
            </b-dropdown>
          </b-field>
          <b-field class="column" label="Genre">
            <b-dropdown class="dropdown-select" v-model="search.genre">
              <button class="select button" slot="trigger">{{ search.genre }}</button>
              <b-dropdown-item v-for="genre in genreOptions" :value="genre" :key="genre">{{ genre }}</b-dropdown-item>
            </b-dropdown>
          </b-field>
          <b-field class="column" label="Reset">
            <a @click="clearSearch" class="button is-danger">Clear</a>
          </b-field>
        </div>

        <b-table
          :data="filter"
          :hoverable="true"
          :loading="loading"
          :mobile-cards="true"
          :striped="true"
        >
          <template slot-scope="props">
            <b-table-column field="format" label="Format" width="20" centered sortable>
              <span class="tag is-info is-rounded">{{ props.row.format }}</span>
            </b-table-column>
            <b-table-column field="title" label="Title" sortable>
              <b>{{ props.row.title }}</b>
            </b-table-column>
            <b-table-column field="quality" label="Quality" centered sortable>
              <span class="tag is-warning">{{ props.row.quality }}</span>
            </b-table-column>
            <b-table-column field="year" label="Year" centered sortable>{{ props.row.year }}</b-table-column>
            <b-table-column
              field="duration"
              label="Duration"
              centered
              sortable
            >{{ props.row.duration }}</b-table-column>
            <b-table-column
              field="genre"
              label="Genre"
              centered
              sortable
            >{{ props.row.genre[0] }}, {{ props.row.genre[1] }}</b-table-column>
            <b-table-column field="filename" label="Link" centered>
              <a
                :href="'http://localhost:4000/movies/'+props.row.filename"
                class="button is-success"
              >Play</a>
            </b-table-column>
          </template>

          <template slot="empty">
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>
                  <b-icon icon="emoticon-sad" size="is-large"></b-icon>
                </p>
                <p>Nothing here.</p>
              </div>
            </section>
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>

<script>
import BulmaHeader from "@/components/BulmaHeader.vue";
import MoviesService from "@/services/MoviesService.js";

export default {
  name: "Index",
  components: {
    BulmaHeader
  },
  data() {
    return {
      loading: true,
      qualityOptions: ["Any", "480p", "720p", "1080p"],
      genreOptions: [
        "Any",
        "Action",
        "Adventure",
        "Animation",
        "Drama",
        "Comedy",
        "Horror",
        "Thriller"
      ],
      movies: [],
      search: {
        title: "",
        genre: "Any",
        quality: "Any"
      }
    };
  },
  async mounted() {
    const response = await MoviesService.getMovies();
    this.movies = response.data;
    this.loading = false;
  },
  methods: {
    clearSearch() {
      this.search.title = "";
      this.search.genre = "Any";
      this.search.quality = "Any";
    }
  },
  computed: {
    filter() {
      var search = new RegExp(this.search.title, "i");
      var filtered = [];
      for (var i in this.movies) {
        if (
          this.movies[i].title.match(search) &&
          (this.movies[i].genre.includes(this.search.genre) ||
            this.search.genre === "Any") &&
          (this.movies[i].quality.includes(this.search.quality) ||
            this.search.quality === "Any")
        ) {
          filtered.push(this.movies[i]);
        }
      }
      return filtered;
    }
  }
};
</script>
