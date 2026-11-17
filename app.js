// Starts the application.
document.addEventListener("DOMContentLoaded", function () {
  renderHeader(document.getElementById("site-header"));
  renderFooter(document.getElementById("site-footer"));
  startRouter();
});
