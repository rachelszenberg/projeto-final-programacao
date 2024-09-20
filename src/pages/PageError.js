import { BasicScreen } from '../components/BasicScreen';
import { ReactComponent as Error } from '../svg/error.svg';
import { useNavigate } from 'react-router-dom';

export const PageError = () => {
    const navigate = useNavigate()

    return (
        <BasicScreen
            title="Ops!"
            upper_text="Essa tela não existe no sistema"
            button_click={() => navigate('/')}
            button_text="Ir para a tela de avaliação"
            img=<Error/>
        />
    );
}