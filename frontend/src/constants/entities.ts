import {
    User, Mail, Phone, Globe, CreditCard, MapPin, Link as LinkIcon,
    Trash2, Save, Upload, ZoomIn, ZoomOut,
    Move, Shield, FileText, MousePointer2, Eraser, Search,
    Smartphone, Server, Building, X,
    GitBranch, CircleDot, Grid, Eye, EyeOff, Edit3,
    Coins, AtSign, Camera, Download, ChevronDown, FolderOpen,
    Bitcoin, Landmark, Network
} from 'lucide-react';

export const ENTITY_CONFIG: any = {
    target: {
        label: 'OBJETIVO',
        color: '#ef4444',
        icon: User,
        fields: [
            { key: 'name', label: 'Nombre Completo' },
            { key: 'alias', label: 'Alias / Apodo' },
            { key: 'dob', label: 'Fecha de Nacimiento' },
            { key: 'cob', label: 'Lugar de Nacimiento' },
            { key: 'national_id', label: 'DNI / Pasaporte' },
            { key: 'nationality', label: 'Nacionalidad' },
            { key: 'gender', label: 'Género' },
            { key: 'occupation', label: 'Ocupación' },
            { key: 'employer', label: 'Empleador' },
            { key: 'notes', label: 'Notas de Inteligencia' },
            { key: 'risk_score', label: 'Nivel de Riesgo (0-100)' },
            { key: 'last_seen', label: 'Última vez visto' },
            { key: 'status', label: 'Estado (Activo/Inactivo)' },
            { key: 'tags', label: 'Etiquetas (CSV)' }
        ]
    },
    ip: {
        label: 'DIRECCIÓN IP',
        color: '#06b6d4',
        icon: Network,
        fields: [
            { key: 'ip', label: 'Dirección IP' },
            { key: 'version', label: 'Versión (IPv4/IPv6)' },
            { key: 'asn', label: 'ASN' },
            { key: 'isp', label: 'Proveedor ISP' },
            { key: 'organization', label: 'Organización' },
            { key: 'country', label: 'País' },
            { key: 'city', label: 'Ciudad' },
            { key: 'lat', label: 'Latitud' },
            { key: 'lon', label: 'Longitud' },
            { key: 'timezone', label: 'Zona Horaria' },
            { key: 'ports', label: 'Puertos Abiertos' },
            { key: 'os', label: 'Sistema Operativo' },
            { key: 'vulns', label: 'Vulnerabilidades' },
            { key: 'reverse_dns', label: 'Reverse DNS' },
            { key: 'proxy', label: 'Es Proxy/VPN?' },
            { key: 'tor', label: 'Es Nodo Tor?' },
            { key: 'risk_score', label: 'AbuseIPDB Score' }
        ]
    },
    email: {
        label: 'EMAIL',
        color: '#eab308',
        icon: Mail,
        fields: [
            { key: 'email', label: 'Dirección de Email' },
            { key: 'provider', label: 'Proveedor' },
            { key: 'disposable', label: 'Es Desechable?' },
            { key: 'breached', label: 'Aparece en Brechas?' },
            { key: 'last_breach', label: 'Fecha Última Brecha' },
            { key: 'password_hash', label: 'Hash Conocido' },
            { key: 'social_profiles', label: 'Perfiles Sociales' },
            { key: 'gravatar', label: 'Tiene Gravatar?' },
            { key: 'domain_age', label: 'Antigüedad Dominio' }
        ]
    },
    phone: {
        label: 'TELÉFONO',
        color: '#22c55e',
        icon: Phone,
        fields: [
            { key: 'number', label: 'Número' },
            { key: 'country_code', label: 'Código País' },
            { key: 'carrier', label: 'Operador' },
            { key: 'line_type', label: 'Tipo (Móvil/Fijo)' },
            { key: 'whatsapp', label: 'Tiene WhatsApp?' },
            { key: 'telegram', label: 'Tiene Telegram?' },
            { key: 'cnam', label: 'Caller ID Name' },
            { key: 'location', label: 'Ubicación Aproximada' }
        ]
    },
    domain: {
        label: 'DOMINIO',
        color: '#8b5cf6',
        icon: Globe,
        fields: [
            { key: 'domain', label: 'Nombre de Dominio' },
            { key: 'registrar', label: 'Registrador' },
            { key: 'creation_date', label: 'Fecha Creación' },
            { key: 'expiry_date', label: 'Fecha Expiración' },
            { key: 'servers', label: 'Nameservers' },
            { key: 'whois_privacy', label: 'Whois Privacy?' },
            { key: 'subdomains', label: 'Subdominios Conocidos' },
            { key: 'ssl_issuer', label: 'Emisor SSL' },
            { key: 'mx_records', label: 'Registros MX' }
        ]
    },
    crypto: {
        label: 'CRYPTO WALLET',
        color: '#f97316',
        icon: Bitcoin,
        fields: [
            { key: 'address', label: 'Dirección Wallet' },
            { key: 'currency', label: 'Moneda (BTC/ETH...)' },
            { key: 'balance', label: 'Saldo Actual' },
            { key: 'total_received', label: 'Total Recibido' },
            { key: 'total_sent', label: 'Total Enviado' },
            { key: 'first_tx', label: 'Primera Transacción' },
            { key: 'last_tx', label: 'Última Transacción' },
            { key: 'risk_level', label: 'Nivel Riesgo AML' },
            { key: 'entity', label: 'Entidad Conocida' }
        ]
    },
    identity: {
        label: 'IDENTIDAD SOCIAL',
        color: '#ec4899',
        icon: Smartphone,
        fields: [
            { key: 'platform', label: 'Plataforma' },
            { key: 'username', label: 'Usuario / Handle' },
            { key: 'userid', label: 'User ID' },
            { key: 'url', label: 'URL Perfil' },
            { key: 'bio', label: 'Biografía' },
            { key: 'followers', label: 'Seguidores' },
            { key: 'following', label: 'Siguiendo' },
            { key: 'creation_date', label: 'Fecha Creación' },
            { key: 'verified', label: 'Verificado?' }
        ]
    },
    bank: {
        label: 'CUENTA BANCARIA',
        color: '#64748b',
        icon: Landmark,
        fields: [
            { key: 'iban', label: 'IBAN / Número' },
            { key: 'swift', label: 'SWIFT / BIC' },
            { key: 'bank_name', label: 'Banco' },
            { key: 'holder', label: 'Titular' },
            { key: 'country', label: 'País' },
            { key: 'currency', label: 'Moneda' },
            { key: 'branch', label: 'Sucursal' }
        ]
    },
    location: {
        label: 'UBICACIÓN',
        color: '#10b981',
        icon: MapPin,
        fields: [
            { key: 'city', label: 'Ciudad' },
            { key: 'country', label: 'País' },
            { key: 'lat', label: 'Latitud' },
            { key: 'lon', label: 'Longitud' },
            { key: 'zip', label: 'Código Postal' },
            { key: 'timezone', label: 'Zona Horaria' }
        ]
    },
    company: {
        label: 'ORGANIZACIÓN',
        color: '#f59e0b',
        icon: Building,
        fields: [
            { key: 'name', label: 'Nombre' },
            { key: 'asn', label: 'ASN' },
            { key: 'isp', label: 'ISP' },
            { key: 'domain', label: 'Dominio Web' },
            { key: 'registry', label: 'Registro' }
        ]
    },
    server: {
        label: 'SERVIDOR / SERVICIO',
        color: '#6366f1',
        icon: Server,
        fields: [
            { key: 'ports', label: 'Puertos Abiertos' },
            { key: 'os', label: 'Sistema Operativo' },
            { key: 'vulns', label: 'Vulnerabilidades' },
            { key: 'banner', label: 'Banner Service' },
            { key: 'cpe', label: 'CPE' }
        ]
    }
};
