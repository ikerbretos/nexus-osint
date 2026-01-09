import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { ipLookup, dnsLookup, emailLookup, phoneLookup } from './modules/osint';

// --- NEW PLUGIN SYSTEM IMPORTS ---
import { pluginManager } from './modules/core/PluginRegistry';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// --- CONFIGURACIÓN DE SEGURIDAD (CORS) ---
// Solo permitimos peticiones desde estas direcciones exactas:
const allowedOrigins = [
    'https://zahori-osint-0yb6.onrender.com', // Tu URL de producción (Frontend)
    'http://localhost:5173',                  // Tu entorno local (Vite)
    'http://localhost:3000'                   // Por si acaso usas otro puerto local
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como las de Postman o apps móviles)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            // Si el origen NO está en la lista, bloqueamos
            const msg = 'La política CORS de este sitio no permite acceso desde el origen especificado.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true // Permite cookies si las necesitaras en el futuro
}));

app.use(express.json());

// Cases
app.get('/api/cases', async (req, res) => {
    try {
        const cases = await prisma.case.findMany({
            include: { _count: { select: { nodes: true, links: true } } }
        });
        res.json(cases);
    } catch (error) {
        console.error("Error fetching cases:", error);
        res.status(500).json({ error: "Error al conectar con la base de datos" });
    }
});

app.post('/api/cases', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCase = await prisma.case.create({
            data: { name, description }
        });
        res.json(newCase);
    } catch (error) {
        console.error("Error creating case:", error);
        res.status(500).json({ error: "Error creando el caso" });
    }
});

app.get('/api/cases/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const caseData = await prisma.case.findUnique({
            where: { id },
            include: { nodes: true, links: true }
        });
        res.json(caseData);
    } catch (error) {
        res.status(500).json({ error: "Error fetching case details" });
    }
});

// Update Case Graph
app.post('/api/cases/:id/graph', async (req, res) => {
    const { id } = req.params;
    const { nodes, links } = req.body;

    try {
        await prisma.$transaction([
            prisma.node.deleteMany({ where: { caseId: id } }),
            prisma.link.deleteMany({ where: { caseId: id } }),
            prisma.node.createMany({
                data: nodes.map((n: any) => ({
                    id: n.id,
                    type: n.type,
                    data: JSON.stringify(n.data),
                    notes: n.notes || '',
                    x: n.x,
                    y: n.y,
                    caseId: id
                }))
            }),
            prisma.link.createMany({
                data: links.map((l: any) => ({
                    id: l.id,
                    source: l.source,
                    target: l.target,
                    caseId: id
                }))
            })
        ]);

        res.json({ success: true });
    } catch (error) {
        console.error("Error saving graph:", error);
        res.status(500).json({ error: "Failed to save graph" });
    }
});

// OSINT Enrichment
app.post('/api/enrich', async (req, res) => {
    const { nodeId, type, searchValue, apiKeys } = req.body;
    let result = null;

    console.log(`[API] Enrichment request for type: ${type}, value: ${searchValue}`);

    try {
        if (type === 'ip') {
            result = await ipLookup(searchValue, apiKeys?.shodan, apiKeys?.abuseipdb, apiKeys?.virustotal);
        } else if (type === 'domain') {
            result = await dnsLookup(searchValue);
        } else if (type === 'email') {
            result = await emailLookup(searchValue, apiKeys?.hunter);
        } else if (type === 'phone') {
            result = await phoneLookup(searchValue, apiKeys?.numverify);
        }
        res.json({ success: !!result, result });
    } catch (error) {
        console.error("Enrichment error:", error);
        res.status(500).json({ success: false, error: "Enrichment failed" });
    }
});

// --- NEW PLUGIN SYSTEM API ---

// Get available plugins for a type
app.get('/api/plugins', (req, res) => {
    const { type } = req.query;
    if (type) {
        const plugins = pluginManager.getPluginsForType(String(type));
        res.json(plugins.map(p => ({
            name: p.name,
            description: p.description,
            cost: p.cost,
            author: p.author
        })));
    } else {
        res.json([]);
    }
});

// Execute a plugin on a node
app.post('/api/expand', async (req, res) => {
    const { nodeId, pluginName, config } = req.body;

    try {
        // 1. Fetch Node from DB
        const node = await prisma.node.findUnique({ where: { id: nodeId } });

        if (!node) {
            return res.status(404).json({ error: "Node not found" });
        }

        // 2. Execute Plugin
        const results = await pluginManager.executePlugin(pluginName, node, config);

        // 3. Save Results Transcationally
        const caseId = node.caseId;

        const createdNodes = [];
        const createdLinks = [];

        await prisma.$transaction(async (tx) => {
            for (const n of results.newNodes) {
                const created = await tx.node.create({
                    data: {
                        id: n.id,
                        type: n.type!,
                        data: n.data!,
                        x: n.x!,
                        y: n.y!,
                        caseId: caseId
                    }
                });
                createdNodes.push(created);
            }

            for (const l of results.newLinks) {
                const created = await tx.link.create({
                    data: {
                        source: l.source!,
                        target: l.target!,
                        caseId: caseId
                    }
                });
                createdLinks.push(created);
            }
        });

        res.json({
            success: true,
            logs: results.logs,
            newNodesCount: createdNodes.length,
            newLinksCount: createdLinks.length
        });

    } catch (error: any) {
        console.error("Plugin Execution Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
