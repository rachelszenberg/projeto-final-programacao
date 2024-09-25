import React from 'react';
import { Header } from './components/Header';
import { Questionario } from './pages/Questionario';
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Obrigado } from './pages/Obrigado';
import { PageError } from './pages/PageError';
import { Avaliacao } from './pages/Avaliacao';

function App() {

  const router = createBrowserRouter([
    {
      element: <Outlet />,
      errorElement: <PageError />,
      children: [
        {
          path: '/', element:
            <div>
              <Header headerText={"Avaliação de linguagem"} />
              <Questionario />
            </div>
        },
        { path: '/obrigado', element: <Obrigado /> },
        {
          path: '/avaliacao',
          element: <div>
            <Header headerText={"Respostas dos Questionarios"} />
            <Avaliacao />
          </div>
        },
      ]
    }
  ])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
