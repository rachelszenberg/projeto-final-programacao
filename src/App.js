import React from 'react';
import { Questionario } from './pages/Questionario';
import { Outlet, RouterProvider, createHashRouter } from "react-router-dom";
import { Obrigado } from './pages/Obrigado';
import { PageError } from './pages/PageError';
import { Avaliacao } from './pages/Avaliacao';
import { QuestionariosFechados } from './pages/QuestionariosFechados';
import { QuestionariosTable } from './pages/QuestionariosTable';
import { PerfilUsuario } from './pages/PerfilUsuario';
import { Notas } from './pages/Notas';
import { NotasTable } from './pages/NotasTable';

function App() {

  const router = createHashRouter([
    {
      element: <Outlet />,
      errorElement: <PageError />,
      children: [
        { path: '/', element: <PerfilUsuario /> },
        { path: '/questionario', element: <Questionario /> },
        { path: '/obrigado', element: <Obrigado /> },
        { path: '/questionarios-fechados', element: <QuestionariosFechados /> },
        { path: '/:idAvaliador/avaliacao/:idQuestionario', element: <Avaliacao /> },
        { path: '/:idAvaliador/avaliacao', element: <QuestionariosTable /> },
        { path: '/notas', element: <NotasTable /> },
        { path: '/notas/:idQuestionario', element: <Notas /> },
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
