const VALID_EMAIL = 'test@example.com';
const VALID_PASSWORD = 'Password123';

const LOCK_KEY = 'login_lock';
const FAIL_KEY = 'failed_attempts';
const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const pwdInput = document.getElementById('password');
const errorDiv = document.getElementById('errorMsg');

function now() { return Date.now(); }
function getFailed() { return parseInt(localStorage.getItem(FAIL_KEY) || '0', 10); }
function setFailed(n) { localStorage.setItem(FAIL_KEY, String(n)); }
function setLock(until) { localStorage.setItem(LOCK_KEY, String(until)); }
function getLock() { return parseInt(localStorage.getItem(LOCK_KEY) || '0', 10); }
function clearLockAndFailed() {
  localStorage.removeItem(LOCK_KEY);
  localStorage.removeItem(FAIL_KEY);
}
function showError(msg) { errorDiv.textContent = msg; }

form.addEventListener('submit', (e) => {
  e.preventDefault();
  showError('');

  const lockUntil = getLock();
  if (lockUntil && now() < lockUntil) {
    const secs = Math.ceil((lockUntil - now()) / 1000);
    return showError(`Account locked. Try again in ${secs} seconds.`);
  } else if (lockUntil && now() >= lockUntil) {
    clearLockAndFailed();
  }

  const email = emailInput.value.trim();
  const pwd = pwdInput.value;

  if (pwd.length < 8) {
    return showError('Password must be at least 8 characters.');
  }

  if (email === VALID_EMAIL && pwd === VALID_PASSWORD) {
    clearLockAndFailed();
    window.location.href = '/dashboard.html';
  } else {
    const fails = getFailed() + 1;
    setFailed(fails);
    if (fails >= 3) {
      setLock(now() + LOCK_DURATION_MS);
      return showError('Account locked for 5 minutes due to multiple failed attempts.');
    } else {
      return showError(`Invalid credentials. ${3 - fails} attempts left.`);
    }
  }
});
