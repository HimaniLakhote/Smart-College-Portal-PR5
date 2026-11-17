// Contact view: college contact details and the enquiry form.
function renderContact(root) {
  root.innerHTML = `
    <section class="page-head">
      <h1>Contact Us</h1>
      <p>Write to us and our admission office will reply soon.</p>
    </section>

    <section class="section two-columns">
      <div class="card">
        <h2>College Contact Details</h2>
        <p><strong>Address:</strong><br>Smart College of Engineering &amp; Technology,<br>Knowledge Park, Pune, Maharashtra 411001</p>
        <p><strong>Phone:</strong> +91 20 1234 5678</p>
        <p><strong>Email:</strong> admissions@smartcollege.example</p>
        <p><strong>Office hours:</strong> Monday to Saturday, 9:30 AM to 5:00 PM</p>
        <p>Looking for admission details? Visit the <a href="#/admissions">Admissions</a> page.</p>
      </div>

      <div class="card">
        <h2>Student Enquiry Form</h2>
        <form id="enquiryForm" novalidate>
          <div class="form-row">
            <label for="name">Full Name *</label>
            <input type="text" id="name" name="name" autocomplete="name">
            <span class="error-msg" data-error-for="name"></span>
          </div>
          <div class="form-row">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" autocomplete="email">
            <span class="error-msg" data-error-for="email"></span>
          </div>
          <div class="form-row">
            <label for="mobile">Mobile Number *</label>
            <input type="tel" id="mobile" name="mobile" maxlength="10" autocomplete="tel" placeholder="10 digit number">
            <span class="error-msg" data-error-for="mobile"></span>
          </div>
          <div class="form-row">
            <label for="department">Department *</label>
            <select id="department" name="department" disabled>
              <option value="">-- Select department --</option>
            </select>
            <span class="error-msg" data-error-for="department"></span>
            <div id="departmentLoadStatus" aria-live="polite"></div>
          </div>
          <div class="form-row">
            <label for="message">Enquiry Message *</label>
            <textarea id="message" name="message" rows="4"></textarea>
            <span class="error-msg" data-error-for="message"></span>
          </div>
          <button type="submit" class="btn">Submit Enquiry</button>
          <p class="form-status" id="formStatus" role="status"></p>
        </form>
      </div>
    </section>

    <section class="section">
      <h2>Saved Enquiries</h2>
      <div id="savedEnquiries"></div>
    </section>
  `;

  fillDepartmentOptions(
    root.querySelector("#department"),
    root.querySelector("#departmentLoadStatus")
  );
  initEnquiryForm(root);
}

// department options come from departments.json
async function fillDepartmentOptions(select, statusBox) {
  try {
    const departments = await loadJson("departments");
    if (!select.isConnected) {
      return;
    }

    departments.forEach(function (dept) {
      const option = makeElement("option", dept.name);
      option.value = dept.name;
      select.appendChild(option);
    });
    select.disabled = false;
    statusBox.textContent = "";
  } catch (error) {
    if (select.isConnected) {
      showError(
        statusBox,
        "Sorry, department options could not be loaded. " + error.message,
        function () {
          fillDepartmentOptions(select, statusBox);
        }
      );
    }
  }
}
