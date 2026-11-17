// Home view: banner, about, vision & mission and latest notices.
function renderHome(root) {
  root.innerHTML = `
    <section class="welcome">
      <img src="images/logo.svg" alt="Smart College logo" class="welcome-logo">
      <div>
        <h1>Welcome to Smart College of Engineering &amp; Technology</h1>
        <p class="tagline">Learn. Innovate. Lead.</p>
        <p>We are an engineering college with six departments. Read about our <a href="#/departments">departments</a> or see how to apply in <a href="#/admissions">Admissions</a>.</p>
      </div>
    </section>

    <section class="section">
      <h2>About the College</h2>
      <p>Smart College of Engineering &amp; Technology offers undergraduate and postgraduate engineering programmes through six departments. Students learn through classroom teaching, laboratory practicals, projects and industry visits. Our <a href="#/faculty">experienced faculty</a> guide students at every step.</p>
    </section>

    <section class="section two-columns">
      <div class="card">
        <h2>Our Vision</h2>
        <p>To be a trusted centre of engineering education that produces skilled, creative and responsible professionals.</p>
      </div>
      <div class="card">
        <h2>Our Mission</h2>
        <ul>
          <li>Give quality technical education with strong fundamentals.</li>
          <li>Encourage projects, research and innovation.</li>
          <li>Build teamwork, ethics and communication skills.</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <h2>Important Admission Notices</h2>
      <div class="notice-box admission-notices"></div>
    </section>

    <section class="section">
      <h2>Latest Notices</h2>
      <div class="notice-box latest-notices"></div>
    </section>
  `;

  showNotices(root.querySelector(".admission-notices"), true);
  showNotices(root.querySelector(".latest-notices"), false);
}

async function showNotices(box, admissionOnly) {
  showLoading(box, admissionOnly ? "Loading admission notices..." : "Loading notices...");
  try {
    const notices = await loadJson("notices");
    if (!box.isConnected) {
      return; // user already moved to another view
    }

    // newest first, show only five
    let displayedNotices = notices
      .slice()
      .sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

    if (admissionOnly) {
      displayedNotices = displayedNotices.filter(function (notice) {
        return notice.category === "Admission";
      });
    } else {
      displayedNotices = displayedNotices.slice(0, 5);
    }

    const list = makeElement("ul", "", "notice-list");
    displayedNotices.forEach(function (notice) {
      list.appendChild(makeNoticeItem(notice));
    });
    box.textContent = "";
    box.appendChild(list);
  } catch (error) {
    if (box.isConnected) {
      showError(box, "Sorry, notices could not be loaded. " + error.message, function () {
        showNotices(box, admissionOnly);
      });
    }
  }
}

function makeNoticeItem(notice) {
  const item = makeElement("li", "", "notice-item");
  if (notice.important) {
    item.classList.add("important");
  }

  const date = new Date(notice.date + "T00:00:00");
  const dateText = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const top = makeElement("div", "", "notice-top");
  top.appendChild(makeElement("span", dateText, "notice-date"));
  top.appendChild(makeElement("span", notice.category, "notice-category"));
  if (notice.important) {
    top.appendChild(makeElement("span", "Important", "badge"));
  }

  const link = makeElement(
    "a",
    notice.category === "Admission" ? "View admission details →" : "View section →",
    "notice-link"
  );
  link.href = "#/" + notice.section;

  item.appendChild(top);
  item.appendChild(makeElement("p", notice.title, "notice-title"));
  item.appendChild(link);
  return item;
}
