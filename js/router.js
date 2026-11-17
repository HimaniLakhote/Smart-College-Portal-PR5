// Hash router: reads location.hash and shows the matching view inside <main id="app">.

// route table: path pattern, title and the view function
const routes = [
  { path: "/home", title: "Home", view: renderHome },
  { path: "/departments", title: "Departments", view: renderDepartments },
  { path: "/departments/:id", title: "Departments", view: renderDepartments },
  { path: "/faculty", title: "Faculty", view: renderFaculty },
  { path: "/admissions", title: "Admissions", view: renderAdmissions },
  { path: "/contact", title: "Contact", view: renderContact }
];

function getCurrentPath() {
  let path = location.hash.slice(1); // remove the #
  if (path === "") {
    return "/home";
  }
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}

// compare the path with each route, ":id" parts are saved in params
function matchRoute(path) {
  const pathParts = path.split("/");

  for (const route of routes) {
    const routeParts = route.path.split("/");
    if (routeParts.length !== pathParts.length) {
      continue;
    }

    const params = {};
    let matched = true;
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        params[routeParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (routeParts[i] !== pathParts[i]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      return { route: route, params: params };
    }
  }
  return null;
}

function handleRoute() {
  const app = document.getElementById("app");
  const path = getCurrentPath();

  let found = null;
  try {
    found = matchRoute(path);
  } catch (error) {
    found = null; // bad encoding in the URL, treat as not found
  }

  app.textContent = ""; // clear the old view
  closeMenus();
  setActiveNav(path);

  if (found) {
    document.title = found.route.title + " | " + COLLEGE_NAME;
    found.route.view(app, found.params);
  } else {
    document.title = "Page Not Found | " + COLLEGE_NAME;
    renderNotFound(app, path);
  }
  window.scrollTo(0, 0);
}

function startRouter() {
  window.addEventListener("hashchange", handleRoute);
  if (location.hash === "") {
    history.replaceState(null, "", "#/home"); // show #/home in the address bar
  }
  handleRoute(); // show the right view on first load or refresh
}
