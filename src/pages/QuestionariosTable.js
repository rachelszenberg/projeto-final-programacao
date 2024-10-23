import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllQuestionarios } from '../features/QuestionarioSlice';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { selectAllAvaliacoes } from '../features/CarregaAvaliacoesSlice';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

export const QuestionariosTable = () => {
  const navigate = useNavigate();

  const questionarios = useSelector(selectAllQuestionarios);
  const respostas = useSelector(selectAllRespostas);
  const avaliacoes = useSelector(selectAllAvaliacoes);
  const avaliacoesSalvas = useSelector((state) => state.avaliacao).notas;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos os status');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = () => {
    const direction = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction);
  };

  const sortByNumero = (a, b) => {
    return sortDirection === 'asc' ? a.numero - b.numero : b.numero - a.numero;
  };

  const getTotalRespostasPorQuestionario = (idQuestionario) => {
    return respostas.find(r => r.id === idQuestionario).respostasPorQuestionario.length;
  }

  const getQuestionarioRespondido = (idQuestionario) => {
    const indexAvaliacao = avaliacoes.findIndex(r => r.id === idQuestionario);
    if (indexAvaliacao === -1) {      
      const indexAvaliacaoSalva = avaliacoesSalvas.findIndex(r => r.idQuestionario === idQuestionario);
      if (indexAvaliacaoSalva === -1){
        return "Não feito"
      }
      return "Salvo"
    }
    return "Feito"
  }

  const navigateToAvaliaQuestionario = (idQuestionario) => {
    navigate(`/avaliacao/${idQuestionario}`)
  }

  const filteredQuestionarios = questionarios
    .filter(q =>
      q.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'Todos os status' || (statusFilter === 'Em andamento' && q.aberto) || (statusFilter === 'Não aceita mais respostas' && !q.aberto))
    )
    .sort(sortByNumero);

  return (
    <div>
      <Header headerText={"Esses são os seus questionários"}/>
      <div className="questionarios-container">
        <div className="filtros">
          <input
            type="text"
            placeholder="Pesquisa pelo nome"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>Todos os status</option>
            <option>Não aceita mais respostas</option>
            <option>Em andamento</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Número <span onClick={() => handleSort()}>{(sortDirection === 'asc' ? '▼' : '▲')}</span></th>
              <th>Nome</th>
              <th>Status</th>
              <th>Respostas</th>
              <th>Avaliado</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestionarios.map((q, index) => (
              <tr key={index} onClick={() => navigateToAvaliaQuestionario(q.id)}>
                <td>{q.numero}</td>
                <td>{q.nome}</td>
                <td>{q.aberto ? 'Em andamento' : 'Não aceita mais respostas'}</td>
                <td>{getTotalRespostasPorQuestionario(q.id)}</td>
                <td>
                  <span className={getQuestionarioRespondido(q.id) === 'Feito' ? 'status-feito' : getQuestionarioRespondido(q.id) === 'Salvo' ? 'status-salvo' : 'status-nao-feito'}>
                    <span className="status-circle"></span> {getQuestionarioRespondido(q.id)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};