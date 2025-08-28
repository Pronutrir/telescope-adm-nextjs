import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, 'GET', resolvedParams.path)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, 'POST', resolvedParams.path)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, 'PUT', resolvedParams.path)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return handleRequest(request, 'DELETE', resolvedParams.path)
}

async function handleRequest(
  request: NextRequest,
  method: string,
  pathSegments: string[]
) {
  try {
    // Obter token do cookie
    const token = request.cookies.get('token')?.value

    // Construir URL da API
    const apiPath = pathSegments.join('/')
    const url = `${API_BASE_URL}/apitasy/api/v1/${apiPath}`

    // Preparar headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Preparar body se necessário
    let body: string | undefined
    if (method !== 'GET' && method !== 'DELETE') {
      const requestBody = await request.text()
      if (requestBody) {
        body = requestBody
      }
    }

    // Fazer a requisição
    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    const data = await response.text()
    let jsonData

    try {
      jsonData = JSON.parse(data)
    } catch {
      jsonData = { message: data }
    }

    return NextResponse.json(jsonData, { status: response.status })
  } catch (error) {
    console.error('Erro na API proxy:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
