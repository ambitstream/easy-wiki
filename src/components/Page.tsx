import { useState, useEffect } from "react";
import OpenAI from "openai";
import axios from "axios";
import Layout from './Layout';
import { getRoot } from '../helpers/utils';

import loadingGif from '../images/loading.gif';

interface Props {
    pageId: string,
};

const Page = ({ pageId }: Props) => {
    const [title, setTitle] = useState('Page ' + pageId);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [thinking, setThinking] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (pageId) {
            setLoading(true);

            const params = {
                action: 'query',
                format: 'json',
                pageids: pageId,
                prop: 'extracts',
                explaintext: true,
                origin: '*'
            };

            axios.get('https://en.wikipedia.org/w/api.php', { params })
                .then(response => {
                    const data = response.data?.query?.pages[pageId];
                    const text = data.extract.slice(0, 10000);

                    setTitle(data.title);
                    setLoading(false);
                    gptRequest(text);
                })
                .catch(error => {
                    setError(error);
                    setLoading(false);
                });
        }
    }, [pageId]);

    async function gptRequest(text: string) {
        try {
            if (!text) return false;

            const openAIKey = localStorage.getItem('openAIKey');
    
            if (!openAIKey) {
                setError('ChatGPT API key not provided');
                return false;
            }
    
            const openai = new OpenAI({
                apiKey: openAIKey || undefined,
                dangerouslyAllowBrowser: true
            });
    
            setThinking(true);
    
            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: 'user', content: 'Retell the following in three sentences: ' + text }],
            });
    
            const result = chatCompletion.choices[0].message.content;
    
            if (result) {
                setContent(result);
            }
            setThinking(false);
        } catch {
            setThinking(false);
            setError('OpenAI API Error');
        }
    };

    return (
        <Layout loading={loading}>
            <h3>{title}</h3>
            <div style={ error ? { color: 'red' } : undefined}>
                {thinking ?
                    <img width={20} src={loadingGif} alt="" />
                : error || content}
            </div>
            <div className="page-footer">
                <a href={getRoot()}>&larr; Back</a>
                {title ?
                    <a href={`https://en.wikipedia.org/wiki/${title}`} target="_blank" rel="noreferrer">Full article</a>
                : ''}
            </div>
        </Layout>
    );
};

export default Page;