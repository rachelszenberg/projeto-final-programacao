import { Button } from './Button';

export const BasicScreen = (props) => {
    return (

        <div className="screen-global-div">
            <p className="screen-title">{props.title}</p>

            {props.upper_text && <p className="screen-text">{props.upper_text}</p>}

            <div className="screen-img">
                {props.img}
            </div>

            {props.under_text && <p className="screen-text">{props.under_text}</p>}

            {props.upper_text && <Button
                onClick={props.button_click}
                label={props.button_text}
            />}
        </div>
    );
}