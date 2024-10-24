import React, { useCallback, useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { selectAllPerguntasPerfil, addPerfil } from '../features/PerfilSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RightButtonsComponent } from '../components/RightButtonsComponent';
import { useNavigate } from 'react-router-dom';

export const PerfilUsuario = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const perguntasPerfil = useSelector(selectAllPerguntasPerfil);
    const [selecoes, setSelecoes] = useState({});
    const [podeEnviar, setPodeEnviar] = useState(false);

    const handleSelectChange = (id, value) => {
        setSelecoes({
            ...selecoes,
            [id]: value
        });
    };

    const handleTextareaChange = (id, value) => {
        setSelecoes({
            ...selecoes,
            [id]: value
        });
    };

    const onButtonClick = async () => {
        const id = await dispatch(addPerfil(selecoes)).unwrap(); 
        navigate('/questionario', { state: { idUsuario: id } });
    }

    const verificarRespostas = useCallback(() => {
        return perguntasPerfil.every((p, index) => {
            if (p.opcoes) {
                return selecoes[p.id] !== undefined && selecoes[p.id] !== '';
            } else {
                const perguntaAnterior = perguntasPerfil[index - 1];
                const respostaAnteriorValida = perguntaAnterior &&
                    ["Ensino superior incompleto", "Ensino superior completo", "Pós-graduação"].includes(selecoes[perguntaAnterior.id]);

                if (respostaAnteriorValida) {
                    return selecoes[p.id] !== undefined && selecoes[p.id] !== '';
                }
                return true;
            }
        });
    }, [perguntasPerfil, selecoes]);


    useEffect(() => {
        setPodeEnviar(verificarRespostas());
    }, [verificarRespostas]);

    return (
        <div>
            <Header headerText={"Seu perfil"} />
            <div className="perfil-container">
                {perguntasPerfil.map((p, index) => (
                    <div key={p.id} className="perfil-div">
                        {p.opcoes
                            ?
                            <div>
                                <p className="text-question-perfil">{p.pergunta}</p>
                                <select
                                    value={selecoes[p.id] || ''}
                                    onChange={(e) => handleSelectChange(p.id, e.target.value)}>
                                    {!selecoes[p.id] && <option value="" disabled>Selecione uma opção</option>}
                                    {p.opcoes.map((opcao, index) => (
                                        <option key={index} value={opcao}>{opcao}</option>
                                    ))}
                                </select>
                            </div>
                            : ["Ensino superior incompleto", "Ensino superior completo", "Pós-graduação"].includes(selecoes[perguntasPerfil[index - 1]?.id]) &&
                            <div>
                                <p className="text-question-perfil">{p.pergunta}</p>
                                <textarea
                                    value={selecoes[p.id] || ''}
                                    onChange={(e) => handleTextareaChange(p.id, e.target.value)}
                                ></textarea>
                            </div>
                        }
                    </div>
                ))}
                <RightButtonsComponent className="div-bottom"
                    temProximo={true}
                    onProximo={onButtonClick}
                    textProximo={"Responder avaliação"}
                    noMarginTop
                    buttonNextOrSaveClass={!podeEnviar ? "button-disabled-perfil" : undefined}

                />
            </div>
        </div>
    );
};