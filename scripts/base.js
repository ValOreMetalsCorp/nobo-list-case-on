async function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8.3,
    center: { lat: 44.2, lng: -79.9 },
    mapTypeId: "roadmap"
  });

  // 🔹 Carregar o JSON e filtrar somente Cluster 1
  const response = await fetch("data/ontario_socioeconomic_clusters_geo.json");
  const data = await response.json();
  const filtered = data.filter(d => Number(d.socioeconomic_cluster) === 1);

  // 🔵 Criar círculos de 15 km
  filtered.forEach(d => {
    const lat = parseFloat(d.lat);
    const lon = parseFloat(d.lon);
    const fsa = d.fsa;

    if (!isNaN(lat) && !isNaN(lon)) {
      const circle = new google.maps.Circle({
        strokeOpacity: 0,
        fillColor: "#708090",
        fillOpacity: 0.25,
        map,
        center: { lat, lng: lon },
        radius: 15000
      });

      const info = new google.maps.InfoWindow({
        content: `
          <b>FSA:</b> ${fsa}<br>
          <b>Cluster:</b> 1 – High-Income / High-Investment<br>
          <b>Coverage radius:</b> ≈15 km
        `
      });

      circle.addListener("click", () => info.open(map));
    }
  });

  // 🧭 Legenda
  const legend = document.getElementById("legend");
  legend.innerHTML = `
    <b>Priority FSAs</b><br>
    <div style="display:flex;align-items:center;">
      <div style="width:14px;height:14px;border-radius:50%;background:#708090;margin-right:6px;opacity:0.25;"></div>
      Cluster 1 – High-Income / High-Investment (15 km radius)
    </div>
    <hr>
    <div><span style="color:#FF0000;">&#8212;&#8212;&#8212;</span> Corridor (15 km buffer around Highways 400 & 10)</div>
    <div><span style="color:#000;">&#8212;&#8212;&#8212;</span> Highways 400 & 10 (Dashed)</div>
    <div><span style="color:#0066FF;">⬤</span> Toronto 40 km radius</div>
    <div><span style="color:#FF9900;">⬤</span> Collingwood 40 km radius</div>
  `;
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

  // 📍 Reference points
  const collingwood = { lat: 44.5008, lng: -80.2144 };
  const toronto = { lat: 43.6532, lng: -79.3832 };

  // 🏛️ City markers
  [collingwood, toronto].forEach((city, i) => {
    new google.maps.Marker({
      position: city,
      map,
      icon: {
        url: "http://maps.google.com/mapfiles/kml/shapes/capital_small.png",
        scaledSize: new google.maps.Size(36, 36)
      },
      title: i === 0 ? "Collingwood City Hall" : "Toronto City Hall"
    });
  });

  // 🔸 City circles (40 km)
  [collingwood, toronto].forEach(center => {
    new google.maps.Circle({
      strokeColor: "#000000",
      strokeOpacity: 0.7,
      strokeWeight: 1,
      fillOpacity: 0,
      map,
      center,
      radius: 40000
    });
  });

  // 🛣️ Highways
  const highway400 = [
    collingwood,
    { lat: 44.39, lng: -79.69 },
    { lat: 43.9, lng: -79.51 },
    toronto
  ];
  const highway10 = [
    collingwood,
    { lat: 44.3, lng: -80.0 },
    { lat: 43.9, lng: -79.9 },
    toronto
  ];

  [highway400, highway10].forEach(path => {
    new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      strokeWeight: 1,
      icons: [
        {
          icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 4 },
          offset: "0",
          repeat: "20px"
        }
      ],
      map
    });
  });

  // 🔺 Corridor polygon
  const corridor = [
    { lat: 44.62, lng: -80.35 },
    { lat: 44.48, lng: -79.58 },
    { lat: 44.05, lng: -79.3 },
    { lat: 43.6, lng: -79.35 },
    { lat: 43.55, lng: -79.85 },
    { lat: 43.85, lng: -80.15 },
    { lat: 44.35, lng: -80.25 },
    { lat: 44.62, lng: -80.35 }
  ];

  new google.maps.Polygon({
    paths: corridor,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillOpacity: 0,
    map
  });

  console.log("✅ High-Income / High-Investment FSAs layer loaded successfully.");
}
