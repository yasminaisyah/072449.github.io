async function getNews() {
  const query = document.getElementById("newsSearch").value.trim();
  const container = document.getElementById("newsResults");

  if (!query) {
    container.innerHTML = `<p style="color: red; text-align:center;">Please enter a search term.</p>`;
    return;
  }

  container.innerHTML = `<p style="text-align:center;">Loading news articles...</p>`;

  const apiKey = "70e87a45d7b24ef594b30a358741327d";
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}&pageSize=9&sortBy=publishedAt`;

  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(newsApiUrl)}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const json = await response.json();
    const data = JSON.parse(json.contents);

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = `<p style="text-align:center;">No articles found for "<strong>${query}</strong>".</p>`;
      return;
    }

    const articlesHTML = data.articles.slice(0, 6).map(article => `
      <div class="card">
        <img src="${article.urlToImage || 'https://via.placeholder.com/150x100?text=No+Image'}" alt="Article Image" />
        <div class="card-content">
          <h3>${article.title}</h3>
          <p>${article.description || "No description available."}</p>
          <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read more &rarr;</a>
        </div>
      </div>
    `).join("");

    container.innerHTML = articlesHTML;

  } catch (error) {
    container.innerHTML = `<p style="color: red; text-align:center;">Failed to fetch news: ${error.message}</p>`;
    console.error(error);
  }
}

// Attach event listener to search button
document.getElementById("searchBtn").addEventListener("click", getNews);
