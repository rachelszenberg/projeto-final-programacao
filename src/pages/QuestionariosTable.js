import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllQuestionarios } from '../features/QuestionarioSlice';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { fetchAvaliacoes, selectAllAvaliacoesPorId } from '../features/CarregaAvaliacoesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { fetchAvaliacoesSalvas } from '../features/AvaliacaoSlice';

export const QuestionariosTable = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const questionarios = useSelector(selectAllQuestionarios).todosQuestionarios;
  const respostas = useSelector(selectAllRespostas);
  const avaliacoes = useSelector(selectAllAvaliacoesPorId);
  const avaliacoesSalvas = useSelector((state) => state.avaliacao).notas;

  useEffect(() => {
    dispatch(fetchAvaliacoesSalvas(params.idAvaliador));
    dispatch(fetchAvaliacoes(params.idAvaliador));
  }, [dispatch, params.idAvaliador]);

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
    const total = respostas.find(r => r.id === idQuestionario)?.respostasPorQuestionario.length;
    return total || "Sem resposta";
  }

  const getQuestionarioRespondido = (idQuestionario) => {
    const indexAvaliacao = avaliacoes.findIndex(r => r.id === idQuestionario);
    if (indexAvaliacao === -1) {
      const indexAvaliacaoSalva = avaliacoesSalvas.findIndex(r => r.idQuestionario === idQuestionario);
      if (indexAvaliacaoSalva === -1) {
        return "Não avaliado"
      }
      return "Salvo"
    }
    return "Avaliado"
  }

  const navigateToAvaliaQuestionario = (idQuestionario) => {
    navigate(`/${params.idAvaliador}/avaliacao/${idQuestionario}`)
  }

  const filteredQuestionarios = questionarios
    .filter(q =>
      q.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'Todos os status' || (statusFilter === 'Em andamento' && q.aberto) || (statusFilter === 'Fechado' && !q.aberto))
    )
    .sort(sortByNumero);

  return (
    <div>
      <Header headerText={"Questionários - Avaliar"} headerButtons avaliar/>
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
            <option>Fechado</option>
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
                <td>{q.aberto ? 'Em andamento' : 'Fechado'}</td>
                <td>{getTotalRespostasPorQuestionario(q.id)}</td>
                <td>
                  <span className={getQuestionarioRespondido(q.id) === 'Avaliado' ? 'status-feito' : getQuestionarioRespondido(q.id) === 'Salvo' ? 'status-salvo' : 'status-nao-feito'}>
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