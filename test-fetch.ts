async function testDate(dateStr: string) {
  try {
    const res = await fetch("http://localhost:3000/api/reveal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ birthDate: dateStr })
    });
    const text = await res.text();
    console.log(`Date: ${dateStr} | Status: ${res.status} | Short Body: ${text.slice(0, 80)}`);
  } catch (err) {
    console.error(`Fetch failed for ${dateStr}:`, err);
  }
}

async function run() {
  const dates = [
    "1920-05-15",
    "1930-01-01",
    "1939-12-31",
    "1940-01-01",
    "1940-06-15",
    "1950-06-15",
    "1994-05-15",
    "2026-01-01",
    "2026-06-12"
  ];
  for (const date of dates) {
    await testDate(date);
  }
}
run();
