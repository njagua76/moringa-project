// Setup & Global State

const scheduleList = document.getElementById("scheduleList");
const pickupForm = document.getElementById("pickupForm");

const API_BASE = "http://localhost:3000"; // json-server base URL

// Handle Pickup Form Submit (POST)
pickupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const urgency = document.getElementById("urgency").value;

  const requestData = {
    name,
    location,
    urgency,
    submittedAt: new Date().toISOString(),
  };

  fetch(`${API_BASE}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((res) => res.json())
    .then(() => {
      renderSchedule(); // Refresh list
      pickupForm.reset();
    })
    .catch((err) => console.error("Error submitting request:", err));
});

// Render Pickup Schedule (GET + Edit + Delete)

function renderSchedule() {
  scheduleList.innerHTML = "";

  fetch(`${API_BASE}/requests`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((request) => {
        const li = document.createElement("li");
        li.textContent = `${request.name} - ${request.location} - ${request.urgency} urgency - Submitted: ${new Date(request.submittedAt).toLocaleString()}`;

        // ===== DELETE Button =====
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this request?")) {
            fetch(`${API_BASE}/requests/${request.id}`, {
              method: "DELETE",
            })
              .then(() => renderSchedule())
              .catch((err) => console.error("Delete error:", err));
          }
        });

        // ===== EDIT Button =====
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.marginLeft = "10px";
        editBtn.addEventListener("click", () => {
          const newUrgency = prompt("Enter new urgency (low, medium, high):", request.urgency);
          if (newUrgency) {
            fetch(`${API_BASE}/requests/${request.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ urgency: newUrgency }),
            })
              .then(() => renderSchedule())
              .catch((err) => console.error("Edit error:", err));
          }
        });

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        scheduleList.appendChild(li);
      });
    })
    .catch((err) => console.error("Error loading schedule:", err));
}

window.addEventListener("DOMContentLoaded", renderSchedule);

// Register New User (POST)
document.getElementById("registerBtn").addEventListener("click", function () {
  const username = prompt("Enter a username:");
  const password = prompt("Enter a password:");

  if (!username || !password) {
    alert("Both username and password are required.");
    return;
  }

  const userData = { username, password };

  fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => res.json())
    .then(() => {
      alert("User registered successfully!");
    })
    .catch((err) => console.error("Registration error:", err));
});

// Login Existing User (GET)

document.getElementById("loginBtn").addEventListener("click", function () {
  const username = prompt("Enter your username:");
  const password = prompt("Enter your password:");

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  fetch(`${API_BASE}/users?username=${username}&password=${password}`)
    .then((res) => res.json())
    .then((users) => {
      if (users.length > 0) {
        alert(`Welcome back, ${username}!`);
        // You could save login info in localStorage here
      } else {
        alert("Invalid login credentials.");
      }
    })
    .catch((err) => console.error("Login error:", err));
});

