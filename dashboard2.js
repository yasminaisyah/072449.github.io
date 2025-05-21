async function getNews() {
  const topic = document.getElementById("searchTerm").value.trim();
  const newsResult = document.getElementById("newsResult");
  const apiKey = "70e87a45d7b24ef594b30a358741327d";

  if (!topic) {
    newsResult.innerHTML = `<p class="text-red-600 font-semibold">Please enter a search topic.</p>`;
    return;
  }

  newsResult.innerHTML = `<p class="text-gray-500">Loading news...</p>`;

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      newsResult.innerHTML = `<p class="text-gray-600">No news articles found for "<strong>${topic}</strong>".</p>`;
      return;
    }

    let articlesHTML = data.articles.slice(0, 5).map(article => `
      <article class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <h3 class="text-xl font-semibold mb-2">${article.title}</h3>
        <p class="text-gray-700 mb-4">${article.description || "No description available."}</p>
        <a href="${article.url}" target="_blank" class="inline-block text-blue-600 hover:text-blue-800 font-medium transition">
          Read More &rarr;
        </a>
      </article>
    `).join("");

    newsResult.innerHTML = articlesHTML;

  } catch (error) {
    newsResult.innerHTML = `<p class="text-red-600 font-semibold">Failed to fetch news: ${error.message}</p>`;
  }
}
