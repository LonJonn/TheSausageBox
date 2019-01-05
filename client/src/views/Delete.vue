<template>
  <div>
    <BulmaHeader
      title="What's on the Sausage Box?! 🤔"
      v-bind:subtitle="['Here lies the info you be requesting!']"
    />

    <section id="content" class="section">
      <div class="container column is-8">
        <h1 class="title">Used</h1>
        <h2 class="subtitle">{{ storageInfo.size }} GB out of 32 GB</h2>
        <div class="columns">
          <div class="column is-11">
            <span v-if="storageInfo.percentage >= 80">
              <progress
                class="progress is-large is-danger"
                :value="storageInfo.percentage"
                max="100"
              ></progress>
            </span>
            <span v-else-if="storageInfo.percentage >= 60">
              <progress
                class="progress is-large is-warning"
                :value="storageInfo.percentage"
                max="100"
              ></progress>
            </span>
            <span v-else>
              <progress
                class="progress is-large is-success"
                :value="storageInfo.percentage"
                max="100"
              ></progress>
            </span>
          </div>
          <div class="column">
            <h1 class="subtitle">{{ storageInfo.percentage }}%</h1>
          </div>
        </div>

        <br>
        <br>
        <h1 class="title">Delete</h1>
        <b-table
          :data="movies"
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
            <b-table-column field="size" label="Size" centered sortable>{{ props.row.size }} MB</b-table-column>
            <b-table-column field="filename" label="Action" centered>
              <a @click="deleteMovie(props.row.filename)" class="button is-danger">Delete</a>
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
import swal from "sweetalert2";
import BulmaHeader from "@/components/BulmaHeader.vue";
import MoviesService from "@/services/MoviesService.js";

export default {
  name: "Delete",
  components: {
    BulmaHeader
  },
  data() {
    return {
      loading: true,
      movies: [],
      storageInfo: {
        size: 0,
        percentage: 0
      }
    };
  },
  mounted() {
    this.getStorageInfo();
  },
  methods: {
    async getStorageInfo() {
      this.loading = true;
      const [moviesResponse, InfoResponse] = await Promise.all([
        MoviesService.getMovies(),
        MoviesService.getStorageInfo()
      ]);
      this.movies = moviesResponse.data;
      this.storageInfo = InfoResponse.data;
      this.loading = false;
    },
    deleteMovie(file) {
      const $this = this;
      swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74c3c",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      }).then(async function(result) {
        if (result.value) {
          await MoviesService.deleteMovie(file);
          $this.$snackbar.open("File Deleted!");
          $this.getStorageInfo();
        }
      });
    }
  }
};
</script>
