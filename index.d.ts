/// <reference types="preact" />

import * as preact from 'preact';

declare class PreactHelmet extends preact.Component<
    PreactHelmet.HelmetProps,
    any
> {
    render(...args: any[]): JSX.Element | null;
}

declare namespace PreactHelmet {
    function peek(): PreactHelmet.HelmetData;
    function rewind(): PreactHelmet.HelmetData;

    interface HelmetProps {
        base?: any;
        defaultTitle?: string;
        htmlAttributes?: any;
        link?: Array<any>;
        meta?: Array<any>;
        script?: Array<any>;
        style?: Array<any>;
        title?: string;
        titleTemplate?: string;
        onChangeClientState?: (newState: any) => void;
    }

    interface HelmetData {
        base: HelmetDatum;
        htmlAttributes: HelmetDatum;
        link: HelmetDatum;
        meta: HelmetDatum;
        script: HelmetDatum;
        style: HelmetDatum;
        title: HelmetDatum;
    }

    interface HelmetDatum {
        toString(): string;
        toComponent(): preact.Component<any, any>;
    }
}

export default PreactHelmet;
