# 🚀 Guia de Publicação - Vercel

Este guia explica como publicar o site ConectEdu na Vercel de forma simples e rápida.

---

## 📋 Pré-requisitos

1. ✅ Conta no GitHub (se ainda não tiver, crie em: https://github.com)
2. ✅ Projeto enviado para o GitHub (repositório)
3. ✅ Conta na Vercel (gratuita, pode criar durante o processo)

---

## 🎯 Passo a Passo

### **Passo 1: Enviar código para o GitHub**

Se ainda não enviou seu código para o GitHub:

1. Abra o terminal na pasta do projeto
2. Execute os comandos abaixo:

```bash
# Se for a primeira vez usando git neste projeto
git init

# Adiciona todos os arquivos
git add .

# Faz o commit inicial
git commit -m "Preparação para publicação"

# (Opcional) Se já tiver repositório no GitHub, substitua a URL abaixo:
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# Envia para o GitHub
git push -u origin main
```

**💡 Dica:** Se não tiver repositório no GitHub ainda:
- Acesse https://github.com/new
- Crie um repositório novo
- Use o nome que preferir (ex: `conectedu-site`)
- Não marque "Initialize with README" se o projeto já existir localmente
- Copie a URL do repositório e use no comando `git remote add origin` acima

---

### **Passo 2: Publicar na Vercel**

1. **Acesse a Vercel:**
   - Vá para: https://vercel.com
   - Clique em **"Sign Up"** (se não tiver conta)
   - Faça login usando sua conta do **GitHub** (recomendado)

2. **Importe o projeto:**
   - No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
   - Você verá seus repositórios do GitHub
   - Clique em **"Import"** no repositório do ConectEdu

3. **Configure o projeto:**
   - **Project Name:** Deixe como está ou escolha um nome
   - **Framework Preset:** A Vercel detectará automaticamente como **React**
   - **Root Directory:** Deixe como **`./`** (raiz)
   - **Build Command:** Deve aparecer automaticamente como `npm run build`
   - **Output Directory:** Deve aparecer automaticamente como `build`

4. **Clique em "Deploy":**
   - A Vercel começará a fazer o build automaticamente
   - Aguarde alguns minutos (2-5 minutos normalmente)
   - Você verá o progresso em tempo real

5. **Pronto! 🎉**
   - Quando terminar, você verá um link do tipo: `https://seu-projeto.vercel.app`
   - Seu site já está no ar!

---

### **Passo 3: (Opcional) Configurar domínio personalizado**

Se quiser usar seu próprio domínio (ex: `conectedu.com.br`):

1. No dashboard da Vercel, clique no seu projeto
2. Vá em **Settings** → **Domains**
3. Adicione seu domínio
4. Siga as instruções para configurar o DNS

---

## 🔄 Atualizar o Site Após Publicar

Depois que o site estiver publicado, para fazer atualizações:

1. **Edite os arquivos** no seu computador (em `src/`)
2. **Faça commit e push:**
   ```bash
   git add .
   git commit -m "Minha atualização"
   git push
   ```
3. **Pronto!** A Vercel detecta automaticamente e faz novo deploy (leva ~2 minutos)

---

## ⚠️ Importante

- O arquivo `vercel.json` já foi criado na raiz do projeto (necessário para o React Router funcionar)
- Suas chaves do Supabase estão no código, então funcionarão automaticamente
- O build já está configurado no `package.json`

---

## 🆘 Problemas Comuns

### Erro no build?
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para garantir que está tudo certo

### Site não carrega?
- Verifique se o arquivo `vercel.json` está na raiz do projeto
- Verifique se o build foi concluído com sucesso

### Rotas não funcionam?
- O arquivo `vercel.json` já resolve isso
- Se ainda não funcionar, verifique se o arquivo está correto

---

## 📞 Próximos Passos

Após publicar, você terá:
- ✅ Site online e acessível
- ✅ Deploy automático sempre que fizer push no GitHub
- ✅ HTTPS automático (gratuito)
- ✅ URL personalizável

**Boa sorte com a publicação! 🚀**

