// Admissions view: information, eligibility, courses, procedure and notices.
function renderAdmissions(root) {
  root.innerHTML = `
    <section class="page-head">
      <h1>Admissions 2027-28</h1>
      <p>Admissions are based on entrance exam scores and the state counselling process.</p>
    </section>

    <section class="section two-columns">
      <div class="card">
        <h2>Eligibility</h2>
        <ul>
          <li>Passed 12th standard with Physics and Mathematics along with Chemistry, Biology or a technical subject.</li>
          <li>At least 50% marks in these subjects (45% for reserved categories).</li>
          <li>A valid score in a recognised engineering entrance exam such as MHT-CET or JEE Main.</li>
          <li>For M.Tech: a B.Tech/B.E. degree in a related branch with a valid GATE or university test score.</li>
        </ul>
      </div>
      <div class="card">
        <h2>Available Courses</h2>
        <p>We offer B.Tech programmes in Computer Engineering, Artificial Intelligence &amp; Data Science, Information Technology, Electronics &amp; Telecommunication, Mechanical Engineering and Civil Engineering, plus selected M.Tech programmes.</p>
        <p>See course details and seats in the <a href="#/departments">Departments</a> section.</p>
      </div>
    </section>

    <section class="section">
      <h2>Admission Procedure</h2>
      <ol class="steps">
        <li>Appear for the entrance exam and keep your scorecard ready.</li>
        <li>Register online and fill the application form.</li>
        <li>Upload the required documents (mark sheets, score card, ID proof, photograph).</li>
        <li>Check the merit list and take part in the counselling rounds.</li>
        <li>Visit the college for document verification.</li>
        <li>Pay the fees and confirm your admission.</li>
      </ol>
      <p>Have a question? Send us an enquiry from the <a href="#/contact">Contact</a> page or meet the <a href="#/faculty">faculty</a> during office hours.</p>
    </section>

    <section class="section">
      <h2>Important Admission Notices</h2>
      <div class="notice-box"></div>
    </section>
  `;

  showAdmissionNotices(root.querySelector(".notice-box"));
}

async function showAdmissionNotices(box) {
  showLoading(box, "Loading admission notices...");
  try {
    const notices = await loadJson("notices");
    if (!box.isConnected) {
      return;
    }

    const admissionNotices = notices
      .filter(function (notice) {
        return notice.category === "Admission";
      })
      .sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

    const list = makeElement("ul", "", "notice-list");
    admissionNotices.forEach(function (notice) {
      list.appendChild(makeNoticeItem(notice)); // same notice layout as the Home view
    });
    box.textContent = "";
    box.appendChild(list);
  } catch (error) {
    if (box.isConnected) {
      showError(box, "Sorry, notices could not be loaded. " + error.message, function () {
        showAdmissionNotices(box);
      });
    }
  }
}
