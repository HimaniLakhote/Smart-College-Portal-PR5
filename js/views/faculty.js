// Faculty view: profile cards with expandable details.
async function renderFaculty(root) {
  root.innerHTML = `
    <section class="page-head">
      <h1>Our Faculty</h1>
      <p>Meet the teachers and heads of our departments.</p>
    </section>
    <div class="faculty-content"></div>
  `;
  loadFacultyData(root.querySelector(".faculty-content"));
}

async function loadFacultyData(box) {
  showLoading(box, "Loading faculty profiles...");
  try {
    const faculty = await loadJson("faculty");
    if (!box.isConnected) {
      return;
    }
    showFaculty(box, faculty);
  } catch (error) {
    if (box.isConnected) {
      showError(box, "Sorry, faculty data could not be loaded. " + error.message, function () {
        loadFacultyData(box);
      });
    }
  }
}

function showFaculty(box, faculty) {
  box.innerHTML = `
    <div class="card-grid" id="facultyCards"></div>
  `;

  const cardsBox = box.querySelector("#facultyCards");

  faculty.forEach(function (person) {
    cardsBox.appendChild(buildFacultyCard(person));
  });
}

function buildFacultyCard(person) {
  const card = makeElement("article", "", "card faculty-card");
  card.appendChild(makeElement("h3", person.name));
  card.appendChild(makeElement("p", person.designation, "designation"));
  card.appendChild(makeElement("p", person.department, "meta"));

  const details = makeElement("div", "", "details");
  details.appendChild(makeElement("p", "Qualification: " + person.qualification));
  details.appendChild(makeElement("p", "Experience: " + person.experience + " years"));
  details.appendChild(makeElement("p", "Subjects: " + person.subjects.join(", ")));
  details.appendChild(makeElement("p", "Email: " + person.email));
  details.hidden = true;

  const button = makeElement("button", "Show Details", "btn btn-small toggle-btn");
  button.type = "button";
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", function () {
    setProfile(card, details.hidden);
  });

  card.appendChild(button);
  card.appendChild(details);
  return card;
}

// open or close one profile card
function setProfile(card, open) {
  const details = card.querySelector(".details");
  const button = card.querySelector(".toggle-btn");
  details.hidden = !open;
  button.textContent = open ? "Hide Details" : "Show Details";
  button.setAttribute("aria-expanded", open);
}
