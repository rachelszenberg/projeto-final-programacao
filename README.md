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
  ##### Passo a passo
  1. Acesse a rota principal, em [http://localhost:3000](http://localhost:3000)
  2. Responda as perguntas o perfil do usuário. 
  3. Se não tiver mais nenhuma questionário ativo, o usuário será levado para a tela [http://localhost:3000/questionarios-fechados](http://localhost:3000/questionarios-fechados). Caso ainda tenha pelo menos um questionário ativo, será levado para a rota [http://localhost:3000/questionario](http://localhost:3000/questionario), onde vai visualizar um pdf e algumas perguntas relacionadas
  4. Navegue pelos questionários e, ao final, envie as suas respostas.

### Fluxo Avaliando as Respostas
  Esse fluxo permite que a pessoa responsável pela avaliação examine as respostas dos questionários enviados. Cada pergunta de cada questionário será apresentada com todas as respostas que tiveram, independente do PDF e o avaliador atribui uma nota de 1 a 5. Além das respostas, todos os PDF relacionados ao questionário são exibidos. Após a conclusão, o avaliador pode salvar as respostas para continuar o processo depois ou enviar se o questionário relativo já tiver fechado.
  ##### Passo a passo
  1. Acesse a rota [http://localhost:3000/usuario-identificacao/avaliacao](http://localhost:3000/usuario-identificacao/avaliacao) (onde usuario-identificacao será escolhido pelo usuario).
  2. Visualize a tabela que tem todos os questionário e informações relativas a ele.
  3. Clique no questionário que deseja avaliar, que levará para a rota [http://localhost:3000/usuario-identificacao/avaliacao/questionario-identificacao](http://localhost:3000/usuario-identificacao/avaliacao/questionario-identificacao) (onde questionario-identificacao será substituido pelo identificador de cada questionário)
  4. Visualize todos os PDFs existentes daquele questionário, as perguntas associdas e todas as respostas dadas.
  5. Avalie as respostas com uma nota de 1 a 5.
  6. Envie a avaliação.


### Fluxo Visualizando as Avaliações
  Esse fluxo permite que a pessoa responsável pela avaliação examine o gráfico das médias das notas de cada pergunta para cada pdf questionários avaliado. O objetivo é proporcionar uma visão consolidada do desempenho e qualidade das respostas para cada pergunta e para cada PDF que foi visualizado para se ter a resposta que ganhou a nota relativa, permitindo análises mais amplas ou específicas conforme a necessidade. Nesse fluxo, será possível aplicar filtros para se ter visualizações mais específicas por cada grupo
  ##### Passo a passo
  1. Acesse a rota [http://localhost:3000/notas](http://localhost:3000/notas).
  2. Visualize a tabela que tem todos os questionário e informações relativas a ele.
  3. Clique no questionário que deseja visualizar as avaliações.
  4. Visualize o gráfico com as médias das notas de cada pergunta para cada pdf
  5. Utilize as ferramentas de filtro e busca para refinar a visualização das avaliações, conforme necessário.
