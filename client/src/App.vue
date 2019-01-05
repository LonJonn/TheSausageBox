<template>
  <div id="app">
    <nav class="navbar is-fixed-top">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="@/assets/logo.png" height="28">
        </router-link>
        <a role="button" class="navbar-burger burger" data-target="navbarData">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarData" class="navbar-menu">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">Home</router-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navhide navbar-link">Sites</a>
            <div class="navbar-dropdown">
              <a target="_blank" href="https://ololo.to/" class="navbar-item">Ololo</a>
              <a target="_blank" href="https://www.moviesjoy.net/" class="navbar-item">MoviesJoy</a>
              <a target="_blank" href="https://azmovies.xyz/" class="navbar-item">AZMovies</a>
              <a
                target="_blank"
                href="https://github.com/Igglybuff/awesome-piracy#open-directories"
                class="navbar-item"
              >GitHub List</a>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navhide navbar-link">More</a>
            <div class="navbar-dropdown">
              <a class="about navbar-item">About</a>
              <a
                target="_blank"
                href="https://github.com/LonJonn/TheSausageBox/issues"
                class="navbar-item"
              >Report an issue</a>
              <hr class="navbar-divider">
              <span class="navbar-item">Version 1.0! 🎉</span>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <router-link to="/add" class="button is-primary">
                <strong>Add Movie</strong>
              </router-link>
              <router-link to="/delete" class="button is-light">Delete Movie</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="scss">
.dropdown-select {
  width: 100%;

  .dropdown-trigger {
    width: 100%;

    button {
      width: 100%;
      text-align: start;
    }
  }
}
</style>