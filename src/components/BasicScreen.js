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

            {props.button_text && <Button
                onClick={props.button_click}
                label={props.button_text}
            />}

            {props.underline_button_text && <button
                className="underline-button"
                onClick={props.underline_button_click}
            >{props.underline_button_text}</button>}
        </div>
    );
}