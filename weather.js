async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const apiKey = "8884991cca65fd9f381cb9219c5548f7";
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  const container = document.getElementById("weatherInfo");
  const chartCanvas = document.getElementById("weatherChart");
  container.innerHTML = "Loading weather data...";

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok) {
      container.innerHTML = `<p>City not found or API error.</p>`;
      if (window.myChart) window.myChart.destroy();
      return;
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    container.innerHTML = `
      <h2>${currentData.name}, ${currentData.sys.country}</h2>
      <p>${new Date(currentData.dt * 1000).toLocaleString()}</p>
      <p>🌡️ Temp: ${currentData.main.temp}°C | 💧 Humidity: ${currentData.main.humidity}% | 🌬️ Wind: ${currentData.wind.speed} m/s</p>
    `;

    const labels = [];
    const temps = [];

    forecastData.list.forEach((entry, i) => {
      if (i % 8 === 0) {
        labels.push(new Date(entry.dt * 1000).toLocaleDateString());
        temps.push(entry.main.temp);
      }
    });

    const ctx = chartCanvas.getContext("2d");

    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Temperature (°C)",
          data: temps,
          borderColor: "#8B1E3F",
          backgroundColor: "rgba(139, 30, 63, 0.2)",
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: "#000" } }
        },
        scales: {
          x: { ticks: { color: "#000" } },
          y: { ticks: { color: "#000" } }
        }
      }
    });

  } catch (error) {
    container.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
    if (window.myChart) window.myChart.destroy();
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("getWeatherBtn");
  if (btn) {
    btn.addEventListener("click", getWeather);
  }
});
