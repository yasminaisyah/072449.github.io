async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  console.log("Fetching data from:", apiUrl);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log("API response:", data);

    const currentWeather = data.list[0];
    const weatherResult = document.getElementById("weatherResult");
    weatherResult.innerHTML = `
      <div>
        <strong>${data.city.name}, ${data.city.country}</strong><br/>
        ${new Date(currentWeather.dt_txt).toLocaleString()}<br/>
        🌡 Temp: ${currentWeather.main.temp}°C | 💧 Humidity: ${currentWeather.main.humidity}% | 🌬 Wind: ${currentWeather.wind.speed} m/s
      </div>
    `;

    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
    const labels = dailyData.map(item => new Date(item.dt_txt).toLocaleDateString());
    const temps = dailyData.map(item => item.main.temp);
    console.log("Labels:", labels);
    console.log("Temperatures:", temps);

    updateChart(labels, temps);
  } catch (error) {
    console.error("Error fetching weather:", error);
    document.getElementById("weatherResult").innerHTML = `<span class="text-red-600">${error.message}</span>`;
    if (weatherChart) weatherChart.destroy();
  }
}
