// Common parts of the page: header, navigation, dropdown and footer.
// They are created once when the site starts.

const COLLEGE_NAME = "Smart College of Engineering & Technology";
const COLLEGE_TAGLINE = "Learn. Innovate. Lead.";

const navItems = [
  { label: "Home", path: "/home" },
  { label: "Departments", path: "/departments", dropdown: true },
  { label: "Faculty", path: "/faculty" },
  { label: "Admissions", path: "/admissions" },
  { label: "Contact", path: "/contact" }
];

// small helper to create an element with text (textContent is safe)
function makeElement(tag, text, className) {
  const element = document.createElement(tag);
  if (text) {
    element.textContent = text;
  }
  if (className) {
    element.className = className;
  }
  return element;
}

function renderHeader(headerBox) {
  const inner = makeElement("div", "", "header-inner");

  // logo, name and tagline
  const brand = makeElement("a", "", "brand");
  brand.href = "#/home";
  const logo = document.createElement("img");
  logo.src = "images/logo.svg";
  logo.alt = "Smart College logo";
  const brandText = makeElement("div", "", "brand-text");
  brandText.appendChild(makeElement("span", COLLEGE_NAME, "brand-name"));
  brandText.appendChild(makeElement("span", COLLEGE_TAGLINE, "brand-tagline"));
  brand.appendChild(logo);
  brand.appendChild(brandText);

  // button for the small-screen menu
  const menuButton = makeElement("button", "☰ Menu", "menu-toggle");
  menuButton.type = "button";
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.addEventListener("click", function () {
    const nav = document.getElementById("main-nav");
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", isOpen);
  });

  // navigation links
  const nav = makeElement("nav", "", "main-nav");
  nav.id = "main-nav";
  const list = makeElement("ul", "", "nav-list");

  navItems.forEach(function (item) {
    const listItem = makeElement("li", "", item.dropdown ? "dropdown" : "");
    const link = makeElement("a", item.label, "nav-link");
    link.href = "#" + item.path;
    link.dataset.path = item.path;
    listItem.appendChild(link);

    if (item.dropdown) {
      const toggle = makeElement("button", "▾", "dropdown-toggle");
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Show department links");
      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", function (event) {
        event.stopPropagation();
        listItem.classList.remove("force-closed");
        const isOpen = listItem.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen);
      });

      const menu = makeElement("ul", "", "dropdown-menu");
      const allItem = makeElement("li");
      const allLink = makeElement("a", "All Departments");
      allLink.href = "#/departments";
      allItem.appendChild(allLink);
      menu.appendChild(allItem);

      listItem.appendChild(toggle);
      listItem.appendChild(menu);
      fillDropdown(menu);
    }
    list.appendChild(listItem);
  });
  nav.appendChild(list);

  inner.appendChild(brand);
  inner.appendChild(menuButton);
  inner.appendChild(nav);
  headerBox.appendChild(inner);

  // close menus when clicking outside or pressing Escape
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown") && !event.target.closest(".menu-toggle")) {
      closeMenus();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenus();
    }
  });
}

// department links in the dropdown come from departments.json
async function fillDropdown(menu) {
  try {
    const departments = await loadJson("departments");
    departments.forEach(function (dept) {
      const item = makeElement("li");
      const link = makeElement("a", dept.name);
      link.href = "#/departments/" + dept.id;
      item.appendChild(link);
      menu.appendChild(item);
    });
  } catch (error) {
    console.log("Dropdown could not load departments:", error.message);
  }
}

function closeMenus() {
  const dropdown = document.querySelector(".dropdown");
  if (dropdown) {
    dropdown.classList.remove("open");
    dropdown.classList.add("force-closed"); // stays closed until the mouse leaves
    dropdown.addEventListener("mouseleave", function () {
      dropdown.classList.remove("force-closed");
    }, { once: true });
    dropdown.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
  }
  const nav = document.getElementById("main-nav");
  if (nav) {
    nav.classList.remove("open");
  }
  const menuButton = document.querySelector(".menu-toggle");
  if (menuButton) {
    menuButton.setAttribute("aria-expanded", "false");
  }
}

// highlight the link of the current section
function setActiveNav(path) {
  const links = document.querySelectorAll(".nav-link");
  links.forEach(function (link) {
    const section = link.dataset.path;
    const isActive = path === section || path.indexOf(section + "/") === 0;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function renderFooter(footerBox) {
  const inner = makeElement("div", "", "footer-inner");

  const about = makeElement("div");
  about.appendChild(makeElement("h3", COLLEGE_NAME));
  about.appendChild(makeElement("p", "Knowledge Park, Pune, Maharashtra 411001"));
  about.appendChild(makeElement("p", "Phone: +91 20 1234 5678"));

  const links = makeElement("div");
  links.appendChild(makeElement("h3", "Quick Links"));
  navItems.forEach(function (item) {
    const link = makeElement("a", item.label);
    link.href = "#" + item.path;
    links.appendChild(link);
  });

  inner.appendChild(about);
  inner.appendChild(links);

  const copy = makeElement("p", "© 2026 " + COLLEGE_NAME + ". Web Technology I Lab - PR5.", "copyright");
  footerBox.appendChild(inner);
  footerBox.appendChild(copy);
}
