# Avalia simples
Avalia Simples é um sistema feito em React para auxiliar autores de documentos a verificar qual tipo de documento é mais compreendido pelos usuários.

## Motivação
A linguagem simples é um tema de crescente estudo.... mas ainda está faltando ferramentas de testes, para ajudar os autores, o Avalia Simples vem com esse objetivo.

## Requisitos

Antes de instalar as dependências, certifique-se de que está utilizando o Node.js na versão **18.18.2**.  
Você pode verificar a versão instalada com o comando:

Se precisar instalar ou mudar a versão, recomendamos usar o [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) para facilitar a troca entre versões do Node.js.

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
  Este fluxo é destinado aos usuários que responderão aos questionários. Ao acessar a seção principal, o usuário encontrará um questionário, contendo um PDF e perguntas associadas a ele. O progresso é salvo automaticamente, permitindo que o usuário volte e altere respostas, se necessário. Após o envio das respostas, o usuário pode optar por responder novamente o questionário onde as mesmas perguntas aparecerão, mas com PDFs diferentes.
  ##### Passo a passo
  1. Acesse a rota principal, em [http://localhost:3000](http://localhost:3000).
  2. Responda às perguntas relacionadas ao perfil do usuário.
  3. Se não houver questionários ativos, o sistema direcionará o usuário para a tela [http://localhost:3000/questionarios-fechados](http://localhost:3000/questionarios-fechados). Caso ainda haja questionários ativos, o sistema redirecionará para [http://localhost:3000/questionario](http://localhost:3000/questionario), onde será exibido um PDF com perguntas relacionadas.
  4. Navegue pelos questionários e, ao final, envie as suas respostas.

### Fluxo Avaliando as Respostas
  Esse fluxo permite que o avaliador examine as respostas enviadas para cada questionário. Todas as respostas são agrupadas por pergunta, independentemente do PDF visualizado, e o avaliador deve atribuir uma nota de 1 a 7 para cada resposta. Além das respostas, todos os PDFs do questionário são exibidos para consulta. O avaliador pode salvar o progresso e continuar posteriormente ou enviar a avaliação final, caso o questionário esteja concluído.
  ##### Passo a passo
  1. Acesse a rota [http://localhost:3000/usuario-identificacao/avaliacao](http://localhost:3000/usuario-identificacao/avaliacao) (substitua "usuario-identificacao" pela identificação do usuário).
  2. Visualize a tabela com todos os questionários disponíveis para avaliação e suas informações.
  3. Clique no questionário desejado para abrir a página de avaliação em [http://localhost:3000/usuario-identificacao/avaliacao/questionario-identificacao](http://localhost:3000/usuario-identificacao/avaliacao/questionario-identificacao) (substitua "usuario-identificacao" pela identificação do usuário e questionario-identificacao será substituido pelo identificador de cada questionário)
  4. Consulte os PDFs e as perguntas associadas a cada questionário, bem como todas as respostas fornecidas.
  5. Avalie cada resposta com uma nota de 1 a 5.
  6. Envie a avaliação final.


### Fluxo Visualizando as Avaliações
  Este fluxo é voltado para visualização de gráficos com as médias das notas de cada pergunta por PDF para os questionários avaliados. Ele permite uma visão consolidada sobre o desempenho e a qualidade das respostas para cada pergunta e PDF visualizado. Filtros avançados estão disponíveis para que o usuário ajuste a visualização conforme a necessidade de análise, seja para grupos específicos ou para detalhamentos mais amplos.
  ##### Passo a passo
  1. Acesse a rota [http://localhost:3000/notas](http://localhost:3000/notas).
  2. Visualize a tabela com todos os questionários e suas informações.
  3. Clique no questionário de interesse para acessar as avaliações para abrir a página de visualização de avaliação em http://localhost:3000/notas/questionario-identificacao (substitua questionario-identificacao pelo identificador de cada questionário)
  4. Consulte o gráfico com as médias das notas atribuídas a cada pergunta e PDF.
  5. Utilize as ferramentas de filtro e busca para ajustar a visualização das avaliações conforme necessário.
