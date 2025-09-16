import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllQuestionarios } from '../features/QuestionarioSlice';
import { fetchAllAvaliacoes, selectAllAvaliacoes } from '../features/CarregaAvaliacoesSlice';
import { useNavigate } from 'react-router-dom';
import { ModalInput } from './ModalInput';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';

export const ConfiancaNotaTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const questionarios = useSelector(selectAllQuestionarios);
    const avaliacoes = useSelector(selectAllAvaliacoes);
    const respostas = useSelector(selectAllRespostas);

    const [showNaoAvaliadoModal, setShowNaoAvaliadoModal] = useState(false);
    const [idQuestionarioClicado, setIdQuestionarioClicado] = useState(null);
    const [showQuestionarioAbertoModal, setShowQuestionarioAbertoModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllAvaliacoes());
    }, [dispatch]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos os status de avaliação');
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = () => {
        const direction = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(direction);
    };

    const sortByNumero = (a, b) => {
        return sortDirection === 'asc' ? a.numero - b.numero : b.numero - a.numero;
    };

    const getQuestionarioAvaliado = (idQuestionario, index) => {
        if (questionarios.questionariosAbertos.some(item => item.id === idQuestionario)) {
            return "Questionário aberto"
        }
        else if (avaliacoes[idQuestionario]) {
            return "Avaliado"
        }
        return "Não avaliado"
    }

    const navigateToAvaliaQuestionario = (idQuestionario) => {
        if (questionarios.questionariosAbertos.some(item => item.id === idQuestionario)) {
            setShowQuestionarioAbertoModal(true);
            setIdQuestionarioClicado(idQuestionario);
        }
        else if (avaliacoes[idQuestionario]) {
            navigate(`/analise/confiancaXnota/${idQuestionario}`)
        }
        else {
            setShowNaoAvaliadoModal(true);
            setIdQuestionarioClicado(idQuestionario);
        }
    }

    const getTotalRespostasPorQuestionario = (idQuestionario) => {
        const total = respostas.find(r => r.id === idQuestionario)?.respostasPorQuestionario.length;
        return total || "Sem resposta";
    }

    const cancel = () => {
        setShowQuestionarioAbertoModal(false);
        setShowNaoAvaliadoModal(false);
        setIdQuestionarioClicado(null);
    }

    const filteredQuestionarios = questionarios.todosQuestionarios
        .filter(q => {
            const status = getQuestionarioAvaliado(q.id);
            return (
                q.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (statusFilter === 'Todos os status de avaliação' ||
                    (statusFilter === 'Avaliado' && status === 'Avaliado') ||
                    (statusFilter === 'Não avaliado' && status === 'Não avaliado') ||
                    (statusFilter === 'Questionário aberto' && status === 'Questionário aberto'))
            );
        })
        .sort(sortByNumero);


    return (
        <>
            <div className="confiancanotas-container">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Pesquisa pelo nome"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option>Todos os status de avaliação</option>
                        <option>Avaliado</option>
                        <option>Não avaliado</option>
                        <option>Questionário aberto</option>
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Número <span onClick={() => handleSort()}>{(sortDirection === 'asc' ? '▼' : '▲')}</span></th>
                            <th>Nome</th>
                            <th>Status de Avaliação</th>
                            <th>Respostas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuestionarios.map((q, index) => (
                            <tr key={index} onClick={() => navigateToAvaliaQuestionario(q.id)}>
                                <td data-label="Número">{q.numero}</td>
                                <td data-label="Nome">{q.nome}</td>
                                <td data-label="Status">
                                    <span
                                        className={
                                            getQuestionarioAvaliado(q.id, index) === 'Avaliado'
                                                ? 'status-feito'
                                                : getQuestionarioAvaliado(q.id, index) === 'Não avaliado'
                                                    ? 'status-salvo'
                                                    : 'status-nao-feito'
                                        }
                                    >
                                        <span className="status-circle"></span> {getQuestionarioAvaliado(q.id, index)}
                                    </span>
                                </td>
                                <td data-label="Respostas">{getTotalRespostasPorQuestionario(q.id)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ModalInput showModal={showNaoAvaliadoModal} title={"Esse questionário ainda não tem avaliações enviadas"} text={"Você pode avaliá-lo.\nDigite seu usuário, caso não tenha um, crie um que você irá lembrar depois.\nEle será usado apenas como uma identificação para você poder ver as suas avaliações."} idQuestionario={idQuestionarioClicado} cancelButton={cancel} />
            <ModalInput showModal={showQuestionarioAbertoModal} title={"Esse questionário ainda está aberto"} text={"Você pode avaliá-lo e salvar as notas, porém ainda não pode enviar.\nDigite seu usuário, caso não tenha um, crie um que você irá lembrar depois.\nEle será usado apenas como uma identificação para você poder ver as suas avaliações."} idQuestionario={idQuestionarioClicado} cancelButton={cancel} />
        </>
    );
};