import React from 'react';
import { Header } from '../components/Header';
import { NotasTable } from '../components/NotasTable';
import { TemposTable } from '../components/TemposTable';
import { useDispatch, useSelector } from 'react-redux';
import { selectTabelaAtual, switchTabela } from '../features/TabelasSlice';
import { ConfiancaNotaTable } from '../components/ConfiancaNotaTable';

export const GraficosTable = () => {
    const dispatch = useDispatch();
    const tabelaAtual = useSelector(selectTabelaAtual).tabela;
    const tabelas = [<NotasTable />, <TemposTable />, <ConfiancaNotaTable/>];

    return (
        <div>
            <Header headerText={"Gráficos"} headerButtons grafico />
            <div className='titulo-tabelas-container'>
                <div className={(tabelaAtual === 0) ? "aba-ativa" : ((tabelaAtual === 1) ? "aba-inativa inativa-esquerda" : "aba-inativa inativa-total")} onClick={() => dispatch(switchTabela(0))}>Médias das notas</div>
                <div className={(tabelaAtual === 1) ? "aba-ativa" : ((tabelaAtual === 0) ? "aba-inativa inativa-direita" : "aba-inativa inativa-esquerda")} onClick={() => dispatch(switchTabela(1))}>Tempos de Respostas</div>
                <div className={(tabelaAtual === 2) ? "aba-ativa" : ((tabelaAtual === 1) ? "aba-inativa inativa-direita" : "aba-inativa inativa-total")} onClick={() => dispatch(switchTabela(2))}>Confiança X Nota</div>
            </div>
            {tabelas[tabelaAtual] || null}
        </div>
    );
};