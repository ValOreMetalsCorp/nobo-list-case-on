// economic_base_layer.js
async function addEconomicBaseLayer(map) {
  console.log("🗺️ Loading Economic Base Layer...");

  // 🎯 Configuração visual opcional (por exemplo, mostrar limites ou referência)
  const corridorPath = [
    { lat: 44.62, lng: -80.35 },
    { lat: 44.48, lng: -79.58 },
    { lat: 44.05, lng: -79.3 },
    { lat: 43.6, lng: -79.35 },
    { lat: 43.55, lng: -79.85 },
    { lat: 43.85, lng: -80.15 },
    { lat: 44.35, lng: -80.25 },
    { lat: 44.62, lng: -80.35 }
  ];

  // 🔺 Desenhar o polígono do corredor econômico
  new google.maps.Polygon({
    paths: corridorPath,
    strokeColor: "#FF0000",
    strokeOpacity: 0.6,
    strokeWeight: 1,
    fillOpacity: 0,
    map
  });

  // 📍 Marcadores principais (Toronto e Collingwood)
  const keyCities = [
    { name: "Toronto", lat: 43.6532, lng: -79.3832 },
    { name: "Collingwood", lat: 44.5008, lng: -80.2144 }
  ];

  keyCities.forEach(city => {
    new google.maps.Marker({
      position: { lat: city.lat, lng: city.lng },
      map,
      title: `${city.name} City Hall`,
      icon: {
        url: "http://maps.google.com/mapfiles/kml/shapes/capital_small.png",
        scaledSize: new google.maps.Size(34, 34)
      }
    });

    // 🔵 Circunferência de 40 km
    new google.maps.Circle({
      strokeColor: "#000000",
      strokeOpacity: 0.7,
      strokeWeight: 1,
      fillOpacity: 0,
      map,
      center: { lat: city.lat, lng: city.lng },
      radius: 40000
    });
  });

  console.log("✅ Economic Base Layer rendered successfully.");
}

// 🔙 Botão de retorno
function addBackButton() {
  const backButton = document.createElement("a");
  backButton.href = "index.html";
  backButton.id = "back-button";
  backButton.textContent = "⬅ Back to Dashboard";

  Object.assign(backButton.style, {
    position: "absolute",
    top: "15px",
    left: "210px",
    backgroundColor: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    color: "#17193b",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "13px",
    zIndex: "10",
    transition: "all 0.2s ease-in-out",
  });

  backButton.addEventListener("mouseover", () => {
    backButton.style.backgroundColor = "#f2f2f2";
    backButton.style.transform = "translateY(-1px)";
  });
  backButton.addEventListener("mouseout", () => {
    backButton.style.backgroundColor = "white";
    backButton.style.transform = "translateY(0)";
  });

  document.body.appendChild(backButton);
}
