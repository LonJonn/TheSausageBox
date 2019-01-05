import Swal from 'sweetalert2'
import $ from 'jquery'

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