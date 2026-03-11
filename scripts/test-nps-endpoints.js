/**
 * Teste de endpoints NPS Consultas
 * Testa todos os GET endpoints implementados em npsConsultaService.ts
 * POST endpoints são listados mas NÃO executados (para não alterar dados)
 *
 * Uso: node scripts/test-nps-endpoints.js
 */

const axios = require('axios')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'
const USERNAME = process.env.USERSHIELD_USERNAME
const PASSWORD = process.env.USERSHIELD_PASSWORD

if (!USERNAME || !PASSWORD) {
  console.error('❌ USERSHIELD_USERNAME e USERSHIELD_PASSWORD não encontrados no .env')
  process.exit(1)
}

// Base URLs dos serviços (resolve igual ao código em api.ts)
const apitasyUrl = process.env.NEXT_PUBLIC_APITASY_URL || `${API_BASE_URL}/apitasy`
const apitasyRaw = new URL(apitasyUrl).pathname.replace(/\/+$/, '')
const apitasyBase = apitasyRaw.replace(/\/api(\/v1)?$/, '')
const TASY_BASE = `${API_BASE_URL}${apitasyBase}/api/v1`
const NOTIFY_BASE = `${API_BASE_URL}/notify/api/v1`

// Datas de teste
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const TEST_DATE = yesterday.toISOString().split('T')[0]
const endDate = new Date().toISOString().split('T')[0]
const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

let token = null
let passed = 0
let failed = 0
let skipped = 0

async function authenticate() {
  console.log(`\n🔐 Autenticando em ${API_BASE_URL}/usershield/api/v1/Auth/login...`)
  const res = await axios.post(`${API_BASE_URL}/usershield/api/v1/Auth/login`, {
    userName: USERNAME,
    password: PASSWORD,
  })
  token = res.data.token || res.data.jwtToken
  if (!token) throw new Error('Token não encontrado na resposta de login')
  console.log('✅ Token obtido com sucesso!\n')
}

function headers() {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

async function testEndpoint(name, method, baseUrl, endpoint, { validate, skip } = {}) {
  const fullUrl = `${baseUrl}/${endpoint}`
  const prefix = `[${method.toUpperCase()}]`

  if (skip) {
    console.log(`⏭️  ${prefix} ${name}`)
    console.log(`   URL: ${fullUrl}`)
    console.log(`   ⚠️  Pulado (POST - não altera dados em teste)\n`)
    skipped++
    return
  }

  try {
    const res = await axios({ method, url: fullUrl, headers: headers(), timeout: 20000 })
    const status = res.status
    const dataType = Array.isArray(res.data) ? `Array[${res.data.length}]` : typeof res.data
    const isValid = validate ? validate(res.data) : true

    if (status >= 200 && status < 300 && isValid) {
      console.log(`✅ ${prefix} ${name}`)
      console.log(`   URL: ${fullUrl}`)
      console.log(`   Status: ${status} | Tipo: ${dataType}`)
      if (Array.isArray(res.data) && res.data.length > 0) {
        console.log(`   Amostra keys: [${Object.keys(res.data[0]).slice(0, 6).join(', ')}]`)
      } else if (typeof res.data === 'object' && res.data !== null && !Array.isArray(res.data)) {
        console.log(`   Keys: [${Object.keys(res.data).slice(0, 8).join(', ')}]`)
      }
      console.log()
      passed++
    } else {
      console.log(`⚠️  ${prefix} ${name}`)
      console.log(`   URL: ${fullUrl}`)
      console.log(`   Status: ${status} | Validação: ${isValid ? 'OK' : 'FALHA'}`)
      console.log()
      failed++
    }
  } catch (err) {
    const status = err.response?.status || 'TIMEOUT'
    const msg = err.response?.data?.message || err.response?.data?.title || err.message
    console.log(`❌ ${prefix} ${name}`)
    console.log(`   URL: ${fullUrl}`)
    console.log(`   Status: ${status} | Erro: ${msg}`)
    console.log()
    failed++
  }
}

async function run() {
  console.log('='.repeat(70))
  console.log('  🔭 Telescope ADM - Teste de Endpoints NPS Consultas')
  console.log('='.repeat(70))
  console.log(`  TASY_BASE:   ${TASY_BASE}`)
  console.log(`  NOTIFY_BASE: ${NOTIFY_BASE}`)

  await authenticate()

  console.log('-'.repeat(70))
  console.log('  📡 ApiNotify endpoints (Notify)')
  console.log('-'.repeat(70) + '\n')

  await testEndpoint('getListaNps', 'get', NOTIFY_BASE,
    `Nps/GetListNpsConsulta?querydate=${TEST_DATE}`,
    { validate: (d) => Array.isArray(d) })

  await testEndpoint('getClassificationsTypes', 'get', NOTIFY_BASE,
    'ValorDominio/1',
    { validate: (d) => Array.isArray(d) })

  await testEndpoint('getSubclassifications', 'get', NOTIFY_BASE,
    'ValorDominio/GetByIdAndRefValorDominio/2,1',
    { validate: (d) => Array.isArray(d) })

  await testEndpoint('getClassificationsDashboardValues', 'get', NOTIFY_BASE,
    `NpsClassification/GetClassificationDashboardValues?startDate=${startDate}&endDate=${endDate}&estabelecimento=1`)

  await testEndpoint('getSubclassificationsDashboardValues', 'get', NOTIFY_BASE,
    `NpsClassification/GetSubclassificationDashboardValues?startDate=${startDate}&endDate=${endDate}&estabelecimento=1`,
    { validate: (d) => Array.isArray(d) })

  await testEndpoint('getClassificationHistory', 'get', NOTIFY_BASE,
    'NpsClassification/ListClassificationsByNpsConsultaId/00000000-0000-0000-0000-000000000000')

  // POST endpoints (skip)
  console.log('-'.repeat(70))
  console.log('  📤 POST endpoints (não executados)')
  console.log('-'.repeat(70) + '\n')

  await testEndpoint('postDefaultMessages', 'post', NOTIFY_BASE,
    'Nps/SendDefaultNpsResponseAgendaConsultaMessageWhatsapp', { skip: true })
  await testEndpoint('postCustomMessage', 'post', NOTIFY_BASE,
    'Nps/send/SendWhatsResponseConsultaNpsAppMessage', { skip: true })
  await testEndpoint('postCustomMessage72h', 'post', NOTIFY_BASE,
    'Nps/SendTemplateNpsResponseAgendaConsultaMessageWhatsapp', { skip: true })
  await testEndpoint('postClassification', 'post', NOTIFY_BASE,
    'NpsClassification/AddClassification', { skip: true })

  console.log('-'.repeat(70))
  console.log('  📡 Api (Tasy) endpoints')
  console.log('-'.repeat(70) + '\n')

  await testEndpoint('getMedicos', 'get', TASY_BASE,
    'Medicos/FiltrarMedicosEmGeral',
    { validate: (d) => d?.result && Array.isArray(d.result) })

  await testEndpoint('getConvenios', 'get', TASY_BASE,
    'Convenios',
    { validate: (d) => d?.result && Array.isArray(d.result) })

  await testEndpoint('getEspecialidades', 'get', TASY_BASE,
    'EspecialidadeMedica/ListarTodasEspecialidadesMedicas',
    { validate: (d) => d?.result && Array.isArray(d.result) })

  // Resumo
  console.log('='.repeat(70))
  console.log(`  📊 RESULTADO: ✅ ${passed} ok | ❌ ${failed} falha | ⏭️  ${skipped} pulados`)
  console.log('='.repeat(70))

  if (failed > 0) process.exit(1)
}

run().catch((err) => {
  console.error('\n💥 Erro fatal:', err.message)
  process.exit(1)
})
