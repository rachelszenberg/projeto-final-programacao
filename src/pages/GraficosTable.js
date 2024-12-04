import React from 'react';
import { Header } from '../components/Header';
import { NotasTable } from '../components/NotasTable';
import { TemposTable } from '../components/TemposTable';
import { useDispatch, useSelector } from 'react-redux';
import { selectTabelaAtual, switchTabela } from '../features/TabelasSlice';
import { ConfiancaTable } from '../components/ConfiancaTable';

export const GraficosTable = () => {
    const dispatch = useDispatch();
    const tabelaAtual = useSelector(selectTabelaAtual).tabela;
    const tabelas = [<NotasTable />, <TemposTable />, <ConfiancaTable />];

    return (
        <div>
            <Header headerText={"Gráficos"} headerButtons grafico />
            <div className='titulo-tabelas-container'>
                <div className={(tabelaAtual === 0) ? "aba-ativa" : ((tabelaAtual === 1) ? "aba-inativa inativa-esquerda" : "aba-inativa inativa-total")} onClick={() => dispatch(switchTabela(0))}>Gráfico das médias das notas</div>
                <div className={(tabelaAtual === 1) ? "aba-ativa" : ((tabelaAtual === 0) ? "aba-inativa inativa-direita" : "aba-inativa inativa-esquerda")} onClick={() => dispatch(switchTabela(1))}>Gráfico dos tempos de Respostas</div>
                <div className={(tabelaAtual === 2) ? "aba-ativa" : ((tabelaAtual === 1) ? "aba-inativa inativa-direita" : "aba-inativa inativa-total")} onClick={() => dispatch(switchTabela(2))}>Gráfico de Confiança</div>
            </div>
            {tabelas[tabelaAtual] || null}
        </div>
    );
};