import Modal from 'react-modal'
import { Button } from './Button';
import { ReactComponent as Error } from '../svg/error.svg'
import { useNavigate } from 'react-router-dom';

export const PageError = (props) => {

    
    const navigate = useNavigate()
    
    return (
        
    <div className="thank-you-container">
        <h1>Ops!</h1>

        <p>Essa tela não existe no sistema</p>

        <div className="illustration">
            <Error/>
        </div>

        <p className="retry-button" onClick={() => navigate('/')}>
            Ir para a tela de avaliação
        </p>
    </div>
    );
}