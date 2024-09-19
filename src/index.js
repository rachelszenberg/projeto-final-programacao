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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
