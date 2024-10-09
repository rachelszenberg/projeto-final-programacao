import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmacaoModal } from "./ConfirmacaoModal";
import { useNavigate } from "react-router-dom";
import { decrementIndex, incrementIndex, selectRespostasAtuais, setAvaliacaoRespostas, addResposta } from "../features/RespostaAtualSlice";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { RightComponent } from "./RightComponent";

export const Perguntas = (props) => {
    const dispatch = useDispatch();
    const respostas = useSelector(selectRespostasAtuais);
    const allPerguntas = useSelector(selectAllPerguntas);
    const navigate = useNavigate();

    const questionario = props.questionariosAbertos[respostas.respostaIndex];

    const [respostasTmp, setRespostasTmp] = useState([]);
    const [listIndexErros, setListIndexErros] = useState([]);
    const [podeVoltar, setPodeVoltar] = useState();
    const [temProximo, setTemProximo] = useState();
    const [qtdRespondidas, setQtdRespondidas] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const regex = useMemo(() => /([a-zA-Z0-9].*){3,}/, []);


    let perguntas = [];
    questionario.perguntas.forEach((p_id) => {
        const perguntaTemp = allPerguntas.find(pergunta => pergunta.id === p_id).pergunta;
        perguntas.push(perguntaTemp);
    });

    useEffect(() => {
        const perguntaTemResposta = respostas.listRespostas[respostas.respostaIndex];
        const respostasIniciais = perguntaTemResposta ? perguntaTemResposta.respostasPergunta : [];
        setRespostasTmp(respostasIniciais.length ? respostasIniciais : Array(perguntas.length).fill(''));
        setPodeVoltar(respostas.respostaIndex !== 0);
        setTemProximo(respostas.respostaIndex !== props.questionariosAbertos.length - 1)
        setListIndexErros([]);
    }, [questionario.perguntas, respostas.listRespostas, respostas.respostaIndex, props.questionariosAbertos.length, perguntas.length])

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
        dispatch(decrementIndex());
    };

    const onProximo = (e) => {
        e.preventDefault();
        let erros = []
        respostasTmp.forEach((r, index) => { if (!regex.test(r)) { erros.push(index); } });
        if (erros.length === 0) {
            dispatch(setAvaliacaoRespostas({ idQuestionario: questionario.id, idPdf: questionario.pdf.id, respostasPergunta: respostasTmp }));
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
            setShowModal(true);
        }
        else {
            setListIndexErros(erros);
        }
    };

    const confirmar = () => {
        dispatch(addResposta({ perguntas }))
        navigate('/obrigado', { state: { title: "Obrigado pelas suas respostas!", text: "Salvamos todas para a avaliação.", buttonText: "Responder novamente" } })
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
                buttonNextOrSaveClass={(qtdRespondidas !== perguntas.length) ? "button-disabled no-hover" : undefined}
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
                        </div>
                    ))}
                </div>
            </RightComponent>
            <ConfirmacaoModal showModal={showModal} title={"Você tem certeza que deseja enviar as respostas do questionário?"} text={"Após o envio, não será possível editar ou excluir."} cancelButton={() => setShowModal(false)} confirmButton={confirmar} />
        </form>
    )
}