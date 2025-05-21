// Replace with your own OpenWeather API key
const apiKey = "8884991cca65fd9f381cb9219c5548f7";

// Chart instance for dynamic updates
let weatherChart;

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    // Show current city and weather
    const currentWeather = data.list[0];
    const weatherResult = document.getElementById("weatherResult");
    weatherResult.innerHTML = `
      <div>
        <strong>${data.city.name}, ${data.city.country}</strong><br/>
        ${new Date(currentWeather.dt_txt).toLocaleString()}<br/>
        🌡 Temp: ${currentWeather.main.temp}°C | 💧 Humidity: ${currentWeather.main.humidity}% | 🌬 Wind: ${currentWeather.wind.speed} m/s
      </div>
    `;

    // Extract next 5 days of data at 12 PM
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
    const labels = dailyData.map(item => new Date(item.dt_txt).toLocaleDateString());
    const temps = dailyData.map(item => item.main.temp);

    updateChart(labels, temps);

  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<span class="text-red-600">${error.message}</span>`;
    if (weatherChart) weatherChart.destroy();
  }
}

function updateChart(labels, data) {
  const ctx = document.getElementById("weatherChart").getContext("2d");

  // Destroy previous chart if exists
  if (weatherChart) weatherChart.destroy();

  weatherChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Temperature (°C)",
        data: data,
        fill: true,
        backgroundColor: "rgba(59,130,246,0.2)", // Tailwind blue-500
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(59,130,246,1)",
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { mode: "index", intersect: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Temperature (°C)" }
        }
      }
    }
  });
}
