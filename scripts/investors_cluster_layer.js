// =============================================================
// Layer de investidores por cluster de contato (NOBO List)
// =============================================================

async function addInvestorsClusterLayer(map) {
  console.log("📥 Loading investor cluster layer...");

  // --- 1️⃣ Carregar JSON ---
  const response = await fetch("data/investors.json");
  const investors = await response.json();

  // --- 2️⃣ Ícones por cluster ---
  const clusterIcons = {
    "Top Priority Contacts": "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    "High-Potential Contacts": "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    "Potential Contacts": "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
    "Low-Potential Contacts": "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    "Pending Contact Method": "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    "Do Not Contact": "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  };

  const markersByCluster = {};
  for (const cluster in clusterIcons) markersByCluster[cluster] = [];

  // --- 3️⃣ Criar marcadores ---
  investors.forEach(inv => {
    if (inv.lat && inv.lon) {
      const latOffset = (Math.random() - 0.5) * 0.0006;
      const lonOffset = (Math.random() - 0.5) * 0.0006;

      const marker = new google.maps.Marker({
        position: { lat: inv.lat + latOffset, lng: inv.lon + lonOffset },
        map,
        title: `${inv.name} (${inv.city})`,
        icon: clusterIcons[inv.cluster] || "http://maps.google.com/mapfiles/ms/icons/gray-dot.png"
      });

      const info = new google.maps.InfoWindow({
        content: `
          <div style="font-size:14px; line-height:1.4;">
            <b>${inv.name}</b><br>
            City: ${inv.city}<br>
            Province: ${inv.province}<br>
            Shares: ${Number(inv.shares).toLocaleString()}<br>
            Cluster: ${inv.cluster}<br>
            Income: ${inv.income ? "$" + Number(inv.income).toLocaleString() : "N/A"}<br>
            Estimated Age: ${inv.age ? Math.round(inv.age) : "N/A"} years
          </div>`
      });

      marker.addListener("click", () => info.open(map, marker));
      if (markersByCluster[inv.cluster]) markersByCluster[inv.cluster].push(marker);
    }
  });

  // --- 4️⃣ Criar caixa de filtros ---
  const filterBox = document.createElement("div");
  Object.assign(filterBox.style, {
    position: "absolute",
    top: "125px",
    left: "10px",
    background: "white",
    padding: "12px 16px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    fontSize: "14px",
    zIndex: "5",
    lineHeight: "1.6"
  });
  filterBox.id = "filter-box";

  filterBox.innerHTML = `
    <b>Show Clusters:</b>
    <label><input type="checkbox" id="clusterTop" checked> Top Priority</label>
    <label><input type="checkbox" id="clusterHigh" checked> High-Potential</label>
    <label><input type="checkbox" id="clusterPotential" checked> Potential</label>
    <label><input type="checkbox" id="clusterLow" checked> Low-Potential</label>
    <label><input type="checkbox" id="clusterPending" checked> Pending Contact</label>
    <label><input type="checkbox" id="clusterNon" checked> Do Not Contact</label>
  `;
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(filterBox);

  const checkboxes = {
    "Top Priority Contacts": document.getElementById("clusterTop"),
    "High-Potential Contacts": document.getElementById("clusterHigh"),
    "Potential Contacts": document.getElementById("clusterPotential"),
    "Low-Potential Contacts": document.getElementById("clusterLow"),
    "Pending Contact Method": document.getElementById("clusterPending"),
    "Do Not Contact": document.getElementById("clusterNon")
  };

  // --- 5️⃣ Legenda e contador ---
  const legend = document.createElement("div");
  legend.className = "legend";
  Object.assign(legend.style, {
    background: "white",
    padding: "10px",
    margin: "10px",
    fontSize: "14px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
  });
  legend.innerHTML = "<b>Legend</b><br>";

  for (const [cluster, iconUrl] of Object.entries(clusterIcons)) {
    const div = document.createElement("div");
    div.innerHTML = `<img src="${iconUrl}" style="vertical-align:middle; margin-right:6px;"> ${cluster}`;
    legend.appendChild(div);
  }

  const counterDiv = document.createElement("div");
  Object.assign(counterDiv.style, {
    marginTop: "8px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#17193b"
  });
  counterDiv.id = "counter";
  counterDiv.textContent = "Visible Investors: 0";
  legend.appendChild(counterDiv);

  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

  // --- 6️⃣ Atualizar visibilidade e contador ---
  function updateCounter() {
    let visibleCount = 0;
    for (const cluster in markersByCluster) {
      markersByCluster[cluster].forEach(marker => {
        if (marker.getVisible()) visibleCount++;
      });
    }
    counterDiv.textContent = `Visible Investors: ${visibleCount}`;
  }

  for (const [cluster, checkbox] of Object.entries(checkboxes)) {
    checkbox.addEventListener("change", () => {
      const visible = checkbox.checked;
      markersByCluster[cluster].forEach(marker => marker.setVisible(visible));
      updateCounter();
    });
  }

  updateCounter();
  console.log("✅ Investor cluster layer loaded successfully.");
}

// =============================================================
// Botão de retorno
// =============================================================
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
    transition: "all 0.2s ease-in-out"
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
