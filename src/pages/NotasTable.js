import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllQuestionarios } from '../features/QuestionarioSlice';
import { fetchAllAvaliacoes, selectAllAvaliacoes } from '../features/CarregaAvaliacoesSlice';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ModalInput } from '../components/ModalInput';

export const NotasTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const questionarios = useSelector(selectAllQuestionarios).todosQuestionarios;
    const avaliacoes = useSelector(selectAllAvaliacoes);

    const [showNaoAvaliadoModal, setShowNaoAvaliadoModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllAvaliacoes());
    }, [dispatch]);

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

    const getQuestionarioAvaliado = (idQuestionario, index) => {
        if (avaliacoes[idQuestionario]) {
            return "Avaliado"
        }
        return "Não avaliado"
    }

    const navigateToAvaliaQuestionario = (idQuestionario) => {
        if (avaliacoes[idQuestionario]) {
            navigate(`/notas/${idQuestionario}`)
        } else {
            setShowNaoAvaliadoModal(true);
        }
    }

    const filteredQuestionarios = questionarios
        .filter(q =>
            q.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === 'Todos os status' || (statusFilter === 'Avaliado' && avaliacoes[q.id]) || (statusFilter === 'Não avaliado' && !avaliacoes[q.id]))
        )
        .sort(sortByNumero);

    return (
        <div>
            <Header headerText={"Questionários - Visualizar avaliações"} headerButtons grafico/>
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
                        <option>Avaliado</option>
                        <option>Não avaliado</option>
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Número <span onClick={() => handleSort()}>{(sortDirection === 'asc' ? '▼' : '▲')}</span></th>
                            <th>Nome</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuestionarios.map((q, index) => (
                            <tr key={index} onClick={() => navigateToAvaliaQuestionario(q.id)}>
                                <td>{q.numero}</td>
                                <td>{q.nome}</td>
                                <td>
                                    <span className={getQuestionarioAvaliado(q.id, index) === 'Avaliado' ? 'status-feito' : 'status-nao-feito'}>
                                        <span className="status-circle"></span> {getQuestionarioAvaliado(q.id, index)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ModalInput showModal={showNaoAvaliadoModal} title={"Esse questionário ainda não tem avaliações salvas"} text={"Você pode avaliá-lo.\nDigite seu usuário, caso não tenha um, crie um que você irá lembrar depois.\nEle será usado apenas como uma identificação para você poder ver as suas avaliações"} cancelButton={() => setShowNaoAvaliadoModal(false)}/>
        </div>
    );
};