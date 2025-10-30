// investors_tier_layer.js
// =============================================================
// Layer para exibir investidores no mapa base, com filtro por tier
// e botão para retornar ao painel principal (index.html)
// =============================================================

async function addInvestorsLayer(map) {
  // --- 1️⃣ Carregar o JSON de investidores ---
  const response = await fetch("data/investors_map.json");
  const investors = await response.json();

  // --- 2️⃣ Ícones por Tier ---
  const tierIcons = {
    "Strategic – more than 1,000,000 shares": "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    "Large – up to 1,000,000 shares": "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    "Medium – up to 100,000 shares": "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
    "Small – up to 10,000 shares": "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    "Micro – up to 1,000 shares": "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
  };

  const markersByTier = {};
  for (const tier in tierIcons) {
    markersByTier[tier] = [];
  }

  // --- 3️⃣ Criar marcadores ---
  investors.forEach(inv => {
    if (inv.lat && inv.lon) {
      const latOffset = (Math.random() - 0.5) * 0.0006;
      const lonOffset = (Math.random() - 0.5) * 0.0006;

      const marker = new google.maps.Marker({
        position: { lat: inv.lat + latOffset, lng: inv.lon + lonOffset },
        map,
        title: `${inv.name} (${inv.city})`,
        icon: tierIcons[inv.tier] || "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      });

      const info = new google.maps.InfoWindow({
        content: `
          <div style="font-size:14px; line-height:1.4;">
            <b>${inv.name}</b><br>
            City: ${inv.city}<br>
            Shares: ${Number(inv.shares).toLocaleString()}<br>
            Tier: ${inv.tier}<br>
            Cluster: ${inv.cluster}<br>
            <hr>
            <b>Regional Data (FSA):</b><br>
            Avg. Income: $${Number(inv.income).toLocaleString('en-US', { maximumFractionDigits: 0 })} K<br>
            Avg. Age: ${Math.round(inv.age)} years
          </div>`
      });

      marker.addListener("click", () => info.open(map, marker));

      if (markersByTier[inv.tier]) {
        markersByTier[inv.tier].push(marker);
      }
    }
  });

  // --- 4️⃣ Caixa de filtros ---
  const filterBox = document.createElement("div");
  filterBox.id = "filter-box";
  filterBox.style.position = "absolute";
  filterBox.style.top = "125px";
  filterBox.style.left = "10px";
  filterBox.style.background = "white";
  filterBox.style.padding = "12px 16px";
  filterBox.style.borderRadius = "10px";
  filterBox.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  filterBox.style.fontSize = "14px";
  filterBox.style.lineHeight = "1.6";
  filterBox.innerHTML = `
    <b>Show Tiers:</b>
    <label><input type="checkbox" id="tierStrategic" checked> Strategic</label>
    <label><input type="checkbox" id="tierLarge" checked> Large</label>
    <label><input type="checkbox" id="tierMedium" checked> Medium</label>
    <label><input type="checkbox" id="tierSmall" checked> Small</label>
    <label><input type="checkbox" id="tierMicro" checked> Micro</label>
  `;
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(filterBox);

  const checkboxes = {
    "Strategic – more than 1,000,000 shares": document.getElementById("tierStrategic"),
    "Large – up to 1,000,000 shares": document.getElementById("tierLarge"),
    "Medium – up to 100,000 shares": document.getElementById("tierMedium"),
    "Small – up to 10,000 shares": document.getElementById("tierSmall"),
    "Micro – up to 1,000 shares": document.getElementById("tierMicro")
  };

  for (const [tier, checkbox] of Object.entries(checkboxes)) {
    checkbox.addEventListener("change", () => {
      const visible = checkbox.checked;
      markersByTier[tier].forEach(marker => marker.setVisible(visible));
    });
  }

  console.log("✅ Investor tier layer loaded successfully");
}

// =============================================================
// Função global para adicionar botão de retorno
// =============================================================
function addBackButton() {
  const backButton = document.createElement("a");
  backButton.href = "index.html";
  backButton.id = "back-button";
  backButton.textContent = "⬅ Back to Dashboard";
  backButton.style.position = "absolute";
  backButton.style.top = "15px";
  backButton.style.left = "210px";
  backButton.style.backgroundColor = "white";
  backButton.style.padding = "8px 14px";
  backButton.style.borderRadius = "8px";
  backButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  backButton.style.color = "#17193b";
  backButton.style.textDecoration = "none";
  backButton.style.fontWeight = "600";
  backButton.style.fontSize = "13px";
  backButton.style.zIndex = "10";
  backButton.style.transition = "all 0.2s ease-in-out";

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
