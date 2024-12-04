import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllQuestionarios } from '../features/QuestionarioSlice';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { useNavigate } from 'react-router-dom';

export const ConfiancaTable = () => {
  const navigate = useNavigate();

  const questionarios = useSelector(selectAllQuestionarios).todosQuestionarios;
  const respostas = useSelector(selectAllRespostas);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos os status do questionário');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = () => {
    const direction = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction);
  };

  const sortByNumero = (a, b) => {
    return sortDirection === 'asc' ? a.numero - b.numero : b.numero - a.numero;
  };

  const getTotalRespostasPorQuestionario = (idQuestionario) => {
    const total = respostas.find(r => r.id === idQuestionario)?.respostasPorQuestionario.length;
    return total || "Sem resposta";
  }

  const navigateToAvaliaQuestionario = (idQuestionario) => {
    navigate(`/confianca/${idQuestionario}`)
  }

  const filteredQuestionarios = questionarios
    .filter(q =>
      q.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'Todos os status do questionário' || (statusFilter === 'Em andamento' && q.aberto) || (statusFilter === 'Fechado' && !q.aberto))
    )
    .sort(sortByNumero);

  return (
      <div className="tempos-container">
        <div className="filtros">
          <input
            type="text"
            placeholder="Pesquisa pelo nome"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>Todos os status do questionário</option>
            <option>Fechado</option>
            <option>Em andamento</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Número <span onClick={() => handleSort()}>{(sortDirection === 'asc' ? '▼' : '▲')}</span></th>
              <th>Nome</th>
              <th>Status do Questionário</th>
              <th>Respostas</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestionarios.map((q, index) => (
              <tr key={index} onClick={() => navigateToAvaliaQuestionario(q.id)}>
                <td>{q.numero}</td>
                <td>{q.nome}</td>
                <td>{q.aberto ? 'Em andamento' : 'Fechado'}</td>
                <td>{getTotalRespostasPorQuestionario(q.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};