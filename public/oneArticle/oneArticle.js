import { BASE_URL } from '../modules/common.js';

const token = localStorage.getItem('userToken');
const id = location.search.slice(2);

const titleEl = document.getElementById('title');
const contentEl = document.getElementById('content');
const dateEl = document.getElementById('date');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');

const titleInpEl = document.getElementById('titleInp');
const contentInpEl = document.getElementById('contentInp');
const dateInpEl = document.getElementById('dateInp');
const submitBtnEl = document.getElementById('submitBtn');

let article;
if (!token) {
  window.location.replace('../login/login.html');
}

function renderContent(arr) {
  arr.forEach((obj) => {
    titleEl.textContent = obj.title;
    contentEl.textContent = obj.content;
    dateEl.textContent = obj.date.slice(0, 10);
  });
}

async function getArticles(token) {
  const resp = await fetch(`${BASE_URL}/v1/article/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (resp.ok === false) {
    window.location.replace('../login/login.html');
  }
  const data = await resp.json();
  renderContent(data.article);
  article = data.article[0].user_id;
}

getArticles(token);

editBtn.addEventListener('click', () => {
  if (article !== +localStorage.getItem('userId')) {
    alert('You can only edit your post');
    return;
  }

  editBtn.textContent === 'Edit'
    ? (editBtn.textContent = 'Cancel')
    : (editBtn.textContent = 'Edit');

  titleInpEl.classList.toggle('hidden');
  contentInpEl.classList.toggle('hidden');
  dateInpEl.classList.toggle('hidden');
  submitBtnEl.classList.toggle('hidden');
});
submitBtnEl.addEventListener('click', (e) => {
  e.preventDefault();

  const obj = {
    date: dateInpEl.value === '' ? dateEl.textContent : dateInpEl.value,
    title: titleInpEl.value === '' ? titleEl.textContent : titleInpEl.value,
    content: contentInpEl.value === '' ? contentEl.textContent : contentInpEl.value,
  };
  updatePost(id, token, obj);
});

async function updatePost(id, token, obj) {
  const resp = await fetch(`${BASE_URL}/v1/article/edit/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'PATCH',
    body: JSON.stringify(obj),
  });

  const data = await resp.json();

  if (data.result.affectedRows !== 1) {
    alert('something went wrong');
    return;
  }
  titleInpEl.value = '';
  contentEl.value = '';
  dateInpEl.value = '';
  editBtn.textContent === 'Edit'
    ? (editBtn.textContent = 'Cancel')
    : (editBtn.textContent = 'Edit');

  titleInpEl.classList.toggle('hidden');
  contentInpEl.classList.toggle('hidden');
  dateInpEl.classList.toggle('hidden');
  submitBtnEl.classList.toggle('hidden');
  getArticles(token);
}

deleteBtn.addEventListener('click', () => {
  if (article !== +localStorage.getItem('userId')) {
    alert('You can only delete your post');
    return;
  }
  const ats = confirm('Do you wanna delete this article');
  if (ats === false) {
    return;
  }
  deleteArticle(id, token);
});
async function deleteArticle(id, token) {
  const resp = await fetch(`${BASE_URL}/v1/article/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'DELETE',
  });

  const data = await resp.json();

  if (data.result.affectedRows !== 1) {
    alert('something went wrong');
    return;
  }
  window.location.replace('../articles/articles.html');
}
