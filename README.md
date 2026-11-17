# Smart College of Engineering & Technology - Portal (PR5)

**Web Technology I Lab - Practical 5: Single Page Application (SPA)**

## 1. Overview

This project is a college website built as a **Single Page Application**. The browser loads `index.html` only once. When the user clicks a menu link, JavaScript changes only the content inside `<main id="app">`. The header, navigation bar and footer are created once and stay on the screen.

The site has five sections: **Home, Departments, Faculty, Admissions and Contact**.

## 2. Objectives

- Build a multi-section website inside one HTML file.
- Use hash routing with `location.hash` and the `hashchange` event.
- Load data from JSON files using `fetch()` and `async/await`.
- Show loading and error messages while data is being fetched.
- Validate a form and save data in `localStorage`.
- Make the layout responsive using CSS Grid, Flexbox and media queries.

## 3. Technologies used

- HTML5
- CSS3 (Grid, Flexbox, media queries)
- JavaScript (plain JavaScript, no framework)
- JSON (for data)

No React, Angular, Vue, Bootstrap or Tailwind is used.

## 4. Main features

- Hash routes: `#/home`, `#/departments`, `#/faculty`, `#/admissions`, `#/contact`, `#/departments/comp`
- Route table, active menu highlight, tab title changes for each section
- Departments dropdown in the navigation bar
- Page Not Found view for wrong routes
- Home: welcome section, about, vision and mission, admission notices and five latest notices (newest first) with an *Important* badge
- Departments: six cards, filter, department table (open/close button), course view, total intake 660
- Faculty: six profile cards with individual Show Details controls
- Admissions: eligibility, courses, procedure, admission notices
- Contact: contact details, enquiry form with validation, saved enquiries kept in `localStorage`
- Testing modes: `?demo=slow#/faculty` and `?demo=error#/faculty`

## 5. Folder structure

```
smart-college-portal-pr5/
├── index.html
├── README.md
├── css/
│   └── style.css
├── data/
│   ├── departments.json
│   ├── faculty.json
│   └── notices.json
├── images/
│   └── logo.svg
└── js/
    ├── data.js
    ├── components.js
    ├── router.js
    ├── app.js
    ├── enquiry.js
    └── views/
        ├── home.js
        ├── departments.js
        ├── faculty.js
        ├── admissions.js
        ├── contact.js
        └── notfound.js
```

## 6. Important JavaScript files

| File | What it does |
|------|--------------|
| `data.js` | `loadJson()` fetches a JSON file with `async/await`. The Promise is saved in `dataCache`, so a file is downloaded only once. Also has `showLoading()` and `showError()` (with a Try Again button). |
| `components.js` | Builds the header, navigation, Departments dropdown and footer once. `setActiveNav()` highlights the current link. |
| `router.js` | Has the route table, `matchRoute()`, `handleRoute()` and `startRouter()`. Shows Page Not Found for invalid routes. |
| `app.js` | Starts everything: header, footer and router. |
| `enquiry.js` | `initEnquiryForm(root)` handles validation and saving to `localStorage`. |
| `views/*.js` | One file per view. Each has a `renderXxx(root)` function that fills the `<main>` area. |

Load order in `index.html`: `data.js`, `components.js`, `enquiry.js`, the views, `router.js`, then `app.js`.

## 7. How SPA navigation works

In a normal website every link loads a new HTML file. Here there is only one file, `index.html`. The header and footer are created once by `components.js`. Only the content inside `<main id="app">` is replaced when the user clicks a link, so the page never reloads.

1. A menu link is a hash link like `<a href="#/faculty">`. Clicking it changes the part of the address after `#`, so the browser does not reload.
2. The router listens for the change and finds the matching view in the route table.
3. `<main id="app">` is cleared and the view function draws the new content.
4. The tab title and the active menu link are updated.

## 8. Hash routing

Hash routing means the route is written after `#` in the address, for example `index.html#/departments`.

- `location.hash` gives the current hash (for example `#/faculty`).
- The `hashchange` event runs every time the hash changes. `window.addEventListener("hashchange", handleRoute)` is in `router.js`.
- The **route table** is an array in `router.js`. Each item has a path, a title and the view function, for example `{ path: "/faculty", title: "Faculty", view: renderFaculty }`.
- `matchRoute()` splits the path at `/` and compares it with each route. A part like `:id` in `/departments/:id` matches anything, so `#/departments/comp` gives `id = "comp"`.
- If no route matches, `renderNotFound()` shows the Page Not Found view.
- Back and Forward buttons work because each hash change is saved in the browser history.
- Refreshing or opening a route directly works because `startRouter()` calls `handleRoute()` when the page first loads.

## 9. JSON and fetch()

JSON files in the `data` folder store the notices, departments and faculty. This keeps the data separate from the code, so we can change the data without editing JavaScript.

`fetch("data/faculty.json")` asks the server for the file and gives back a Promise. `response.json()` converts the text into JavaScript arrays and objects. Because `fetch()` needs a server, the project must be run with Live Server or Python (see section 12).

When the data is shown on the page, `textContent` is used instead of `innerHTML`. With `textContent` the text is always plain text, so it can never run as HTML or script.

## 10. async/await and Promise caching

- A **Promise** is an object that stands for a value that will arrive later (for example the downloaded file).
- `async` before a function means the function returns a Promise. `await` waits for a Promise to finish before going to the next line, so the code reads from top to bottom.
- `try ... catch` handles errors. If the download fails, `catch` shows an error message with a **Try Again** button.
- **Promise caching**: in `data.js`, `loadJson()` saves the Promise of each file in the `dataCache` object. If the same file is requested again, the saved Promise is returned and nothing is downloaded again. If a download fails, the saved Promise is deleted so Try Again can fetch it again.
- **Loading and error states**: `showLoading()` shows "Loading..." while waiting, and `showError()` shows the error message and the Try Again button.
- **Demo modes**: `?demo=slow#/faculty` waits 2.5 seconds before the faculty data comes, so the loading message is visible. `?demo=error#/faculty` makes the first download fail, so the error message and Try Again are visible. After Try Again the data loads normally.

## 11. localStorage

`localStorage` is a small storage area inside the browser. Data stays there even after the page is refreshed or the browser is closed.

- Valid enquiries are saved as a list under the key `collegeEnquiries` using `localStorage.setItem()` and `JSON.stringify()`.
- `localStorage.getItem()` and `JSON.parse()` read the list back.
- `initEnquiryForm(root)` in `enquiry.js` runs every time the Contact view is opened. It connects the form events and shows the saved list, so saved enquiries are still visible after going to another section and coming back.
- The data is stored only in your own browser. It is not sent to any server.

Form rules: name at least 3 letters; email must look like `name@example.com`; mobile must be 10 digits starting with 6, 7, 8 or 9; a department must be selected; message must be 10 to 500 characters.

## 12. How to run the project

The project uses `fetch()` to read JSON files, so it **must run through a local server**. Opening `index.html` by double-click (a `file://` address) will not load the data.

### Option A: VS Code Live Server

1. Extract the ZIP file.
2. Open VS Code, choose **File > Open Folder** and select `smart-college-portal-pr5`.
3. Open the Extensions panel (Ctrl+Shift+X), search for **Live Server** by **Ritwick Dey** and click Install.
4. Right-click `index.html` in the Explorer panel.
5. Click **Open with Live Server**.
6. The website opens in the browser (usually `http://127.0.0.1:5500`).

### Option B: Python local server

1. Open a terminal inside the `smart-college-portal-pr5` folder.
2. Run: `python -m http.server 8000` (use `python3` on Mac/Linux).
3. Open `http://localhost:8000` in the browser.
4. Press Ctrl+C in the terminal to stop the server.

## 13. Testing instructions

Check these while the site runs on a local server:

1. Click all five menu links. The content and the tab title change and the active link is highlighted.
2. Click the browser Back and Forward buttons. The correct view appears each time.
3. Press F5 on `#/faculty` or open `#/departments/comp` directly. The same view appears.
4. Type `#/xyz` at the end of the address. Page Not Found appears.
5. Open the Departments dropdown and choose a department.
6. On Departments, use the filter, the table button and the *View Courses* buttons.
7. On Faculty, use *Show Details* on a profile to view or hide its details.
8. Submit the Contact form empty, then with wrong values, then with correct values. Then go to another section and come back.
9. Open `http://localhost:8000/?demo=slow#/faculty` to see the loading message (about 2.5 seconds).
10. Open `http://localhost:8000/?demo=error#/faculty` to see the error message. Click **Try Again** and the data loads (the demo error happens only the first time).
11. Make the browser window narrow (or use the DevTools mobile view) and check the menu button and layout.

To see saved data: DevTools > Application > Local Storage > `collegeEnquiries`.

## 14. Limitations

- Data is static JSON, so there is no real database or login.
- Enquiries are saved only in the user's own browser and are not sent to the college.
- The college name, people, phone and email are sample (made-up) data for the practical.

## 15. Future improvements

- A backend to receive enquiries.
- Search for faculty.
- An admin page to edit notices.


## 16. Conclusion

This project shows how a complete website can run as a Single Page Application using only HTML, CSS, JavaScript and JSON. It covers hash routing, a route table, `fetch()` with `async/await`, Promise caching, loading and error states, form validation and `localStorage`, together with a responsive design.
