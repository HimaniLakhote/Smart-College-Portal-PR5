// Page Not Found view for invalid routes.
function renderNotFound(root, path) {
  root.innerHTML = `
    <section class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, we could not find the page <strong class="bad-path"></strong>.</p>
      <p><a class="btn" href="#/home">Go to Home</a></p>
    </section>
  `;
  root.querySelector(".bad-path").textContent = "#" + path;
}
