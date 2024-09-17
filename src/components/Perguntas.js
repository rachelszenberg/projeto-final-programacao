import { useEffect, useState } from "react";
import { Button } from "./Button";
import { RxChevronRight, RxChevronLeft } from "react-icons/rx";
import { AiOutlineSend } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { decrementIndex, incrementIndex, selectAllAvaliacoes, setAvaliacaoRespostas } from "../features/AvaliacaoSlice"
import { ConfirmacaoModal } from "./ConfirmacaoModal";
import { useNavigate } from "react-router-dom";

export const Perguntas = (props) => {
    const dispatch = useDispatch();
    const avaliacao = useSelector(selectAllAvaliacoes);
    const questionario = avaliacao.questionarios[avaliacao.questionarioIndex];
    const perguntas = questionario.perguntas;
    const respostasIniciais = questionario.respostas;
    const navigate = useNavigate()

    const [respostas, setRespostas] = useState([]);
    const [listIndexErros, setListIndexErros] = useState([]);
    const [podeVoltar, setPodeVoltar] = useState();
    const [temProximo, setTemProximo] = useState();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setRespostas(respostasIniciais.length ? respostasIniciais : Array(perguntas.length).fill(''));
        setPodeVoltar(avaliacao.questionarioIndex !== 0);
        setTemProximo(avaliacao.questionarioIndex !== avaliacao.questionarios.length - 1)
        setListIndexErros([]);
    }, [perguntas])

    const handleRespostaChange = (index, value) => {
        const novasRespostas = [...respostas];
        novasRespostas[index] = value;
        setRespostas(novasRespostas);
    };

    const onVoltar = (e) => {
        e.preventDefault();
        dispatch(decrementIndex());
    };

    const onProximo = (e) => {
        e.preventDefault();
        let erros = []
        respostas.map((r, index) => {
            if (!r) {
                erros.push(index);
            }
        });
        if (erros.length === 0) {
            dispatch(setAvaliacaoRespostas(respostas));
            dispatch(incrementIndex());
        }
        else {
            setListIndexErros(erros);
        }
    };

    const onEnviar = (e) => {
        e.preventDefault();
        let erros = []
        respostas.map((r, index) => {
            if (!r) {
                erros.push(index);
            }
        });
        if (erros.length === 0) {
            dispatch(setAvaliacaoRespostas(respostas));
            setShowModal(true);
        }
        else {
            setListIndexErros(erros);
        }
    };

    const confirmar = () => {
        navigate('/obrigado')
    }

    return (
        <form className="div-form">
            <div className="div-title-avaliacao">
                <p className="title-avaliacao">Avaliação</p>
            </div>
            <div className="form">
                {listIndexErros.length > 0 && <p className="form_error">Por favor, preencha todos os campos!</p>}
                {perguntas.map((pergunta, index) => (
                    <div key={index}>
                        <p className={`text-question${(listIndexErros.includes(index) && respostas[index] == "") && 'text-error'}`}>{pergunta}</p>
                        <textarea
                            rows={6}
                            className={(listIndexErros.includes(index) && respostas[index] == "") && "input-error"}
                            type="text"
                            value={respostas[index]}
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
            <ConfirmacaoModal showModal={showModal} cancelButton={()=>setShowModal(false)} confirmButton={confirmar}/>
        </form>
    )
}