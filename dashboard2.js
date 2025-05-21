async function getNews() {
  const topic = document.getElementById("searchTerm").value;
  const apiKey = "70e87a45d7b24ef594b30a358741327d";
  const url = `https://newsapi.org/v2/everything?q=${topic}&apiKey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  let articlesHTML = "";
  data.articles.slice(0, 5).forEach(article => {
    articlesHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${article.title}</h5>
          <p class="card-text">${article.description || "No description"}</p>
          <a href="${article.url}" target="_blank" class="btn btn-sm btn-outline-primary">Read More</a>
        </div>
      </div>
    `;
  });

  document.getElementById("newsResult").innerHTML = articlesHTML;
}
