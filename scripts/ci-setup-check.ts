#!/usr/bin/env tsx

/**
 * Script para configurar o ambiente de CI/CD
 * Verifica se todas as dependências estão prontas para o pipeline
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface CICheck {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  required: boolean
}

class CISetupValidator {
  private checks: CICheck[] = []
  private projectRoot: string

  constructor() {
    this.projectRoot = process.cwd()
  }

  async validateSetup(): Promise<void> {
    console.log('🔍 Validando configuração do CI/CD Pipeline...\n')

    // Verificações básicas
    this.checkPackageJson()
    this.checkWorkflowFiles()
    this.checkDockerfile()
    this.checkEnvironmentFiles()
    this.checkTestConfiguration()
    this.checkRedisConfiguration()
    this.checkDependencies()

    // Exibir resultados
    this.displayResults()
    
    // Status final
    const failedChecks = this.checks.filter(c => c.status === 'fail' && c.required)
    const warningChecks = this.checks.filter(c => c.status === 'warning')
    
    if (failedChecks.length > 0) {
      console.log('\n❌ Configuração incompleta! Corrija os erros antes de usar o pipeline.')
      process.exit(1)
    } else if (warningChecks.length > 0) {
      console.log('\n⚠️  Configuração OK com avisos. Pipeline funcionará, mas considere corrigir os avisos.')
      process.exit(0)
    } else {
      console.log('\n✅ Configuração perfeita! Pipeline pronto para uso.')
      process.exit(0)
    }
  }

  private checkPackageJson(): void {
    const packagePath = join(this.projectRoot, 'package.json')
    
    if (!existsSync(packagePath)) {
      this.addCheck('Package.json', 'fail', 'Arquivo package.json não encontrado', true)
      return
    }

    try {
      const packageContent = JSON.parse(readFileSync(packagePath, 'utf8'))
      
      // Verificar scripts necessários
      const requiredScripts = ['build', 'lint', 'test:redis:local', 'test:redis:all']
      const missingScripts = requiredScripts.filter(script => !packageContent.scripts?.[script])
      
      if (missingScripts.length > 0) {
        this.addCheck('NPM Scripts', 'fail', `Scripts faltando: ${missingScripts.join(', ')}`, true)
      } else {
        this.addCheck('NPM Scripts', 'pass', 'Todos os scripts necessários encontrados', true)
      }

      // Verificar dependências críticas
      const criticalDeps = ['next', 'react', 'ioredis', 'tsx']
      const missingDeps = criticalDeps.filter(dep => 
        !packageContent.dependencies?.[dep] && !packageContent.devDependencies?.[dep]
      )

      if (missingDeps.length > 0) {
        this.addCheck('Dependências', 'fail', `Dependências faltando: ${missingDeps.join(', ')}`, true)
      } else {
        this.addCheck('Dependências', 'pass', 'Dependências críticas encontradas', true)
      }

    } catch (error) {
      this.addCheck('Package.json', 'fail', 'Erro ao ler package.json', true)
    }
  }

  private checkWorkflowFiles(): void {
    const workflowPath = join(this.projectRoot, '.github/workflows/ci-cd.yml')
    
    if (!existsSync(workflowPath)) {
      this.addCheck('GitHub Workflow', 'fail', 'Arquivo .github/workflows/ci-cd.yml não encontrado', true)
      return
    }

    try {
      const content = readFileSync(workflowPath, 'utf8')
      
      // Verificar jobs essenciais
      const essentialJobs = ['quality', 'security', 'redis-tests', 'unit-tests', 'build']
      const missingJobs = essentialJobs.filter(job => !content.includes(`${job}:`))
      
      if (missingJobs.length > 0) {
        this.addCheck('Workflow Jobs', 'warning', `Jobs faltando: ${missingJobs.join(', ')}`, false)
      } else {
        this.addCheck('Workflow Jobs', 'pass', 'Todos os jobs essenciais configurados', true)
      }

    } catch (error) {
      this.addCheck('GitHub Workflow', 'fail', 'Erro ao ler workflow', true)
    }
  }

  private checkDockerfile(): void {
    const dockerPath = join(this.projectRoot, 'Dockerfile')
    
    if (!existsSync(dockerPath)) {
      this.addCheck('Dockerfile', 'warning', 'Dockerfile não encontrado (opcional para CI)', false)
      return
    }

    try {
      const content = readFileSync(dockerPath, 'utf8')
      
      if (content.includes('node:20') || content.includes('node:18')) {
        this.addCheck('Dockerfile', 'pass', 'Dockerfile com versão Node.js adequada', false)
      } else {
        this.addCheck('Dockerfile', 'warning', 'Versão Node.js no Dockerfile pode estar desatualizada', false)
      }

    } catch (error) {
      this.addCheck('Dockerfile', 'warning', 'Erro ao ler Dockerfile', false)
    }
  }

  private checkEnvironmentFiles(): void {
    const envFiles = ['.env.local', '.env.example']
    let foundEnvFiles = 0

    envFiles.forEach(file => {
      const filePath = join(this.projectRoot, file)
      if (existsSync(filePath)) {
        foundEnvFiles++
        
        try {
          const content = readFileSync(filePath, 'utf8')
          if (content.includes('REDIS_') && content.includes('NODE_ENV')) {
            // Arquivo válido
          } else {
            this.addCheck(`Environment ${file}`, 'warning', `${file} pode estar incompleto`, false)
          }
        } catch (error) {
          this.addCheck(`Environment ${file}`, 'warning', `Erro ao ler ${file}`, false)
        }
      }
    })

    if (foundEnvFiles === 0) {
      this.addCheck('Environment Files', 'fail', 'Nenhum arquivo .env encontrado', true)
    } else {
      this.addCheck('Environment Files', 'pass', `${foundEnvFiles} arquivo(s) .env encontrado(s)`, true)
    }
  }

  private checkTestConfiguration(): void {
    const jestConfig = join(this.projectRoot, 'jest.config.js')
    const testDir = join(this.projectRoot, 'tests')
    
    if (!existsSync(jestConfig)) {
      this.addCheck('Jest Config', 'warning', 'jest.config.js não encontrado', false)
    } else {
      this.addCheck('Jest Config', 'pass', 'Configuração Jest encontrada', false)
    }

    if (!existsSync(testDir)) {
      this.addCheck('Test Directory', 'warning', 'Diretório /tests não encontrado', false)
    } else {
      this.addCheck('Test Directory', 'pass', 'Diretório de testes encontrado', false)
    }
  }

  private checkRedisConfiguration(): void {
    const redisValidator = join(this.projectRoot, 'src/tests/redis-validator.ts')
    const redisConfig = join(this.projectRoot, 'src/config/redis-environments.ts')
    
    if (!existsSync(redisValidator)) {
      this.addCheck('Redis Validator', 'fail', 'Validador Redis não encontrado', true)
    } else {
      this.addCheck('Redis Validator', 'pass', 'Validador Redis configurado', true)
    }

    if (!existsSync(redisConfig)) {
      this.addCheck('Redis Config', 'fail', 'Configuração Redis não encontrada', true)
    } else {
      this.addCheck('Redis Config', 'pass', 'Configuração Redis encontrada', true)
    }
  }

  private checkDependencies(): void {
    const nodeModules = join(this.projectRoot, 'node_modules')
    
    if (!existsSync(nodeModules)) {
      this.addCheck('Dependencies', 'fail', 'node_modules não encontrado. Execute: npm install', true)
    } else {
      this.addCheck('Dependencies', 'pass', 'Dependências instaladas', true)
    }
  }

  private addCheck(name: string, status: CICheck['status'], message: string, required: boolean): void {
    this.checks.push({ name, status, message, required })
  }

  private displayResults(): void {
    console.log('📋 Resultados da Validação:')
    console.log('='.repeat(80))

    this.checks.forEach(check => {
      const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️'
      const required = check.required ? '' : ' (opcional)'
      console.log(`${icon} ${check.name}${required}: ${check.message}`)
    })

    console.log('\n📊 Resumo:')
    const passed = this.checks.filter(c => c.status === 'pass').length
    const failed = this.checks.filter(c => c.status === 'fail').length
    const warnings = this.checks.filter(c => c.status === 'warning').length
    
    console.log(`   ✅ Passou: ${passed}`)
    console.log(`   ❌ Falhou: ${failed}`)
    console.log(`   ⚠️  Avisos: ${warnings}`)
  }
}

async function main() {
  const validator = new CISetupValidator()
  await validator.validateSetup()
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error)
}

export { CISetupValidator, main }