import { BasicScreen } from '../components/BasicScreen';
import { ReactComponent as ObrigadoSvg } from '../svg/obrigado.svg'
import { useNavigate } from 'react-router-dom';

export const Obrigado = () => {
    const navigate = useNavigate()

    return (
        <BasicScreen
            title="Obrigado pela sua resposta!"
            under_text="Salvamos a sua resposta para a avaliação"
            button_click={() => navigate('/')}
            button_text="Responder novamente"
            img=<ObrigadoSvg/>
        />
    );
}