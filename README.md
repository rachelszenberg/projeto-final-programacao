# Avalia simples
Avalia Simples é um sistema feito em React para auxiliar autores de documentos a verificar qual tipo de documento é mais compreendido pelos usuários.

## Motivação
A linguagem simples é um tema de crescente estudo.... mas ainda está faltando ferramentas de testes, para ajudar os autores, o Avalia Simples vem com esse objetivo.

## Instalação
1. Clone esse repositório com o comando
```
git clone git@github.com:rachelszenberg/projeto-final-programacao.git
```
2. Faça a instalação das bibliotecas utilizadas
```
npm install
```

## Script
1. No diretório do projeto, execute:
```
npm start
```
2. Execute o aplicativo no modo de desenvolvimento: abra [http://localhost:3000](http://localhost:3000) para visualizá-lo em seu navegador. O usuario pode seguir 3 fluxos:

### Fluxo Respondendo ao Questionário
  Este fluxo é destinado às pessoas que vão responder às perguntas dos questionários. Ao acessar a seção, o usuário encontrará alguns questionários, cada um com uma lista de perguntas associadas a um PDFs. O progresso de preenchimento é salvo automaticamente, permitindo voltar e alterar respostas, se necessário. Ao final, ele envia as respostas e, se optar, pode responder novamente o questionário, que virá cada questionário com as mesmas perguntas, mas outro pdf.
  Passo a passo
  1. Acesse a rota principal, em [http://localhost:3000](http://localhost:3000)
  2. Responda as perguntas o perfil do usuário. 
  3. Se não tiver mais nenhuma questionário ativo, o usuário será levado para a tela [http://localhost:3000/questionarios-fechados](http://localhost:3000/questionarios-fechados). Caso ainda tenha pelo menos um questionário ativo, será levado para a rota [http://localhost:3000/questionario](http://localhost:3000/questionario), onde vai visualizar um pdf e algumas perguntas relacionadas
  4. Navegue pelos questionários e, ao final, envie as suas respostas.
    
  c) Caso queira avaliar as respostas, pode ir para a tela [http://localhost:3000/usuario/avaliacao](http://localhost:3000/usuario/avaliacao) (onde usuario vai ser substitulo pelo usuario escolhido) e lá será possível
