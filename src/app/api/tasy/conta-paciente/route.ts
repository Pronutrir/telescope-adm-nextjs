import { NextRequest, NextResponse } from 'next/server'

const TASY_API_BASE = process.env.TASY_API_URL || 'https://localhost:44326/api/v2'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const numeroAtendimento = searchParams.get('numeroAtendimento')

        if (!numeroAtendimento) {
            return NextResponse.json(
                { error: 'Número de atendimento é obrigatório' },
                { status: 400 }
            )
        }

        console.log(`🔍 Buscando conta paciente para atendimento: ${numeroAtendimento}`)

        const response = await fetch(
            `${TASY_API_BASE}/ContaPaciente/GetContaPaciente?Numero_Atendimento=${numeroAtendimento}`,
            {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(10000) // 10 segundos de timeout
            }
        )

        if (!response.ok) {
            console.error('❌ Erro na API TASY:', response.status, response.statusText)
            return NextResponse.json(
                { error: 'Erro ao buscar conta do paciente' },
                { status: response.status }
            )
        }

        const contaPaciente = await response.text() // A API retorna apenas o número como string
        
        // Simular múltiplas contas para alguns números específicos (para teste)
        // Em produção, isso viria da API real
        if (numeroAtendimento === '350991') {
            console.log(`✅ Múltiplas contas encontradas para ${numeroAtendimento}: [2549371, 2614471]`)
            return NextResponse.json({
                numeroAtendimento,
                contasPaciente: ['2549371', '2614471'] // Array de contas
            })
        } else if (numeroAtendimento === '350992') {
            console.log(`✅ Múltiplas contas encontradas para ${numeroAtendimento}: [2549887, 2539471, 2651234]`)
            return NextResponse.json({
                numeroAtendimento,
                contasPaciente: ['2549887', '2539471', '2651234'] // Array de contas
            })
        }
        
        console.log(`✅ Conta única encontrada: ${contaPaciente}`)

        return NextResponse.json({
            numeroAtendimento,
            contaPaciente: contaPaciente.replace(/"/g, ''), // Remove aspas se houver
        })

    } catch (error) {
        console.error('❌ Erro ao buscar conta paciente:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
