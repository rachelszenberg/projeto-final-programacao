import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store';
import { Provider } from 'react-redux';
import './styles/styles.scss';
import { fetchQuestionarios } from './features/QuestionarioSlice';
import { fetchPerguntas } from './features/PerguntasSlice';
import { fetchRespostas } from './features/CarregaRespostasSlice';
import { fetchAvaliacoes } from './features/CarregaAvaliacoesSlice';
import { fetchAvaliacoesSalvas } from './features/AvaliacaoSlice';
import { fetchPerguntasPerfil } from './features/PerfilSlice';

const root = ReactDOM.createRoot(document.getElementById('root'));

const loadInitialData = async () => {
  try {
    await store.dispatch(fetchQuestionarios());
    await store.dispatch(fetchPerguntas());
    await store.dispatch(fetchRespostas());
    await store.dispatch(fetchAvaliacoes());
    await store.dispatch(fetchAvaliacoesSalvas());
    await store.dispatch(fetchPerguntasPerfil());

    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Erro ao carregar os dados iniciais: ", error);
  }
};

loadInitialData();

reportWebVitals();
