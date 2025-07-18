async function fetchData() {
    const headers = {
        "Authorization": "Bearer YOUR_PLAUSIBLE_API_KEY"
    };

    const domain = "promopilot.netlify.app";

    try {
        const resRealtime = await fetch("/.netlify/functions/get-stats");
const realtime = await resRealtime.json();
document.getElementById("visitors").innerText = realtime.results.visitors;
        
        const resBreakdowns = await Promise.all([
            fetch(`https://plausible.io/api/v1/stats/breakdown?site_id=${domain}&period=day&property=event:page`, { headers }),
            fetch(`https://plausible.io/api/v1/stats/breakdown?site_id=${domain}&period=day&property=visit:source`, { headers }),
            fetch(`https://plausible.io/api/v1/stats/breakdown?site_id=${domain}&period=day&property=visit:device`, { headers }),
            fetch(`https://plausible.io/api/v1/stats/breakdown?site_id=${domain}&period=day&property=visit:country`, { headers })
        ]);

        const [pages, sources, devices, countries] = await Promise.all(resBreakdowns.map(r => r.json()));

        displayList("top-pages", pages.results);
        displayList("sources", sources.results);
        displayList("devices", devices.results);
        displayList("countries", countries.results);

        generateSuggestions(devices.results, pages.results, sources.results);
    } catch (err) {
        console.error("Error fetching data:", err);
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
        tips.push("Most of your traffic is from mobile devices. Make sure your site looks great on phones.");
    }

    if (pages.length > 0 && pages[0].visitors > 10) {
        tips.push(`Your top page is "${pages[0].name}". Consider boosting it with social media.`);
    }

    const google = sources.find(s => s.name.toLowerCase().includes("google"));
    if (!google || google.visitors < 5) {
        tips.push("You are getting low traffic from Google. Consider improving SEO.");
    }

    const tipsList = document.getElementById("tips");
    tipsList.innerHTML = "";
    tips.forEach(tip => {
        const li = document.createElement("li");
        li.innerText = tip;
        tipsList.appendChild(li);
    });
}

fetchData();
