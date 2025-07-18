async function fetchData() {
  try {
    // Securely get current visitors
    const resRealtime = await fetch("/.netlify/functions/get-stats");
    const realtime = await resRealtime.json();
    document.getElementById("visitors").innerText = realtime.results.visitors;

    // Securely get breakdown data
    const resBreakdown = await fetch("/.netlify/functions/get-insights");
    const insights = await resBreakdown.json();

    const { pages, sources, devices, countries } = insights;

    displayList("top-pages", pages.results);
    displayList("sources", sources.results);
    displayList("devices", devices.results);
    displayList("countries", countries.results);

    generateSuggestions(devices.results, pages.results, sources.results);
  } catch (err) {
    console.error("Error fetching data:", err);
    document.getElementById("visitors").innerText = "N/A";
  }
}

function displayList(id, items) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  items.slice(0, 5).forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.name} (${item.visitors})`;
    list.appendChild(li);
  });
}

function generateSuggestions(devices, pages, sources) {
  const tips = [];

  const mobile = devices.find(d => d.name === "Mobile");
  const desktop = devices.find(d => d.name === "Desktop");
  if (mobile && desktop && mobile.visitors > desktop.visitors) {
    tips.push("📱 Most of your traffic is from mobile devices. Make sure your site looks great on phones.");
  }

  if (pages.length > 0 && pages[0].visitors > 10) {
    tips.push(`🔥 Your top page is "${pages[0].name}". Promote it on social media or in your newsletter.`);
  }

  const google = sources.find(s => s.name.toLowerCase().includes("google"));
  if (!google || google.visitors < 5) {
    tips.push("🔍 You're getting low traffic from Google. Consider improving your SEO.");
  }

  const tipsList = document.getElementById("tips");
  tipsList.innerHTML = "";
  tips.forEach(tip => {
    const li = document.createElement("li");
    li.innerText = tip;
    tipsList.appendChild(li);
  });
}

// Load it all!
fetchData();
