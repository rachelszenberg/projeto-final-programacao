import { ReactComponent as Obrigada } from '../svg/obrigado.svg'
import { useNavigate } from 'react-router-dom';

export const Obrigado = (props) => {

    
    const navigate = useNavigate()
    
    return (
        
    <div className="thank-you-container">
        <h1>Obrigado pela sua resposta!</h1>

        <div className="illustration">
            <Obrigada/>
        </div>

        <p>Salvamos a sua resposta para a avaliação</p>

        <p className="retry-button" onClick={() => navigate('/')}>
            Responder novamente
        </p>
    </div>
    );
}