// Departments view: cards, filter, department table and course view.
async function renderDepartments(root, params) {
  root.innerHTML = `
    <section class="page-head">
      <h1>Departments</h1>
      <p>Six departments offering B.Tech and postgraduate programmes.</p>
    </section>
    <div class="dept-content"></div>
  `;

  const box = root.querySelector(".dept-content");
  showLoading(box, "Loading departments...");

  let departments;
  try {
    departments = await loadJson("departments");
  } catch (error) {
    if (box.isConnected) {
      showError(box, "Sorry, department data could not be loaded. " + error.message, function () {
        renderDepartments(root, params);
      });
    }
    return;
  }
  if (!box.isConnected) {
    return;
  }

  // route like #/departments/comp shows only that department
  const selectedId = params.id || "all";
  if (selectedId !== "all" && !departments.some(function (d) { return d.id === selectedId; })) {
    root.textContent = "";
    document.title = "Page Not Found | " + COLLEGE_NAME;
    renderNotFound(root, "/departments/" + selectedId);
    return;
  }

  box.innerHTML = `
    <div class="toolbar">
      <label for="deptFilter">Filter by department:</label>
      <select id="deptFilter"></select>
      
    </div>
    <p class="info-bar" id="intakeInfo"></p>
   
    <div class="card-grid" id="deptCards"></div>
  `;

  const filter = box.querySelector("#deptFilter");
  
  const cardsBox = box.querySelector("#deptCards");

  // fill the filter options
  const allOption = makeElement("option", "All Departments");
  allOption.value = "all";
  filter.appendChild(allOption);
  departments.forEach(function (dept) {
    const option = makeElement("option", dept.name);
    option.value = dept.id;
    filter.appendChild(option);
  });
  filter.value = selectedId;

  // total intake of all departments
  let totalIntake = 0;
  departments.forEach(function (dept) {
    totalIntake += dept.intake;
  });
  box.querySelector("#intakeInfo").textContent =
    "Total student intake: " + totalIntake + " seats across " + departments.length + " departments";

  
  function showCards() {
    cardsBox.textContent = "";
    const chosen = filter.value;
    departments.forEach(function (dept) {
      if (chosen === "all" || chosen === dept.id) {
        // courses are open by default when only one department is shown
        cardsBox.appendChild(buildDepartmentCard(dept, chosen !== "all"));
      }
    });
  }

  filter.addEventListener("change", showCards);

  tableBtn.addEventListener("click", function () {
    const isHidden = tableBox.hidden;
    
    tableBtn.textContent = isHidden ? "Hide Department Table" : "Show Department Table";
    tableBtn.setAttribute("aria-expanded", isHidden);
  });

  
}

function buildDepartmentCard(dept, showCourses) {
  const card = makeElement("article", "", "card dept-card");
  card.id = "dept-" + dept.id;

  card.appendChild(makeElement("h3", dept.name));
  card.appendChild(makeElement("p", "Code: " + dept.code + " | Intake: " + dept.intake + " seats", "meta"));
  card.appendChild(makeElement("p", dept.description));
  card.appendChild(makeElement("p", "Head of Department: " + dept.hod, "meta"));

  const courseList = makeElement("ul", "", "course-list");
  dept.courses.forEach(function (course) {
    courseList.appendChild(makeElement("li", course));
  });
  courseList.hidden = !showCourses;

  const button = makeElement("button", showCourses ? "Hide Courses" : "View Courses", "btn btn-small");
  button.type = "button";
  button.setAttribute("aria-expanded", showCourses);
  button.addEventListener("click", function () {
    courseList.hidden = !courseList.hidden;
    button.textContent = courseList.hidden ? "View Courses" : "Hide Courses";
    button.setAttribute("aria-expanded", !courseList.hidden);
  });

  card.appendChild(button);
  card.appendChild(courseList);
  return card;
}

