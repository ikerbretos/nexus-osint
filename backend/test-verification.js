const axios = require('axios');

async function testEnrichment() {
    console.log("--> Testing IP Enrichment (Public API fallback)...");
    try {
        const resPublic = await axios.post('http://localhost:3001/api/enrich', {
            nodeId: 'TEST_NODE',
            type: 'ip',
            searchValue: '8.8.8.8',
            apiKeys: {}
        });
        console.log("Public Result:", JSON.stringify(resPublic.data.result?.nodes?.map(n => n.type), null, 2));
    } catch (e) {
        console.error("Public API Test Failed:", e.message);
    }

    console.log("\n--> Testing Shodan Integration (Mock Key)...");
    try {
        const resShodan = await axios.post('http://localhost:3001/api/enrich', {
            nodeId: 'TEST_NODE',
            type: 'ip',
            searchValue: '1.1.1.1',
            apiKeys: { shodan: 'TrmuJ0nHYlxkqJVmYn6mHZrwuAwPN63Y' }
        });
        console.log("Shodan Result:", JSON.stringify(resShodan.data.result, null, 2));
    } catch (e) {
        console.error("Shodan Test Logic Failed:", e.message);
    }
}

testEnrichment();
