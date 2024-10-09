import { BasicScreen } from '../components/BasicScreen';
import { ReactComponent as QuestionariosFechadosSvg } from '../svg/questionariosFechados.svg';

export const QuestionariosFechados = () => {
    return (
        <BasicScreen
            title="Ops!"
            under_text="No memento, todos os questionários estão fecharam"
            img=<QuestionariosFechadosSvg/>
        />
    );
}