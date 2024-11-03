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

  a) Seguindo pela rota principal, em [http://localhost:3000](http://localhost:3000), vai ser exibida uma tela de perguntas sobre o perfil do usuário. Ao responder as perguntas do perfil, o usuário pode ser levado para as telas
    - [http://localhost:3000/questionario](http://localhost:3000/questionario), onde vai ver um pdf e algumas perguntas relacionadas ao pdf e pode ir navegando pelos questionários e, ao final, enviar as suas respostas
    - [http://localhost:3000/questionarios-fechados](http://localhost:3000/questionarios-fechados) caso todos os questionários já tenham sido fechados
      - a
  c) Caso queira avaliar as respostas, pode ir para a tela [http://localhost:3000/usuario/avaliacao](http://localhost:3000/usuario/avaliacao) (onde usuario vai ser substitulo pelo usuario escolhido) e lá será possível
