// investors_cluster_layer.js
// =============================================================
// Layer de investidores por cluster de contato (NOBO List)
// =============================================================

async function addInvestorsClusterLayer(map) {
  // --- 1️⃣ Carregar JSON ---
  const response = await fetch("data/investors_map.json");
  const investors = await response.json();

  // --- 2️⃣ Definir ícones por cluster ---
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

  // --- 4️⃣ Criar filtro no canto superior esquerdo ---
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

  // --- 5️⃣ Lógica de exibição ---
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

  // --- 6️⃣ Legenda ---
  const legend = document.createElement("div");
  legend.className = "legend";
  legend.style.background = "white";
  legend.style.padding = "10px";
  legend.style.margin = "10px";
  legend.style.fontSize = "14px";
  legend.style.borderRadius = "8px";
  legend.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  legend.innerHTML = "<b>Legend</b><br>";

  for (const [cluster, iconUrl] of Object.entries(clusterIcons)) {
    const div = document.createElement("div");
    div.innerHTML = `<img src="${iconUrl}"> ${cluster}`;
    legend.appendChild(div);
  }

  const counterDiv = document.createElement("div");
  counterDiv.id = "counter";
  counterDiv.textContent = "Visible Investors: 0";
  counterDiv.style.marginTop = "8px";
  counterDiv.style.fontWeight = "bold";
  counterDiv.style.textAlign = "center";
  counterDiv.style.color = "#17193b";
  legend.appendChild(counterDiv);

  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
  updateCounter();

  console.log("✅ Investor cluster layer loaded successfully");
}

// =============================================================
// Botão de retorno
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
