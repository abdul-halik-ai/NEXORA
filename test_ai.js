const testFeatures = async () => {
  const url = 'https://nexora-phi-weld.vercel.app/api/ai';
  
  console.log("=== Testing ALL 7 AI Endpoints on Vercel ===\n");

  const tests = [
    { tool: 'support-chat', prompt: 'How do I request a custom project?' },
    { tool: 'idea', prompt: 'React Native Health Tracker' },
    { tool: 'readme', prompt: 'Smart IoT Home Automation' },
    { tool: 'viva', prompt: 'Serverless Node API Architecture' },
    { tool: 'explain', prompt: 'const [count, setCount] = useState(0); useEffect(() => { document.title = `Clicked ${count} times`; }, [count]);' },
    { tool: 'optimize', prompt: 'window.addEventListener("scroll", () => { console.log("Scrolling!"); });' },
    { tool: 'viva-grade', prompt: JSON.stringify({ question: 'How did you secure the authentication endpoints?', answer: 'I used JWT stored in HTTP-only cookies and bcrypt to hash passwords.' }) }
  ];

  for (const t of tests) {
    try {
      console.log(`\n⏳ [TESTING] ${t.tool.toUpperCase()}...`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ SUCCESS\n---\n${data.result.substring(0, 300)}${data.result.length > 300 ? '...' : ''}\n---`);
      } else {
        const err = await res.text();
        console.log(`❌ ERROR - Status: ${res.status} ${err}`);
      }
    } catch (e) {
      console.log(`❌ FETCH FAILED - ${e.message}`);
    }
  }
};

testFeatures();
