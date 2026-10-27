import { clearToken, hasToken } from './auth-token.js';
import { goToGamesList } from './list-state.js';

const loginLink = document.getElementById('login-link');
const logoutButton = document.getElementById('logout-button');
const mainNavigation = document.getElementById('main-navigation');
const appContent = document.getElementById('app-content');
const path = window.location.pathname;
const isProtectedPage = path === '/' || path === '/ai' || path === '/game/new'
  || /^\/game\/[^/]+(?:\/edit)?$/.test(path);
const isAuthPage = path === '/login' || path === '/register';
const authenticated = hasToken();

mainNavigation.hidden = !authenticated;

if (authenticated) {
  loginLink.hidden = true;
  logoutButton.hidden = false;
}

if (isProtectedPage && !authenticated) {
  window.location.replace('/login');
} else if (isAuthPage && authenticated) {
  goToGamesList();
} else {
  appContent.hidden = false;
}

logoutButton.addEventListener('click', () => {
  clearToken();
  mainNavigation.hidden = true;
  window.location.assign('/login');
});
