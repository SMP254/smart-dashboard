async function fetchData() {
  try {
    // Secure real-time visitors
    const resRealtime = await fetch("/.netlify/functions/get-stats");
    const realtime = await resRealtime.json();
    document.getElementById("visitors").innerText = realtime.results.visitors;

    // Secure breakdown data
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
