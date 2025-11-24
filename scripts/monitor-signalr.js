const signalR = require("@microsoft/signalr");
const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '../.env.local') });

// Configurações
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br';
const USERSHIELD_USERNAME = process.env.USERSHIELD_USERNAME;
const USERSHIELD_PASSWORD = process.env.USERSHIELD_PASSWORD;

if (!USERSHIELD_USERNAME || !USERSHIELD_PASSWORD) {
    console.error("❌ Erro: Credenciais USERSHIELD_USERNAME e USERSHIELD_PASSWORD não encontradas no .env");
    process.exit(1);
}

async function getToken() {
    try {
        console.log(`🔄 Autenticando em ${API_BASE_URL}/usershield/api/v1/Auth/login...`);
        const response = await axios.post(`${API_BASE_URL}/usershield/api/v1/Auth/login`, {
            userName: USERSHIELD_USERNAME,
            password: USERSHIELD_PASSWORD
        });

        const token = response.data.token || response.data.jwtToken;
        if (!token) throw new Error("Token não encontrado na resposta");
        
        console.log("✅ Token obtido com sucesso!");
        return token;
    } catch (error) {
        console.error("❌ Erro na autenticação:", error.message);
        if (error.response) {
            console.error("Detalhes:", error.response.data);
        }
        process.exit(1);
    }
}

async function start() {
    const token = await getToken();
    const hubUrl = `${API_BASE_URL}/apitasy/notify-hub`;

    console.log(`🔄 Conectando ao SignalR Hub: ${hubUrl}...`);

    const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("ReceiveMessage", (message) => {
        console.log("\n📨 [ReceiveMessage] Mensagem recebida:");
        if (typeof message === 'string') {
            try {
                const parsed = JSON.parse(message);
                console.log(JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.log(message);
            }
        } else {
            console.log(JSON.stringify(message, null, 2));
        }
    });

    try {
        await connection.start();
        console.log(`✅ Conectado ao SignalR! ID: ${connection.connectionId}`);
        console.log("📡 Aguardando mensagens... (Pressione Ctrl+C para sair)");
    } catch (err) {
        console.error("❌ Erro ao conectar:", err);
    }
}

start();
