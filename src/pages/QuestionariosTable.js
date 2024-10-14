import React, { useState } from 'react';

const Questionarios = () => {
  const questionarios = [
    { numero: 1, nome: 'Acordo com a Light', aberto: false, respostas: 5, avaliado: 'Feito' },
    { numero: 2, nome: 'Acordo com a Gol', aberto: true, respostas: 6, avaliado: 'Feito' },
    { numero: 3, nome: 'Acordo com a Tim', aberto: false, respostas: 7, avaliado: 'Não Feito' },
    { numero: 4, nome: 'Acordo com a Eletrolux', aberto: false, respostas: 4, avaliado: 'Feito' },
    { numero: 5, nome: 'Acordo com a Amazon', aberto: true, respostas: 4, avaliado: 'Não Feito' },
    { numero: 6, nome: 'Acordo com a Apple', aberto: true, respostas: 9, avaliado: 'Não Feito' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos os status');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    const direction = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction)
    console.log(direction);
  };

  const sortByNumero = (a, b) => {
    return sortDirection === 'asc' ? a.numero - b.numero : b.numero - a.numero;
  };

  const filteredQuestionarios = questionarios
    .filter(q =>
      q.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'Todos os status' || (statusFilter === 'Em andamento' && q.aberto) || (statusFilter === 'Não aceita mais respostas' && !q.aberto))
    )
    .sort(sortByNumero);

  return (
    <div className="questionarios-container">
      <div className="filtros">
        <input
          type="text"
          placeholder="Pesquisa"
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
            <tr key={index}>
              <td>{q.numero}</td>
              <td>{q.nome}</td>
              <td>{q.aberto ? 'Em andamento' : 'Não aceita mais respostas'}</td>
              <td>{q.respostas}</td>
              <td>
                <span className={q.avaliado === 'Feito' ? 'status-feito' : 'status-nao-feito'}>
                  <span className="status-circle"></span> {q.avaliado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Questionarios;
