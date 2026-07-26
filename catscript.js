const statusText = document.getElementById("status");
const catContainer = document.getElementById("catContainer");
const loadButton = document.getElementById("getCatButton");

function updateStatus(message) {
  statusText.textContent = message;
}

function createCatCard(cat, imageUrl) {
  const card = document.createElement("article");
  card.className = "fact-card";
  card.innerHTML = `
    <img src="${imageUrl}" alt="${cat.name} cat breed">
    <div>
      <h3>${cat.name}</h3>
      <p class="muted"><strong>Temperament:</strong> ${cat.temperament || "Not available"}</p>
      <p>${cat.description || "No description available."}</p>
    </div>
  `;
  return card;
}

async function fetchBreedImage(referenceId) {
  if (!referenceId) {
    return "https://cdn2.thecatapi.com/images/Rhj-JsTLP.jpg";
  }

  try {
    const response = await fetch(`https://api.thecatapi.com/v1/images/${referenceId}`);
    if (!response.ok) {
      return "https://cdn2.thecatapi.com/images/Rhj-JsTLP.jpg";
    }
    const data = await response.json();
    return data.url || "https://cdn2.thecatapi.com/images/Rhj-JsTLP.jpg";
  } catch (error) {
    return "https://cdn2.thecatapi.com/images/Rhj-JsTLP.jpg";
  }
}

async function getRandomCats() {
  updateStatus("Loading awesome cat facts...");
  loadButton.disabled = true;
  catContainer.innerHTML = "";

  const page = Math.floor(Math.random() * 20);
  const url = `https://api.thecatapi.com/v1/breeds?limit=4&page=${page}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Unable to fetch cat data");
    }

    const cats = await response.json();
    if (!Array.isArray(cats) || !cats.length) {
      updateStatus("No cat data available right now.");
      return;
    }

    for (const cat of cats) {
      const imageUrl = await fetchBreedImage(cat.reference_image_id);
      catContainer.appendChild(createCatCard(cat, imageUrl));
    }

    updateStatus("Here are your random cat facts.");
  } catch (error) {
    updateStatus("Failed to fetch cat facts. Please try again.");
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", getRandomCats);
getRandomCats();
  