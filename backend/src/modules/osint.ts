import axios from 'axios';
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);
const resolveMx = promisify(dns.resolveMx);
const resolveNs = promisify(dns.resolveNs);
const resolveTxt = promisify(dns.resolveTxt);

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

export const ipLookup = async (ip: string, shodanKey?: string, abuseipdbKey?: string) => {
    try {
        let enrichedData: any = {
            last_update: new Date().toISOString()
        };

        // 1. Shodan Lookup
        if (shodanKey) {
            try {
                console.log(`[OSINT] Querying Shodan for ${ip}...`);
                const response = await axios.get<ShodanHost>(`https://api.shodan.io/shodan/host/${ip}?key=${shodanKey}`);
                const data = response.data;
                Object.assign(enrichedData, {
                    asn: data.asn,
                    isp: data.isp,
                    organization: data.org || data.isp,
                    country: data.country_name,
                    city: data.city,
                    lat: data.latitude,
                    lon: data.longitude,
                    ports: data.ports?.join(', '),
                    os: data.os,
                    vulns: data.vulns?.join(', ')
                });
            } catch (err: any) {
                console.error("Shodan Request Failed:", err.response?.data?.error || err.message);
            }
        }

        // 2. AbuseIPDB Lookup
        if (abuseipdbKey) {
            try {
                console.log(`[OSINT] Querying AbuseIPDB for ${ip}...`);
                const response = await axios.get(`https://api.abuseipdb.com/api/v2/check`, {
                    params: { ipAddress: ip, maxAgeInDays: 90 },
                    headers: { 'Key': abuseipdbKey, 'Accept': 'application/json' }
                });
                const data = response.data.data;
                Object.assign(enrichedData, {
                    risk_score: data.abuseConfidenceScore,
                    total_reports: data.totalReports,
                    last_report: data.lastReportedAt,
                    usage_type: data.usageType,
                    domain: data.domain
                });
            } catch (err: any) {
                console.error("AbuseIPDB Request Failed:", err.response?.data?.error || err.message);
            }
        }

        // 3. Fallback to public API if basic info missing
        if (!enrichedData.country) {
            console.log(`[OSINT] Using Public API fallback for ${ip}...`);
            try {
                const response = await axios.get(`http://ip-api.com/json/${ip}`);
                Object.assign(enrichedData, {
                    isp: response.data.isp,
                    organization: response.data.org || response.data.isp,
                    country: response.data.country,
                    city: response.data.city,
                    lat: response.data.lat,
                    lon: response.data.lon,
                    timezone: response.data.timezone,
                    asn: response.data.as
                });
            } catch (e) {
                console.error("Public API Fallback Failed");
            }
        }

        return {
            type: 'ip_info',
            nodes: [],
            links: [],
            enrichedData
        };
    } catch (error) {
        console.error('IP Lookup error:', error);
        return null;
    }
};

export const dnsLookup = async (domain: string) => {
    try {
        console.log(`[OSINT] Querying DNS for ${domain}...`);

        const enrichedData: any = {
            domain,
            last_update: new Date().toISOString()
        };

        // 1. Resolve A Records (IPs)
        try {
            const ips = await resolve4(domain);
            enrichedData.ips = ips.join(', ');
        } catch (e) {
            console.log(`No A records for ${domain}`);
        }

        // 2. Resolve MX Records (Mail Servers)
        try {
            const mx = await resolveMx(domain);
            enrichedData.mx_records = mx.map(m => `${m.exchange} (${m.priority})`).join(', ');
        } catch (e) {
            console.log(`No MX records for ${domain}`);
        }

        // 3. Resolve NS Records (Name Servers)
        try {
            const ns = await resolveNs(domain);
            enrichedData.servers = ns.join(', ');
        } catch (e) {
            console.log(`No NS records for ${domain}`);
        }

        // 4. Resolve TXT Records
        try {
            const txt = await resolveTxt(domain);
            const flatTxt = txt.flat();
            if (flatTxt.length > 0) {
                enrichedData.txt_records = flatTxt.join(' | ');
            }
        } catch (e) {
            console.log(`No TXT records for ${domain}`);
        }

        // 5. WHOIS via RDAP (Free, no API key)
        try {
            console.log(`[OSINT] Querying RDAP for ${domain}...`);
            const rdapResponse = await axios.get(`https://rdap.org/domain/${domain}`);
            if (rdapResponse.data) {
                const data = rdapResponse.data;
                enrichedData.registrar = data.entities?.[0]?.vcardArray?.[1]?.find((x: any) => x[0] === 'fn')?.[3] || 'Unknown';

                // Extract events (creation, expiry)
                const events = data.events || [];
                const creation = events.find((e: any) => e.eventAction === 'registration');
                const expiry = events.find((e: any) => e.eventAction === 'expiration');

                if (creation) enrichedData.creation_date = creation.eventDate;
                if (expiry) enrichedData.expiry_date = expiry.eventDate;

                // Status
                if (data.status) enrichedData.status = data.status.join(', ');
            }
        } catch (e) {
            console.log(`RDAP lookup failed for ${domain}`);
        }

        return {
            type: 'dns_info',
            nodes: [],
            links: [],
            enrichedData
        };
    } catch (error) {
        console.error('DNS Lookup error:', error);
        return null;
    }
};

export const emailLookup = async (email: string, hunterKey?: string) => {
    try {
        console.log(`[OSINT] Enriching Email: ${email}...`);
        const [user, domain] = email.split('@');

        let enrichedData: any = {
            email,
            user,
            domain,
            status: 'Analizado',
            last_update: new Date().toISOString()
        };

        if (hunterKey) {
            try {
                console.log(`[OSINT] Querying Hunter.io for ${email}...`);
                const response = await axios.get(`https://api.hunter.io/v2/email-verifier`, {
                    params: { email, api_key: hunterKey }
                });
                if (response.data && response.data.data) {
                    const data = response.data.data;
                    Object.assign(enrichedData, {
                        status: data.result === 'deliverable' ? 'Válido' : 'Riesgoso',
                        score: data.score,
                        provider: data.gibberish ? 'Desconocido' : 'Corporativo/Personal',
                        disposable: data.disposable ? 'Sí' : 'No',
                        webmail: data.webmail ? 'Sí' : 'No'
                    });
                }
            } catch (err: any) {
                console.error("Hunter.io Request Failed:", err.message);
            }
        }

        if (!enrichedData.score) {
            enrichedData.leaks = 'No se detectaron (Requiere API Key para búsqueda profunda)';
        }

        return {
            type: 'email_info',
            nodes: [],
            links: [],
            enrichedData
        };
    } catch (error) {
        console.error('Email Lookup error:', error);
        return null;
    }
};

export const phoneLookup = async (phone: string, numverifyKey?: string) => {
    try {
        console.log(`[OSINT] Enriching Phone: ${phone}...`);

        let enrichedData: any = {
            phone,
            last_update: new Date().toISOString()
        };

        if (numverifyKey) {
            try {
                console.log(`[OSINT] Querying Numverify for ${phone}...`);
                const response = await axios.get(`http://apilayer.net/api/validate`, {
                    params: {
                        access_key: numverifyKey,
                        number: phone,
                        format: 1
                    }
                });

                if (response.data && response.data.valid) {
                    const data = response.data;
                    Object.assign(enrichedData, {
                        countryCode: data.country_prefix,
                        country: data.country_name,
                        location: data.location,
                        carrier: data.carrier,
                        type: data.line_type,
                        valid: data.valid ? 'Yes' : 'No'
                    });
                } else {
                    console.log(`Numverify returned invalid or error:`, response.data.error || 'Invalid number');
                }
            } catch (err: any) {
                console.error("Numverify Request Failed:", err.message);
            }
        }

        // Basic pattern matching for fallback if no API key or API failed
        if (!enrichedData.carrier) {
            const countryCode = phone.startsWith('+') ? phone.slice(0, 3) : 'Unknown';
            Object.assign(enrichedData, {
                countryCode,
                carrier: 'No se pudo detectar (Requiere API Key)',
                type: 'Desconocido',
                status: 'Análisis Básico'
            });
        }

        return {
            type: 'phone_info',
            nodes: [],
            links: [],
            enrichedData
        };
    } catch (error) {
        console.error('Phone Lookup error:', error);
        return null;
    }
};
