// Loads JSON files with fetch(). Each file is downloaded only once.
const dataCache = {};
let demoErrorShown = false;

function getDemoMode() {
  return new URLSearchParams(location.search).get("demo");
}

function wait(milliseconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, milliseconds);
  });
}

// name is the JSON file name without .json, e.g. "faculty"
function loadJson(name) {
  if (dataCache[name]) {
    return dataCache[name]; // already loaded (or loading), reuse the same Promise
  }
  dataCache[name] = fetchJson(name).catch(function (error) {
    delete dataCache[name]; // do not cache failures, so Try Again can work
    throw error;
  });
  return dataCache[name];
}

async function fetchJson(name) {
  const demo = getDemoMode();

  // testing modes: ?demo=slow#/faculty and ?demo=error#/faculty
  if (name === "faculty" && demo === "slow") {
    await wait(2500);
  }
  if (name === "faculty" && demo === "error" && !demoErrorShown) {
    demoErrorShown = true; // fails once, so Try Again works afterwards
    throw new Error("Demo error: faculty data could not be loaded.");
  }

  const response = await fetch("data/" + name + ".json");
  if (!response.ok) {
    throw new Error("Could not load " + name + ".json (status " + response.status + ")");
  }
  return await response.json();
}

function showLoading(box, message) {
  box.textContent = "";
  const p = document.createElement("p");
  p.className = "loading";
  p.textContent = message;
  box.appendChild(p);
}

function showError(box, message, retryFunction) {
  box.textContent = "";
  const wrapper = document.createElement("div");
  wrapper.className = "error-box";

  const p = document.createElement("p");
  p.textContent = message;
  wrapper.appendChild(p);

  if (retryFunction) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn";
    button.textContent = "Try Again";
    button.addEventListener("click", retryFunction);
    wrapper.appendChild(button);
  }
  box.appendChild(wrapper);
}
