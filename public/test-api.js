console.log('🧪 Testando APIs...')

// Testar status
fetch('/api/sharepoint/status')
    .then(response => {
        console.log('✅ Status API Response:', response.status, response.ok)
        return response.json()
    })
    .then(data => console.log('📊 Status Data:', data))
    .catch(error => console.error('❌ Status Error:', error))

// Testar listagem
fetch('/api/sharepoint/pdfs')
    .then(response => {
        console.log('✅ PDFs API Response:', response.status, response.ok)
        return response.json()
    })
    .then(data => console.log('📊 PDFs Data:', Array.isArray(data) ? `${data.length} PDFs` : data))
    .catch(error => console.error('❌ PDFs Error:', error))
