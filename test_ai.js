const testFeatures = async () => {
  const url = 'https://nexora-phi-weld.vercel.app/api/ai';
  
  console.log("Testing AI endpoints on Vercel...\n");

  const tests = [
    { tool: 'support-chat', prompt: 'Hi, I need help with my college project.' },
    { tool: 'idea', prompt: 'Machine learning for healthcare' }
  ];

  for (const t of tests) {
    try {
      console.log(`[TESTING] Tool: ${t.tool}`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ SUCCESS - Result:\n${data.result}\n`);
      } else {
        const err = await res.text();
        console.log(`❌ ERROR - Status: ${res.status} ${err}\n`);
      }
    } catch (e) {
      console.log(`❌ FETCH FAILED - ${e.message}\n`);
    }
  }
};

testFeatures();
