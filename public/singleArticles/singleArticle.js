import { BASE_URL } from '../modules/common.js';
const id = localStorage.getItem('userId');
const cardsContainerEl = document.querySelector('.grid');
const token = localStorage.getItem('userToken');
if (!token) {
  window.location.replace('../login/login.html');
}

function cardCreate(title, date, id) {
  const divEl = document.createElement('div');
  divEl.classList.add('card');

  const h2El = document.createElement('h2');
  h2El.textContent = title;

  const pEl = document.createElement('p');
  const iEl = document.createElement('i');
  iEl.textContent = date.slice(0, 10);
  pEl.append(iEl);

  const btnEl = document.createElement('button');
  btnEl.addEventListener('click', () => {
    window.location.href = `../oneArticle/oneArticle.html?=${id}`;
  });

  btnEl.textContent = 'Read more';
  divEl.append(h2El, pEl, btnEl);
  return divEl;
}

function genCards(arr, dest) {
  dest.innerHTML = '';
  arr.forEach((obj) => {
    dest.append(cardCreate(obj.title, obj.date, obj.id));
  });
}

async function getArticles(token, id) {
  const resp = await fetch(`${BASE_URL}/v1/articles/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (resp.ok === false) {
    window.location.replace('../login/login.html');
  }
  const data = await resp.json();

  genCards(data.articles, cardsContainerEl);
}
getArticles(token, id);
const signOutEl = document.querySelectorAll('.signOut');
signOutEl.forEach((signOut) => {
  signOut.addEventListener('click', () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    window.location.replace('../login/login.html');
  });
});
