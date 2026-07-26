const statusText = document.getElementById("status");
const countryContainer = document.getElementById("countryContainer");
const loadButton = document.getElementById("getCountryButton");

function updateStatus(message) {
  statusText.textContent = message;
}

function getRandomItems(array, count) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function createCountryCard(country) {
  const card = document.createElement("article");
  card.className = "fact-card";

  const population = typeof country.population === "number"
    ? country.population.toLocaleString()
    : "Not available";

  card.innerHTML = `
    <img src="${country.flags?.png || ""}" alt="Flag of ${country.name?.common || "country"}">
    <div>
      <h3>${country.name?.official || "Unknown country"}</h3>
      <p class="muted"><strong>Common:</strong> ${country.name?.common || "N/A"}</p>
      <p class="muted"><strong>Region:</strong> ${country.region || "N/A"} | <strong>Capital:</strong> ${(country.capital && country.capital[0]) || "N/A"}</p>
      <p><strong>Population:</strong> ${population}</p>
    </div>
  `;

  return card;
}

async function getRandomCountries() {
  loadButton.disabled = true;
  updateStatus("Loading country facts...");
  countryContainer.innerHTML = "";

  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    const data = await response.json();
    const randomCountries = getRandomItems(data, 6);
    randomCountries.forEach((country) => {
      countryContainer.appendChild(createCountryCard(country));
    });
    updateStatus("Loaded random countries from around the world.");
  } catch (error) {
    updateStatus("Could not load country facts. Please try again.");
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", getRandomCountries);
getRandomCountries();
  