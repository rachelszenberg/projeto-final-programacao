import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllAvaliacoes } from '../features/CarregaAvaliacoesSlice';
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { selectAllUsuarios } from '../features/UsariosSlice';
import { selectAllPerguntasPerfil } from '../features/PerfilSlice';
import { Header } from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { RightTitleComponent } from '../components/RightTitleComponent';
import { selectAllPerguntas } from '../features/PerguntasSlice';
import { RxChevronLeft, RxChevronRight } from 'react-icons/rx';
import { selectAllRespostas } from '../features/CarregaRespostasSlice';
import { mean } from 'mathjs';

export const ConfiancaNota = () => {
    const params = useParams();
    const navigate = useNavigate();
    const avaliacao = useSelector(selectAllAvaliacoes);
    const questionarios = useSelector(selectAllQuestionarios);
    const usuarios = useSelector(selectAllUsuarios);
    const respostas = useSelector(selectAllRespostas);
    const perguntas = useSelector(selectAllPerguntas);
    const questionario = questionarios.todosQuestionarios.find(q => q.id === params.idQuestionario);
    const questionarioNome = questionario.nome;
    const medias = [];
    const perguntasPerfil = useSelector(selectAllPerguntasPerfil);
    const [questao, setQuestao] = useState(0);
    const temp = respostas.find(r => r.id === params.idQuestionario);
    const respostasDoQuestionario = temp?.respostasPorQuestionario;
    const colorsBackground = ['#C41E0035', '#C41E0020', '#C47E0025', '#03784720', '#03784735'];
    const colorsText = ['#C41E00', '#C41E0090', '#C47E00', '#03784790', '#037847'];

    const [filtros, setFiltros] = useState({
        faixaEtaria: [],
        escolaridade: [],
        familiaridade: []
    });

    const filtrarLista = (lista, filtros) => {
        return lista
            .filter(item => (
                (filtros.faixaEtaria.length === 0 || filtros.faixaEtaria.includes(item["-O9RZpD7DTQTQ-dwKCJw"])) &&
                (filtros.escolaridade.length === 0 || filtros.escolaridade.includes(item["-O9RZykzuzqNYlAg_xd1"])) &&
                (filtros.familiaridade.length === 0 || filtros.familiaridade.includes(item["-O9R_5KiJFTMaGU7stem"]))
            ))
            .map(item => item.id);
    };

    const removerUsuarios = (lista, idsUsuarios) => {
        const listaCopia = JSON.parse(JSON.stringify(lista));

        for (let chave in listaCopia) {
            listaCopia[chave] = listaCopia[chave].filter(item => idsUsuarios.includes(item.idUsuario));
            if (listaCopia[chave].length === 0) {
                delete listaCopia[chave];
            }
        }
        return listaCopia;
    };

    const agruparPorResposta = (id, index, agruparPorPergunta) => {
        const agrupadoLista = Object.entries(
            agruparPorPergunta[id].reduce((acc, item) => {
                const { idResposta, ...resto } = item;
                if (!acc[idResposta]) {
                    acc[idResposta] = [];
                }
                acc[idResposta].push(resto);
                return acc;
            }, {})
        ).map(([idResposta, lista]) => {
            return {
                idResposta,
                idPdf: lista[0].idPdf,
                idUsuario: lista[0].idUsuario,
                todasNotas: lista.map(({ nota }) => nota)
            };
        });

        return {
            idPergunta: id,
            value: agrupadoLista
        };
    };

    const atualizarFiltros = (tipo, valor) => {
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [tipo]: prevFiltros[tipo].includes(valor)
                ? prevFiltros[tipo].filter(item => item !== valor)
                : [...prevFiltros[tipo], valor]
        }));
    };

    const listaFiltrada = filtrarLista(usuarios, filtros);
    const avaliacaoFiltrada = removerUsuarios(avaliacao, listaFiltrada);

    const av = avaliacaoFiltrada[questionario.id] || null;

    if (av) {
        const agruparPorPergunta = av.reduce((acc, item) => {
            if (!acc[item.idPergunta]) {
                acc[item.idPergunta] = [];
            }
            const { idPergunta, ...itemSemIdPergunta } = item;
            acc[item.idPergunta].push(itemSemIdPergunta);
            return acc;
        }, {});

        questionario.perguntas.forEach((p, index) => {
            medias.push(agruparPorResposta(p, index, agruparPorPergunta));
        });
    }

    const getResposta = (idResposta) => {
        return respostasDoQuestionario.find(r => r.idResposta === idResposta).listRespostas[questao];
    }

    const getConfianca = (idResposta) => {
        return respostasDoQuestionario.find(r => r.idResposta === idResposta).confiancaPorQuestionario[questao];
    }

    const getMedia = (lista) => {
        return mean(lista).toFixed(2);
    }

    const onPreviousClick = () => {
        setQuestao(questao - 1);
    }

    const onNextClick = () => {
        setQuestao(questao + 1);
    }

    // const onQuestaoClick = (q) => {
    //     setQuestao(q);
    // }

    return (
        <div>
            <Header headerText={questionarioNome} onVoltar={() => navigate(-1)} headerButtons grafico />
            <div className="div-notas">
                <div className='div-filtros'>
                    <p className='filtros-geral-title'>Filtros</p>
                    <button className="underline-button limpar-filtro" onClick={() => setFiltros({ faixaEtaria: [], escolaridade: [], familiaridade: [] })}>limpar filtros</button>
                    <div>
                        {perguntasPerfil.map((p) => (
                            <div key={p.id}>
                                <p className='filtro-title'>{p.titulo}</p>
                                {p.opcoes &&
                                    p.opcoes.map((item, index) => (
                                        <label key={index}>
                                            <p className='filtro-opcao'>
                                                <input
                                                    type="checkbox"
                                                    checked={filtros[p.filtro].includes(item)}
                                                    onChange={() => atualizarFiltros(p.filtro, item)}
                                                />
                                                {item}</p>
                                        </label>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                </div>
                {medias.length ?
                    <div className='div-geral-grafico'>
                        <RightTitleComponent className="div-top"
                            titleText={"Relação da confiança pela nota"}
                        />
                        <div className='div-grafico-confianca-container'>
                            <div className='div-graficos-confianca'>
                                <div className="div-title-graficos">
                                    <RxChevronLeft className={questao === 0 ? "no-button" : "icon"} onClick={onPreviousClick} />
                                    <p className="title-avaliacao">Pergunta {questao + 1}</p>
                                    <RxChevronRight className={questao === (questionario.perguntas.length - 1) ? "no-button" : "icon"} onClick={onNextClick} />
                                </div>
                                <div className='div-resposta-avaliada-container'>
                                    {medias[questao].value.map((r, index) => {
                                        return (
                                            <div key={index} className='resposta-avaliada-field'>
                                                <p>{getResposta(r.idResposta)}</p>
                                                <div className='confiancaxnota-div'>
                                                    <p className='confiancaxnota' style={{ color: colorsText[Number(getMedia(r.todasNotas)[0]) - 1], backgroundColor: colorsBackground[Number(getMedia(r.todasNotas)[0]) - 1] }}>nota média: {getMedia(r.todasNotas)}</p>
                                                    {getConfianca(r.idResposta) && <p className='confiancaxnota' style={{ color: colorsText[Number(getConfianca(r.idResposta)[0]) - 1], backgroundColor: colorsBackground[Number(getConfianca(r.idResposta)[0]) - 1] }}>confiança: {getConfianca(r.idResposta)}</p>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="div-grafico-legenda">
                                <h2>Legenda</h2>
                                <h4>Perguntas</h4>
                                {medias.map((m, index) => (
                                    <p>{index + 1}. {perguntas.find(p => p.id === m.idPergunta).questao.pergunta}</p>
                                ))}
                                <h4>Pdfs</h4>
                                {questionario.listPdf.map((pdf, index) => (
                                    <div>
                                        <span>{index + 1}. </span>
                                        <a href={pdf.url} target="_blank" rel="noreferrer noopener">Cliquei aqui para abrir o pdf {index + 1}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    : <div className='div-notas-no-answer'>
                        <p className="no-answers">Não temos respostas para esse caso</p>
                    </div>}
            </div>
        </div>
    );
}
