// Variables for tracking the timer, roles, and costs
let timerInterval;
let startTime;
let isTimerRunning = false;

// Elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const timerDisplay = document.getElementById('timer-display');
const totalCostDisplay = document.getElementById('total-cost-display');
const roleCostsDisplay = document.getElementById('role-costs');

// Start the timer
startBtn.addEventListener('click', () => {
  if (isTimerRunning) return;

  // Collect all roles with their hourly rates and counts
  const roles = Array.from(document.querySelectorAll('.count')).map(input => {
    const rate = parseFloat(input.dataset.rate);
    const count = parseInt(input.value) || 0;
    const role = input.dataset.role;
    return { role, rate, count, cumulativeCost: 0 };
  });

  // Check if at least one role has participants
  if (roles.every(role => role.count === 0)) {
    alert("Please enter at least one person in a role.");
    return;
  }

  // Initialize timer
  isTimerRunning = true;
  startTime = Date.now();
  timerInterval = setInterval(() => updateTimerAndCost(roles), 1000);

  // Disable start button and enable stop/reset buttons
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
});

// Stop the timer
stopBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  isTimerRunning = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Reset the timer
resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  isTimerRunning = false;
  startTime = null;
  timerDisplay.textContent = "00:00:00";
  roleCostsDisplay.innerHTML = "";
  totalCostDisplay.textContent = "Total Cost: $0.00";

  startBtn.disabled = false;
  stopBtn.disabled = true;
  resetBtn.disabled = true;
});

// Function to update timer display and cumulative costs
function updateTimerAndCost(roles) {
  const elapsedTime = Date.now() - startTime;

  // Format time to HH:MM:SS
  const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate cumulative cost for each role and the grand total
  const elapsedHours = elapsedTime / (1000 * 60 * 60);
  let grandTotalCost = 0;

  roles.forEach(role => {
    // Calculate cumulative cost for the role
    role.cumulativeCost = role.rate * role.count * elapsedHours;
    grandTotalCost += role.cumulativeCost;
  });

  // Display cumulative cost for each role
  roleCostsDisplay.innerHTML = roles.map(role => `
    <div class="role-cost">
      <span>${role.role}:</span>
      <span>$${role.cumulativeCost.toFixed(2)}</span>
    </div>
  `).join('');

  // Display grand total
  totalCostDisplay.textContent = `Total Cost: $${grandTotalCost.toFixed(2)}`;
}

// Feedback Button
const feedbackBtn = document.getElementById('feedback-btn');
feedbackBtn.addEventListener('click', () => {
  const phoneNumber = '07771875836'; // Replace with Tommy's phone number
  const feedbackMessage = 'Hi Tommy, I wanted to share some feedback with you!';
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(feedbackMessage)}`;

  // Open WhatsApp with the message
  window.open(whatsappURL, '_blank');
});
