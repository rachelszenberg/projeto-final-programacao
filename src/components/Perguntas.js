import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmacaoModal } from "./ConfirmacaoModal";
import { useNavigate } from "react-router-dom";
import { decrementIndex, incrementIndex, selectRespostasAtuais, setAvaliacaoRespostas, addResposta, setTempoPorQuestionario, setConfiancaPorQuestionario } from "../features/RespostaAtualSlice";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { RightComponent } from "./RightComponent";

export const Perguntas = (props) => {
    const dispatch = useDispatch();
    const respostas = useSelector(selectRespostasAtuais);
    const allPerguntas = useSelector(selectAllPerguntas);
    const navigate = useNavigate();
    const questionario = props.questionariosAbertos[respostas.respostaIndex];
    const [segundos, setSegundos] = useState(0);

    const [respostasTmp, setRespostasTmp] = useState([]);
    const [confiancasTmp, setConfiancasTmp] = useState([]);
    const [listIndexErros, setListIndexErros] = useState([]);
    const [podeVoltar, setPodeVoltar] = useState();
    const [temProximo, setTemProximo] = useState();
    const [qtdRespondidas, setQtdRespondidas] = useState(0);
    const [showModal, setShowModal] = useState(false);
    
    const opcoes = ["1 - Nada confiante", "2", "3", "4", "5", "6", "7 - Muito confiante"];

    const regex = useMemo(() => /([a-zA-Z0-9].*){1,}/, []);

    let perguntas = [];
    questionario.perguntas.forEach((p_id) => {
        const perguntaTemp = allPerguntas.find(pergunta => pergunta.id === p_id)?.questao.pergunta;

        perguntas.push(perguntaTemp);
    });

    useEffect(() => {
        const intervalo = setInterval(() => {
            setSegundos((prevSegundos) => prevSegundos + 1);
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        const perguntaTemResposta = respostas.listRespostas[respostas.respostaIndex];
        const respostasIniciais = perguntaTemResposta ? perguntaTemResposta.respostasPergunta : [];
        const tempoInicial = respostas.tempoPorQuestionario[respostas.respostaIndex] || 0;
        const confiancaInicial = respostas.confiancaPorQuestionario[respostas.respostaIndex] || "";

        setRespostasTmp(respostasIniciais.length ? respostasIniciais : Array(perguntas.length).fill(''));
        setPodeVoltar(respostas.respostaIndex !== 0);
        setTemProximo(respostas.respostaIndex !== props.questionariosAbertos.length - 1)
        setListIndexErros([]);
        setSegundos(tempoInicial);
        setConfiancasTmp(confiancaInicial.length ? confiancaInicial : Array(perguntas.length).fill(''));
    }, [questionario.perguntas, respostas.listRespostas, respostas.respostaIndex, props.questionariosAbertos.length, perguntas.length, respostas.tempoPorQuestionario, respostas.confiancaPorQuestionario])

    useEffect(() => {
        let temp = 0;
        respostasTmp.forEach((r) => { if (regex.test(r)) { temp += 1; } })
        setQtdRespondidas(temp);
    }, [respostasTmp, regex])

    const handleRespostaChange = (index, value) => {
        const novasRespostas = [...respostasTmp];
        novasRespostas[index] = value;
        setRespostasTmp(novasRespostas);
    };

    const handleConfiancaChange = (index, value) => {
        const novasConfiancas = [...confiancasTmp];
        novasConfiancas[index] = value;
        setConfiancasTmp(novasConfiancas);
    };

    const handleBlur = (index) => {
        const novasRespostas = [...respostasTmp];
        let erros = [...listIndexErros];

        if (!regex.test(novasRespostas[index])) {
            if (!erros.includes(index)) {
                erros.push(index);
            }
        } else {
            erros = erros.filter((i) => i !== index);
        }
        setListIndexErros(erros);
    };

    const onVoltar = (e) => {
        e.preventDefault();
        dispatch(setAvaliacaoRespostas({ idQuestionario: questionario.id, idPdf: questionario.pdf.id, respostasPergunta: respostasTmp }));
        dispatch(setTempoPorQuestionario(segundos));
        dispatch(setConfiancaPorQuestionario(confiancasTmp));
        dispatch(decrementIndex());
    };

    const onProximo = (e) => {
        e.preventDefault();
        let erros = []
        respostasTmp.forEach((r, index) => { if (!regex.test(r)) { erros.push(index); } });
        if (erros.length === 0) {
            dispatch(setAvaliacaoRespostas({ idQuestionario: questionario.id, idPdf: questionario.pdf.id, respostasPergunta: respostasTmp }));
            dispatch(setTempoPorQuestionario(segundos));
            dispatch(setConfiancaPorQuestionario(confiancasTmp));
            dispatch(incrementIndex());
        }
        else {
            setListIndexErros(erros);
        }
    };

    const onEnviar = (e) => {
        e.preventDefault();
        let erros = []
        respostasTmp.forEach((r, index) => { if (!regex.test(r)) { erros.push(index); } });
        if (erros.length === 0) {
            dispatch(setAvaliacaoRespostas({ idQuestionario: questionario.id, idPdf: questionario.pdf.id, respostasPergunta: respostasTmp }));
            dispatch(setTempoPorQuestionario(segundos));
            dispatch(setConfiancaPorQuestionario(confiancasTmp));
            setShowModal(true);
        }
        else {
            setListIndexErros(erros);
        }
    };

    const confirmar = () => {
        dispatch(addResposta(props.idUsuario))
        navigate('/obrigado', { state: { idUsuario: props.idUsuario, title: "Obrigado pelas suas respostas!", text: "Salvamos todas para a avaliação." } })
    }

    return (
        <form className="div-form">
            <RightComponent
                index={respostas.respostaIndex}
                questionariosLength={props.questionariosAbertos.length}
                perguntasLength={perguntas.length}
                progressBar={true}
                qtdRespondidas={qtdRespondidas}
                titleText="Questionário"
                nomeQuestionario={questionario.nome}

                podeVoltar={podeVoltar}
                temProximo={temProximo}
                onVoltar={onVoltar}
                onProximo={onProximo}
                onEnviar={onEnviar}
                buttonNextOrSaveClass={(qtdRespondidas !== perguntas.length || confiancasTmp === "") ? "button-disabled no-hover" : undefined}
            >
                <div className="form">
                    {perguntas.map((pergunta, index) => (
                        <div key={index}>
                            <p className="text-question">{index + 1}. {pergunta} <span className="obrigatorio">*</span></p>
                            <textarea
                                rows={4}
                                className={(listIndexErros.includes(index) && respostasTmp[index] === "") ? "input-error" : undefined}
                                type="text"
                                value={respostasTmp[index]}
                                onChange={(e) => handleRespostaChange(index, e.target.value)}
                                onBlur={() => handleBlur(index)}
                                placeholder={`Resposta ${index + 1}`} />
                            {listIndexErros.includes(index) && <p className="obrigatorio">Obrigatório</p>}
                            <p className="text-question-confianca">Quão confiante você se sentiu para responder essa pergunta?</p>
                            <div className="radio-group">
                                {opcoes.map((opcao, index_radio) => (
                                    <div key={index_radio} className="radio-container">
                                        <label >
                                            <input
                                                type="radio"
                                                value={opcao}
                                                checked={confiancasTmp[index] === opcao}
                                                onChange={(e) => handleConfiancaChange(index, e.target.value)}
                                            />
                                            {opcao}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="dropdown-group">
                                <select
                                    value={confiancasTmp[index] || ''}
                                    onChange={(e) => handleConfiancaChange(index, e.target.value)}>
                                    {!confiancasTmp[index] && <option value="" disabled>Selecione um nível de confiança</option>}
                                    {opcoes.map((opcao, index) => (
                                        <option key={index} value={opcao}>{opcao}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

            </RightComponent>
            <ConfirmacaoModal showModal={showModal} title={"Você tem certeza que deseja enviar as respostas do questionário?"} text={"Após o envio, não será possível editar ou excluir."} cancelButton={() => setShowModal(false)} confirmButton={confirmar} />
        </form>
    )
}