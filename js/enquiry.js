// Enquiry form: validation and localStorage.
const ENQUIRY_KEY = "collegeEnquiries";

function getSavedEnquiries() {
  try {
    const list = JSON.parse(localStorage.getItem(ENQUIRY_KEY));
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

function saveEnquiries(list) {
  try {
    localStorage.setItem(ENQUIRY_KEY, JSON.stringify(list));
    return true;
  } catch (error) {
    return false; // storage blocked or full
  }
}

// returns an error message, or "" when the value is fine
function validateField(fieldName, value) {
  value = value.trim();

  if (fieldName === "name") {
    if (value === "") return "Please enter your name.";
    if (!/^[A-Za-z][A-Za-z .'-]{2,}$/.test(value)) return "Name must have at least 3 letters (letters and spaces only).";
  }
  if (fieldName === "email") {
    if (value === "") return "Please enter your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Enter a valid email like name@example.com.";
  }
  if (fieldName === "mobile") {
    if (value === "") return "Please enter your mobile number.";
    if (!/^[6-9]\d{9}$/.test(value)) return "Mobile number must be 10 digits and start with 6, 7, 8 or 9.";
  }
  if (fieldName === "department") {
    if (value === "") return "Please select a department.";
  }
  if (fieldName === "message") {
    if (value === "") return "Please write your enquiry.";
    if (value.length < 10) return "Message must be at least 10 characters.";
    if (value.length > 500) return "Message must not be more than 500 characters.";
  }
  return "";
}

// Works every time the Contact view is shown, because it only uses elements inside root
function initEnquiryForm(root) {
  const form = root.querySelector("#enquiryForm");
  const status = root.querySelector("#formStatus");
  const savedBox = root.querySelector("#savedEnquiries");
  const fieldNames = ["name", "email", "mobile", "department", "message"];

  function showFieldError(fieldName) {
    const field = form.elements[fieldName];
    const message = validateField(fieldName, field.value);
    root.querySelector('[data-error-for="' + fieldName + '"]').textContent = message;
    field.classList.toggle("invalid", message !== "");
    field.setAttribute("aria-invalid", message !== "");
    return message === "";
  }

  // check a field when the user leaves it, and clear the error while typing
  fieldNames.forEach(function (fieldName) {
    const field = form.elements[fieldName];
    field.addEventListener("blur", function () {
      showFieldError(fieldName);
    });
    field.addEventListener("input", function () {
      if (field.classList.contains("invalid")) {
        showFieldError(fieldName);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    let formIsValid = true;
    let firstInvalid = null;
    fieldNames.forEach(function (fieldName) {
      if (!showFieldError(fieldName)) {
        formIsValid = false;
        if (!firstInvalid) firstInvalid = form.elements[fieldName];
      }
    });

    if (!formIsValid) {
      status.textContent = "Please correct the errors shown above.";
      status.classList.add("status-error");
      firstInvalid.focus();
      return;
    }

    const enquiry = {
      id: Date.now(),
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      mobile: form.elements.mobile.value.trim(),
      department: form.elements.department.value,
      message: form.elements.message.value.trim(),
      savedOn: new Date().toLocaleString("en-IN")
    };

    const list = getSavedEnquiries();
    list.unshift(enquiry); // newest first
    if (saveEnquiries(list)) {
      form.reset();
      status.textContent = "Thank you! Your enquiry has been saved.";
      status.classList.add("status-ok");
      showSavedEnquiries();
    } else {
      status.textContent = "Could not save the enquiry. Browser storage may be blocked.";
      status.classList.add("status-error");
    }
  });

  function showSavedEnquiries() {
    const list = getSavedEnquiries();
    savedBox.textContent = "";

    if (list.length === 0) {
      savedBox.appendChild(makeElement("p", "No enquiries saved yet.", "empty-text"));
      return;
    }

    const clearButton = makeElement("button", "Clear All", "btn btn-light btn-small");
    clearButton.type = "button";
    clearButton.addEventListener("click", function () {
      if (confirm("Delete all saved enquiries?")) {
        saveEnquiries([]);
        showSavedEnquiries();
      }
    });
    savedBox.appendChild(makeElement("p", "Total saved enquiries: " + list.length, "info-bar"));

    const items = makeElement("div", "", "saved-list");
    list.forEach(function (enquiry) {
      items.appendChild(buildSavedItem(enquiry));
    });
    savedBox.appendChild(items);
    savedBox.appendChild(clearButton);
  }

  function buildSavedItem(enquiry) {
    const item = makeElement("article", "", "card saved-item");
    item.appendChild(makeElement("h3", enquiry.name));
    item.appendChild(makeElement("p", enquiry.email + " | " + enquiry.mobile, "meta"));
    item.appendChild(makeElement("p", "Department: " + enquiry.department, "meta"));
    item.appendChild(makeElement("p", enquiry.message));
    item.appendChild(makeElement("p", "Saved on " + enquiry.savedOn, "meta"));

    const deleteButton = makeElement("button", "Delete", "btn btn-light btn-small");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", function () {
      const remaining = getSavedEnquiries().filter(function (e) {
        return e.id !== enquiry.id;
      });
      saveEnquiries(remaining);
      showSavedEnquiries();
    });
    item.appendChild(deleteButton);
    return item;
  }

  showSavedEnquiries(); // show old enquiries whenever the view opens
}
