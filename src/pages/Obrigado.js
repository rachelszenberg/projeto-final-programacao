import { BasicScreen } from '../components/BasicScreen';
import { ReactComponent as ObrigadoSvg } from '../svg/obrigado.svg'
import { useLocation, useNavigate } from 'react-router-dom';

export const Obrigado = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const title = location.state?.title || "Obrigado!";
    const text = location.state?.text || "Salvamos suas respostas!";
    const buttonText = location.state?.buttonText || "Voltar a tela inicial";
    const buttonNavigate = location.state?.buttonNavigateTo || '/';

    return (
        <BasicScreen
            title={title}
            under_text={text}
            button_click={() => {navigate(buttonNavigate); window.location.reload()}}
            button_text={buttonText}
            img=<ObrigadoSvg/>
        />
    );
}