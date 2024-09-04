import { PropsWithChildren, useState } from 'react'
import logo from '../images/logo.png';

type LayoutProps = {
  loading: boolean
}

const Layout = (props: PropsWithChildren<LayoutProps>) => {
    const openAIKey = localStorage.getItem('openAIKey');
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [key, setKey] = useState("");

    const onKeySumbit = () => {
        localStorage.setItem('openAIKey', key);
        setKey("");
        setIsPromptVisible(false);
    };

    return (
        <div className="outer-wrapper">
            <div className="inner-wrapper">
                <header className="app-header">
                    <img className="app-logo" src={logo} alt="Logo" />
                    <div className="help-icon">?</div>
                    <div className="help-bubble">
                        Choose the article of interest, and AI will summarize it for you in a few sentences.
                    </div>
                    {openAIKey ?
                        <div
                            onClick={() => setIsPromptVisible(true)}
                            className="key-icon"
                        >Change Key</div>
                    : ""}
                </header>
                {!openAIKey ?
                    <div
                        onClick={() => setIsPromptVisible(true)}
                        className="alert-text"
                    >Please set you ChatGPT API key to use this app</div>
                : ''}
                {props.children}
                </div>
            {props.loading ?
                <div className="loading"></div>
            : ''}
            {isPromptVisible ?
                <div className="prompt-modal">
                    <div
                        onClick={() => setIsPromptVisible(false)}
                        className="close-button"
                    >x</div>
                    <form onSubmit={onKeySumbit} className="prompt-modal-form">
                        <input
                            type="text"
                            className="common-input"
                            value={key}
                            onChange={e => setKey(e.target.value)}
                            autoFocus
                        />
                        <input
                            type="submit"
                            value="Save"
                            disabled={!key}
                        />
                    </form>
                </div>
            : ''}
        </div>
    );
};

export default Layout;