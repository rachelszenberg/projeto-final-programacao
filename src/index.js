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

const root = ReactDOM.createRoot(document.getElementById('root'));
store.dispatch(fetchQuestionarios()).then(() => {
  store.dispatch(fetchPerguntas()).then(() => {
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  })
})

reportWebVitals();
