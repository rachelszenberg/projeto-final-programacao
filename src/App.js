import React from 'react';
import { Questionario } from './pages/Questionario';
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Obrigado } from './pages/Obrigado';
import { PageError } from './pages/PageError';
import { Avaliacao } from './pages/Avaliacao';
import { QuestionariosFechados } from './pages/QuestionariosFechados';
import { QuestionariosTable } from './pages/QuestionariosTable';
import { PerfilUsuario } from './pages/PerfilUsuario';

function App() {

  const router = createBrowserRouter([
    {
      element: <Outlet />,
      errorElement: <PageError />,
      children: [
        { path: '/', element: <Questionario /> },
        { path: '/obrigado', element: <Obrigado /> },
        { path: '/questionarios-fechados', element: <QuestionariosFechados /> },
        { path: '/avaliacao/:idQuestionario', element: <Avaliacao /> },
        { path: '/avaliacao', element: <QuestionariosTable /> },
        { path: '/perfil', element: <PerfilUsuario /> },
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
