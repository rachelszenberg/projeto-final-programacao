import { useEffect, useState } from "react";
import { Button } from "./Button";
// import { RxChevronRight, RxChevronLeft } from "react-icons/rx";
// import { AiOutlineSend } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmacaoModal } from "./ConfirmacaoModal";
import { useNavigate } from "react-router-dom";
import { decrementIndex, incrementIndex, selectAllRespostas, setAvaliacaoRespostas, addResposta } from "../features/RespostasSlice";
import { selectAllQuestionarios } from "../features/QuestionarioSlice";
import { ProgressBar } from "./ProgressBar";

export const Perguntas = (props) => {
    const dispatch = useDispatch();
    const questionarios = useSelector(selectAllQuestionarios);
    const respostas = useSelector(selectAllRespostas);
    const navigate = useNavigate()

    const questionario = questionarios[respostas.respostaIndex];
    const perguntas = questionario.perguntas;
    const perguntaTemResposta = respostas.listRespostas.find(respostas => respostas.id === questionario.id);
    const respostasIniciais = perguntaTemResposta ? perguntaTemResposta.respostasPergunta : [];

    const [respostasTmp, setRespostasTmp] = useState([]);
    const [listIndexErros, setListIndexErros] = useState([]);
    const [podeVoltar, setPodeVoltar] = useState();
    const [temProximo, setTemProximo] = useState();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setRespostasTmp(respostasIniciais.length ? respostasIniciais : Array(perguntas.length).fill(''));
        setPodeVoltar(respostas.respostaIndex !== 0);
        setTemProximo(respostas.respostaIndex !== questionarios.length - 1)
        setListIndexErros([]);
    }, [perguntas])

    const handleRespostaChange = (index, value) => {
        const novasRespostas = [...respostasTmp];
        novasRespostas[index] = value;
        setRespostasTmp(novasRespostas);
    };

    const onVoltar = (e) => {
        e.preventDefault();
        dispatch(decrementIndex());
    };

    const onProximo = (e) => {
        e.preventDefault();
        let erros = []
        respostasTmp.map((r, index) => {
            if (!r) {
                erros.push(index);
            }
        });
        if (erros.length === 0) {
            dispatch(setAvaliacaoRespostas({ id: questionario.id, respostasPergunta: respostasTmp }));
            dispatch(incrementIndex());
        }
        else {
            setListIndexErros(erros);
        }
    };

    const onEnviar = (e) => {
        e.preventDefault();
        let erros = []
        respostasTmp.map((r, index) => {
            if (!r) {
                erros.push(index);
            }
        });
        if (erros.length === 0) {
            dispatch(setAvaliacaoRespostas({ id: questionario.id, respostasPergunta: respostasTmp }));
            setShowModal(true);
        }
        else {
            setListIndexErros(erros);
        }
    };

    const confirmar = () => {
        // TODO: salvar no firebase
        dispatch(addResposta(respostas))
        navigate('/obrigado')
    }

    return (
        <form className="div-form">
            <div className="div-title-avaliacao">
                <p className="title-avaliacao">Avaliação</p>
                <div>
                    <ProgressBar total={questionarios.length} ind={respostas.respostaIndex} />
                </div>
            </div>
            <div className="form">
                {listIndexErros.length > 0 && <p className="form_error">Por favor, preencha todos os campos!</p>}
                {perguntas.map((pergunta, index) => (
                    <div key={index}>
                        <p className={`text-question ${(listIndexErros.includes(index) && respostasTmp[index] === "") && 'text-error'}`}>{pergunta}</p>
                        <textarea
                            rows={4}
                            className={(listIndexErros.includes(index) && respostasTmp[index] === "") && "input-error"}
                            type="text"
                            value={respostasTmp[index]}
                            onChange={(e) => handleRespostaChange(index, e.target.value)}
                            placeholder={`Resposta ${index + 1}`} />
                    </div>
                ))}
            </div>
            <div className="div-form-button">
                {podeVoltar && <Button
                    onClick={onVoltar}
                    label="Voltar"
                    class="button-cancel"
                />}
                <div className="button-right">
                    {temProximo
                        ? <Button
                            onClick={onProximo}
                            label="Próximo"
                            class="button-save"
                        />
                        :
                        <Button
                            onClick={onEnviar}
                            label="Enviar"
                            class="button-send"
                        />
                    }
                </div>
            </div>
            <ConfirmacaoModal showModal={showModal} cancelButton={() => setShowModal(false)} confirmButton={confirmar} />
        </form>
    )
}