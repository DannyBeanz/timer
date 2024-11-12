// JavaScript to implement the Meeting Cost Calculator with adjustable start time
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const addHourBtn = document.getElementById('add-hour-btn');
const addMinuteBtn = document.getElementById('add-minute-btn');
const timerDisplay = document.getElementById('timer-display');
const totalCostDisplay = document.getElementById('total-cost-display');
const roleCostsDisplay = document.getElementById('role-costs');

let timerInterval;
let startTime;
let elapsedTime = 0;
let isTimerRunning = false;
let roles = [];

// Start the timer
startBtn.addEventListener('click', () => {
  if (isTimerRunning) return;

  // Collect all roles with their hourly rates and counts
  roles = Array.from(document.querySelectorAll('.count')).map(input => {
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
  startTime = Date.now() - elapsedTime; // Account for previously added time
  timerInterval = setInterval(updateTimerAndCost, 1000);

  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
});

// Stop the timer
stopBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  isTimerRunning = false;
  elapsedTime = Date.now() - startTime; // Store elapsed time
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Reset the timer
resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  isTimerRunning = false;
  elapsedTime = 0;
  startTime = null;
  updateTimerDisplay(0);
  roleCostsDisplay.innerHTML = "";
  totalCostDisplay.textContent = "Total Cost: £0.00";

  startBtn.disabled = false;
  stopBtn.disabled = true;
  resetBtn.disabled = true;
});

// Add one hour to the timer
addHourBtn.addEventListener('click', () => {
  adjustElapsedTime(3600); // 1 hour in seconds
});

// Add one minute to the timer
addMinuteBtn.addEventListener('click', () => {
  adjustElapsedTime(60); // 1 minute in seconds
});

// Adjust elapsed time and update display
function adjustElapsedTime(secondsToAdd) {
  elapsedTime += secondsToAdd * 1000; // Convert to milliseconds for consistency
  if (isTimerRunning) {
    startTime = Date.now() - elapsedTime; // Recalculate startTime to keep timer smooth
  }
  updateTimerAndCost();
}

// Update timer display and cumulative costs
function updateTimerAndCost() {
  const currentTime = isTimerRunning ? Date.now() - startTime : elapsedTime;
  updateTimerDisplay(currentTime);

  // Calculate cumulative cost for each role and the grand total
  const elapsedHours = currentTime / (1000 * 60 * 60);
  let grandTotalCost = 0;

  roles.forEach(role => {
    role.cumulativeCost = role.rate * role.count * elapsedHours;
    grandTotalCost += role.cumulativeCost;
  });

  // Display cumulative cost for each role
  roleCostsDisplay.innerHTML = roles.map(role => `
    <div class="role-cost">
      <span>${role.role}:</span>
      <span>£${role.cumulativeCost.toFixed(2)}</span>
    </div>
  `).join('');

  // Display grand total
  totalCostDisplay.textContent = `Total Cost: £${grandTotalCost.toFixed(2)}`;
}

// Helper function to format and display time
function updateTimerDisplay(currentTime) {
  const hours = Math.floor((currentTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((currentTime / (1000 * 60)) % 60);
  const seconds = Math.floor((currentTime / 1000) % 60);
  timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
