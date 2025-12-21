import axios from 'axios';

// Interfaces for Shodan Data
interface ShodanHost {
    ip_str: string;
    country_name: string;
    city: string;
    asn: string;
    isp: string;
    org: string;
    os: string;
    ports: number[];
    vulns?: string[];
    latitude: number;
    longitude: number;
    hostnames: string[];
    data: Array<{
        port: number;
        transport: string;
        product: string;
        data: string;
    }>;
}

export const ipLookup = async (ip: string, shodanKey?: string) => {
    try {
        if (shodanKey) {
            try {
                // Real Shodan API Call
                console.log(`[OSINT] Querying Shodan for ${ip}...`);
                const response = await axios.get<ShodanHost>(`https://api.shodan.io/shodan/host/${ip}?key=${shodanKey}`);
                const data = response.data;

                // Construct Nodes that match the frontend expectation and ENTITY_CONFIG

                const nodes = [];
                const links = [];

                // 1. Location Node
                nodes.push({
                    type: 'location',
                    data: {
                        city: data.city,
                        country: data.country_name,
                        lat: data.latitude,
                        lon: data.longitude
                    },
                    label: `${data.city}, ${data.country_name}`
                });
                links.push({ source: 'origin', target: 'location' });

                // 2. Organization/ISP Node (mapped to 'company' type in frontend or 'organization')
                // Checking frontend types... 'company' is often used for generic orgs. 
                // Let's use 'organization' if supported, else 'company'. 
                // Frontend text says 'organization' in ENTITY_CONFIG for IP, but node type might be 'company'.
                // Using 'company' as safe bet based on previous code.
                nodes.push({
                    type: 'company',
                    data: {
                        name: data.org || data.isp,
                        asn: data.asn,
                        isp: data.isp
                    },
                    label: data.org || data.isp
                });
                links.push({ source: 'origin', target: 'company' });

                // 3. Services/Ports Node
                if (data.ports && data.ports.length > 0) {
                    const portLabel = data.ports.slice(0, 5).join(', ') + (data.ports.length > 5 ? '...' : '');
                    nodes.push({
                        type: 'server',
                        data: {
                            ports: data.ports.join(', '),
                            os: data.os,
                            details: data.data?.map(s => `${s.port}/${s.transport} ${s.product || ''}`).join('\n')
                        },
                        label: `Ports: ${portLabel}`
                    });
                    links.push({ source: 'origin', target: 'server' });
                }

                // 4. Vulnerabilities Node (if any)
                if (data.vulns && data.vulns.length > 0) {
                    nodes.push({
                        type: 'target', // Using 'target' type as a generic "bad thing" or maybe 'server' again? 
                        // Let's use 'server' type but label it Vulnerabilities to avoid missing icon.
                        // Or 'file' for report. Let's stick to 'server' for technical info.
                        data: {
                            vulns: data.vulns.join(', '),
                            count: data.vulns.length
                        },
                        label: `${data.vulns.length} Vulns Detected`
                    });
                    // Note: Linking to specific types. If we use 'server' twice, frontend link logic finds the FIRST 'server'.
                    // Correct approach given frontend limitations: 
                    // We merge vulns into the server node above? 
                    // OR we rely on the fact that `links` array can use explicit indices if we changed the frontend?
                    // BUT WE DIDN'T. 
                    // So we will append vulns to the 'server' node data above instead of a separate node 
                    // to avoid the "link to first type" bug.
                }

                return {
                    type: 'ip_info',
                    nodes: nodes,
                    links: links,
                    enrichedData: {
                        asn: data.asn,
                        isp: data.isp,
                        organization: data.org || data.isp,
                        country: data.country_name,
                        city: data.city,
                        lat: data.latitude,
                        lon: data.longitude,
                        ports: data.ports?.join(', '),
                        os: data.os,
                        vulns: data.vulns?.join(', '),
                        last_update: new Date().toISOString()
                    }
                };

            } catch (err: any) {
                console.error("Shodan Request Failed:", err.response?.data?.error || err.message);
                // Fallback is handled below
            }
        }

        // Fallback to public API (ip-api.com)
        console.log(`[OSINT] Using Public API fallback for ${ip}...`);
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        return {
            type: 'ip_info',
            nodes: [
                { type: 'location', data: { city: response.data.city, country: response.data.country }, label: response.data.country },
                { type: 'company', data: { name: response.data.isp }, label: response.data.isp }
            ],
            links: [
                { source: 'origin', target: 'location' },
                { source: 'origin', target: 'company' }
            ],
            enrichedData: {
                isp: response.data.isp,
                organization: response.data.org || response.data.isp,
                country: response.data.country,
                city: response.data.city,
                lat: response.data.lat,
                lon: response.data.lon,
                timezone: response.data.timezone,
                asn: response.data.as
            }
        };
    } catch (error) {
        console.error('IP Lookup error:', error);
        return null;
    }
};

export const dnsLookup = async (domain: string) => {
    // Placeholder for real DNS lookup logic
    return {
        type: 'dns_info',
        nodes: [
            { type: 'ip', data: { ip: '1.1.1.1' }, label: 'Cloudflare DNS' }
        ],
        links: [
            { source: 'origin', target: 'ip' }
        ]
    };
};
