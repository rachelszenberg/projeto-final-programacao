import { useEffect, useState } from "react";
import { Button } from "./Button";
import { RxChevronRight, RxChevronLeft } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmacaoModal } from "./ConfirmacaoModal";
import { useNavigate } from "react-router-dom";
import { decrementIndex, incrementIndex, selectAllRespostas, setAvaliacaoRespostas, addResposta } from "../features/RespostasSlice";
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { selectAllPerguntas } from "../features/PerguntasSlice";
import { ProgressBar } from "./ProgressBar";

export const Perguntas = () => {
    const dispatch = useDispatch();
    const questionarios = useSelector(selectAllQuestionarios);
    const respostas = useSelector(selectAllRespostas);
    const allPerguntas = useSelector(selectAllPerguntas);
    const navigate = useNavigate();

    const questionario = questionarios[respostas.respostaIndex];

    const [respostasTmp, setRespostasTmp] = useState([]);
    const [listIndexErros, setListIndexErros] = useState([]);
    const [podeVoltar, setPodeVoltar] = useState();
    const [temProximo, setTemProximo] = useState();
    const [qtdRespondidas, setQtdRespondidas] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const regex = /([a-zA-Z0-9].*){3,}/;
    

    let perguntas = [];
    questionario.perguntas.map((p_id) => {
        const perguntaTemp = allPerguntas.find(pergunta => pergunta.id === p_id).pergunta;
        perguntas.push(perguntaTemp);
    });

    useEffect(() => {
        const perguntaTemResposta = respostas.listRespostas[respostas.respostaIndex];
        const respostasIniciais = perguntaTemResposta ? perguntaTemResposta.respostasPergunta : [];
        setRespostasTmp(respostasIniciais.length ? respostasIniciais : Array(perguntas.length).fill(''));
        setPodeVoltar(respostas.respostaIndex !== 0);
        setTemProximo(respostas.respostaIndex !== questionarios.length - 1)
        setListIndexErros([]);
    }, [questionario.perguntas])

    useEffect(() => {
        let temp = 0;
        respostasTmp.forEach((r) => { if (regex.test(r)) { temp += 1; } })
        setQtdRespondidas(temp);
    }, [respostasTmp])

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
        respostasTmp.map((r, index) => { if (!regex.test(r)) { erros.push(index); } });
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
        respostasTmp.map((r, index) => { if (!regex.test(r)) { erros.push(index); } });
        if (erros.length === 0) {
            dispatch(setAvaliacaoRespostas({ idQuestionario: questionario.id, idPdf: questionario.pdf.id, respostasPergunta: respostasTmp }));
            setShowModal(true);
        }
        else {
            setListIndexErros(erros);
        }
    };

    const confirmar = () => {
        dispatch(addResposta())
        navigate('/obrigado')
    }

    return (
        <form className="div-form">
            <div className="div-title-avaliacao">
                <p className="title-avaliacao">Avaliação {respostas.respostaIndex + 1}/{questionarios.length}</p>
                <ProgressBar total={questionarios.length} ind={qtdRespondidas === perguntas.length ? respostas.respostaIndex + 1 : respostas.respostaIndex} />
            </div>
            <div className="form">
                {perguntas.map((pergunta, index) => (
                    <div key={index}>
                        <p className="text-question">{index + 1}. {pergunta} <span className="obrigatorio">*</span></p>
                        <textarea
                            rows={4}
                            className={(listIndexErros.includes(index) && respostasTmp[index] === "") && "input-error"}
                            type="text"
                            value={respostasTmp[index]} 
                            onChange={(e) => handleRespostaChange(index, e.target.value)} 
                            onBlur={() => handleBlur(index)}
                            placeholder={`Resposta ${index + 1}`} />
                        {listIndexErros.includes(index) && <p className="obrigatorio">Obrigatório</p>}
                    </div>
                ))}
            </div>
            <div className="div-form-button">
                {podeVoltar && <Button
                    onClick={onVoltar}
                    label="Voltar"
                    class="button-cancel"
                    iconLeft=<RxChevronLeft />
                />}
                <div className="button-right">
                    {temProximo
                        ? <Button
                            class={qtdRespondidas !== perguntas.length && "button-disabled no-hover"}
                            onClick={onProximo}
                            label="Próximo"
                            iconRight=<RxChevronRight />
                        />
                        :
                        <Button
                            class={qtdRespondidas !== perguntas.length && "button-disabled no-hover"}
                            onClick={onEnviar}
                            label="Enviar"
                        />
                    }
                </div>
            </div>
            <ConfirmacaoModal showModal={showModal} cancelButton={() => setShowModal(false)} confirmButton={confirmar} />
        </form>
    )
}