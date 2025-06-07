# ZMagic12 - Plataforma de Desenvolvimento de Macros

![ZMagic12 Logo](public/main/images/logo.svg)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://seuusername.github.io/ZMagic12-ver-12.60)
[![Version](https://img.shields.io/badge/version-12.60-blue)](https://github.com/seuusername/ZMagic12-ver-12.60)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 📋 Descrição

ZMagic12 é uma plataforma completa para criação de formulários e macros poderosas, desenvolvida em português de Portugal. A aplicação oferece múltiplos módulos para diferentes necessidades de automação e desenvolvimento.

## ✨ Características Principais

- **Form Builder**: Crie formulários interactivos com interface amigável
- **Macro Code**: Desenvolva macros poderosas para automatizar tarefas
- **Low Code**: Crie aplicações completas sem precisar de escrever código extenso
- **Marketplace**: Compre e venda os seus projectos
- **Gestão de Projectos**: Organize todos os seus projectos num único lugar
- **Suporte da Comunidade**: Faça parte de uma comunidade activa de programadores

## 🌍 Idiomas Suportados

- 🇵🇹 Português (Portugal) - Idioma principal
- 🇺🇸 Inglês (EUA)
- 🇫🇷 Francês (França)
- 🇪🇸 Espanhol (Espanha)
- 🇩🇪 Alemão (Alemanha)
- 🇨🇳 Chinês (Simplificado)

## 🚀 Deploy Gratuito

### Opção 1: Vercel (Recomendado)

1. **Criar conta no Vercel**: [vercel.com](https://vercel.com)
2. **Conectar ao GitHub**: Faça fork deste repositório
3. **Deploy automático**: 
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

### Opção 2: Netlify

1. **Criar conta no Netlify**: [netlify.com](https://netlify.com)
2. **Arrastar pasta** do projeto para o painel do Netlify
3. **Deploy automático** activado

### Opção 3: GitHub Pages

1. **Activar GitHub Pages** nas configurações do repositório
2. **Seleccionar branch main** como fonte
3. **Aceder via**: `https://seuuser.github.io/ZMagic12-ver-12.60`

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar servidor local
npm run dev

# Aceder em http://localhost:3000
```

## 📁 Estrutura do Projeto

```
ZMagic12-ver-12.60/
├── core/                      # Código base da aplicação
│   ├── auth/                  # Sistema de autenticação
│   ├── admin/                 # Painel administrativo
│   └── api/                   # Integrações com APIs
├── public/                    # Ficheiros públicos
│   ├── main/                  # Página principal
│   ├── components/            # Componentes reutilizáveis
│   └── shared/                # Recursos partilhados
├── index.html                 # Página de entrada
├── vercel.json               # Configuração do Vercel
└── package.json              # Dependências do projeto
```

## 🔧 Configuração

### Supabase (Backend)

O projeto usa Supabase como backend. Para configurar:

1. **Criar conta no Supabase**: [supabase.com](https://supabase.com) (gratuito)
2. **Configurar variáveis** em `core/api/services/supabase-config.js`
3. **URLs das tabelas** configuradas automaticamente

### Domínio Personalizado (Opcional)

Para usar um domínio próprio gratuitamente:

1. **Freenom**: Domínios `.tk`, `.ml`, `.ga` gratuitos
2. **No-IP**: Subdominios gratuitos
3. **Configurar DNS** na plataforma de hospedagem

## 📈 Monitorização

- **Vercel Analytics**: Incluído gratuitamente
- **Google Analytics**: Pode ser adicionado facilmente
- **Logs de erro**: Disponíveis no painel da plataforma

## 🔒 Segurança

- HTTPS automático em todas as plataformas
- Headers de segurança configurados
- Validação de formulários
- Autenticação via Supabase

## 💰 Custos

**Completamente gratuito:**
- Hospedagem: Vercel/Netlify/GitHub Pages
- Backend: Supabase (tier gratuito)
- Domínio: Freenom ou subdomínio da plataforma
- SSL: Incluído automaticamente

## 🤝 Contribuições

1. Faça fork do projeto
2. Crie uma branch para a sua funcionalidade
3. Faça commit das suas alterações
4. Faça push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o ficheiro [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: geral@zmagic12.com
- **Telefone**: (00351) 91
- **Morada**: Leiria, Portugal

---

**ZMagic12** - A plataforma completa para desenvolvimento de formulários e macros em português de Portugal. 