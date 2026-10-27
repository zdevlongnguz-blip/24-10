const gamesListUrlKey = 'games-list-url';

export const saveGamesListUrl = () => {
  const currentUrl = window.location.search
    ? window.location.pathname + window.location.search
    : '/?order=asc&page=1';
  localStorage.setItem(gamesListUrlKey, currentUrl);
};

export const getGamesListUrl = () => {
  const url = localStorage.getItem(gamesListUrlKey);
  return url && /^\/[^\s]*$/.test(url) ? url : '/';
};

export const goToGamesList = () => {
  window.location.assign(getGamesListUrl());
};
