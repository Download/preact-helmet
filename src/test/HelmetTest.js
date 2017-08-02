/* eslint max-nested-callbacks: [1, 5] */

import {h, render} from "preact"; /** @jsx h */

import {render as renderToString} from "preact-render-to-string";
import Helmet from "../Helmet";

const HELMET_ATTRIBUTE = "data-preact-helmet";

describe("Helmet", () => {
    let headElement;

    const container = document.createElement("div");
    let child;

    beforeEach(() => {
        headElement = headElement || document.head || document.querySelector("head");
    });

    afterEach(() => {
        child = unmountComponentAtNode(container, child);
    });

    describe("api", () => {
        describe("title", () => {
            it("can update page title", () => {
                child = render(
                    <Helmet
                        defaultTitle={"Fallback"}
                        title={"Test Title"}
                    />,
                    container, child
                );

                expect(document.title).to.equal("Test Title");
            });

            it("can update page title with multiple children", () => {
                child = render(
                    <div>
                        <Helmet title={"Test Title"} />
                        <Helmet title={"Child One Title"} />
                        <Helmet title={"Child Two Title"} />
                    </div>,
                    container, child
                );

                expect(document.title).to.equal("Child Two Title");
            });

            it("will set title based on deepest nested component", () => {
                child = render(
                    <div>
                        <Helmet title={"Main Title"} />
                        <Helmet title={"Nested Title"} />
                    </div>,
                    container, child
                );

                expect(document.title).to.equal("Nested Title");
            });

            it("will set title using deepest nested component with a defined title", () => {
                child = render(
                    <div>
                        <Helmet title={"Main Title"} />
                        <Helmet />
                    </div>,
                    container, child
                );

                expect(document.title).to.equal("Main Title");
            });

            it("will use defaultTitle if no title is defined", () => {
                child = render(
                    <Helmet
                        defaultTitle={"Fallback"}
                        title={""}
                        titleTemplate={"This is a %s of the titleTemplate feature"}
                    />,
                    container, child
                );

                expect(document.title).to.equal("Fallback");
            });

            it("will use a titleTemplate if defined", () => {
                child = render(
                    <Helmet
                        defaultTitle={"Fallback"}
                        title={"Test"}
                        titleTemplate={"This is a %s of the titleTemplate feature"}
                    />,
                    container, child
                );

                expect(document.title).to.equal("This is a Test of the titleTemplate feature");
            });

            it("will replace multiple title strings in titleTemplate", () => {
                child = render(
                    <Helmet
                        title={"Test"}
                        titleTemplate={"This is a %s of the titleTemplate feature. Another %s."}
                    />,
                    container, child
                );

                expect(document.title).to.equal("This is a Test of the titleTemplate feature. Another Test.");
            });

            it("will use a titleTemplate based on deepest nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            title={"Test"}
                            titleTemplate={"This is a %s of the titleTemplate feature"}
                        />
                        <Helmet
                            title={"Second Test"}
                            titleTemplate={"A %s using nested titleTemplate attributes"}
                        />
                    </div>,
                    container, child
                );

                expect(document.title).to.equal("A Second Test using nested titleTemplate attributes");
            });

            it("will merge deepest component title with nearest upstream titleTemplate", () => {
                child = render(
                    <div>
                        <Helmet
                            title={"Test"}
                            titleTemplate={"This is a %s of the titleTemplate feature"}
                        />
                        <Helmet title={"Second Test"} />
                    </div>,
                    container, child
                );

                expect(document.title).to.equal("This is a Second Test of the titleTemplate feature");
            });

            it("will render dollar characters in a title correctly when titleTemplate present", () => {
                const dollarTitle = "te$t te$$t te$$$t te$$$$t";

                child = render(
                    <Helmet title={dollarTitle}
                            titleTemplate={"This is a %s"}
                    />,
                    container, child
                );

                expect(document.title).to.equal("This is a te$t te$$t te$$$t te$$$$t");
            });

            it("will not encode all characters with HTML character entity equivalents", () => {
                const chineseTitle = "膣膗 鍆錌雔";

                child = render(
                    <div>
                        <Helmet title={chineseTitle} />
                    </div>,
                    container, child
                );

                expect(document.title).to.equal(chineseTitle);
            });

            it("page title with prop itemprop", () => {
                child = render(
                    <Helmet
                        defaultTitle={"Fallback"}
                        title={"Test Title with itemProp"}
                        titleAttributes={{itemprop: "name"}}
                    />,
                    container, child
                );

                const titleTag = document.getElementsByTagName("title")[0];
                expect(document.title).to.equal("Test Title with itemProp");
                expect(titleTag.getAttribute("itemprop")).to.equal("name");
            });
        });

        describe("title attributes", () => {
            it("update title attributes", () => {
                child = render(
                    <Helmet
                        titleAttributes={{
                            itemprop: "name"
                        }}
                    />,
                    container, child
                );

                const titleTag = document.getElementsByTagName("title")[0];

                expect(titleTag.getAttribute("itemprop")).to.equal("name");
                expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("itemprop");
            });

            it("set attributes based on the deepest nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            titleAttributes={{
                                "lang": "en",
                                "hidden": undefined
                            }}
                        />
                        <Helmet
                            titleAttributes={{
                                "lang": "ja"
                            }}
                        />
                    </div>,
                    container, child
                );

                const titleTag = document.getElementsByTagName("title")[0];

                expect(titleTag.getAttribute("lang")).to.equal("ja");
                expect(titleTag.getAttribute("hidden")).to.equal("");
                expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("lang,hidden");
            });

            it("handle valueless attributes", () => {
                child = render(
                    <Helmet
                        titleAttributes={{
                            "hidden": undefined
                        }}
                    />,
                    container, child
                );

                const titleTag = document.getElementsByTagName("title")[0];

                expect(titleTag.getAttribute("hidden")).to.equal("");
                expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("hidden");
            });

            it("clears title attributes that are handled within helmet", () => {
                child = render(
                    <Helmet
                        titleAttributes={{
                            "lang": "en",
                            "hidden": undefined
                        }}
                    />,
                    container, child
                );

                child = render(
                    <Helmet />,
                    container, child
                );

                const titleTag = document.getElementsByTagName("title")[0];

                expect(titleTag.getAttribute("lang")).to.be.null;
                expect(titleTag.getAttribute("hidden")).to.be.null;
                expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
            });
        });

        describe("html attributes", () => {
            it("update html attributes", () => {
                child = render(
                    <Helmet
                        htmlAttributes={{
                            "class": "myClassName",
                            "lang": "en"
                        }}
                    />,
                    container, child
                );

                const htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("class")).to.equal("myClassName");
                expect(htmlTag.getAttribute("lang")).to.equal("en");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("class,lang");
            });

            it("set attributes based on the deepest nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            htmlAttributes={{
                                "lang": "en"
                            }}
                        />
                        <Helmet
                            htmlAttributes={{
                                "lang": "ja"
                            }}
                        />
                    </div>,
                    container, child
                );

                const htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("lang")).to.equal("ja");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("lang");
            });

            it("handle valueless attributes", () => {
                child = render(
                    <Helmet
                        htmlAttributes={{
                            "amp": undefined
                        }}
                    />,
                    container, child
                );

                const htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("amp")).to.equal("");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("amp");
            });

            it("clears html attributes that are handled within helmet", () => {
                child = render(
                    <Helmet
                        htmlAttributes={{
                            "lang": "en",
                            "amp": undefined
                        }}
                    />,
                    container, child
                );

                child = render(
                    <Helmet />,
                    container, child
                );

                const htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("lang")).to.be.null;
                expect(htmlTag.getAttribute("amp")).to.be.null;
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
            });

            it("updates with multiple additions and removals - overwrite and new", () => {
                child = render(
                    <Helmet
                        htmlAttributes={{
                            "lang": "en",
                            "amp": undefined
                        }}
                    />,
                    container, child
                );

                child = render(
                    <Helmet
                        htmlAttributes={{
                            "lang": "ja",
                            "id": "html-tag",
                            "title": "html tag"
                        }}
                    />,
                    container, child
                );

                const htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("amp")).to.equal(null);
                expect(htmlTag.getAttribute("lang")).to.equal("ja");
                expect(htmlTag.getAttribute("id")).to.equal("html-tag");
                expect(htmlTag.getAttribute("title")).to.equal("html tag");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("lang,amp,id,title");
            });

            it("updates with multiple additions and removals - all new", () => {
                child = render(
                    <Helmet
                        htmlAttributes={{
                            "lang": "en",
                            "amp": undefined
                        }}
                    />,
                    container, child
                );

                child = render(
                    <Helmet
                        htmlAttributes={{
                            "id": "html-tag",
                            "title": "html tag"
                        }}
                    />,
                    container, child
                );

                const htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("amp")).to.equal(null);
                expect(htmlTag.getAttribute("lang")).to.equal(null);
                expect(htmlTag.getAttribute("id")).to.equal("html-tag");
                expect(htmlTag.getAttribute("title")).to.equal("html tag");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("lang,amp,id,title");
            });

            context("initialized outside of helmet", () => {
                before(() => {
                    const htmlTag = document.getElementsByTagName("html")[0];
                    htmlTag.setAttribute("test", "test");
                });

                it("will not be cleared", () => {
                    child = render(
                        <Helmet />,
                        container, child
                    );

                    const htmlTag = document.getElementsByTagName("html")[0];

                    expect(htmlTag.getAttribute("test")).to.equal("test");
                    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
                });

                it("will be overwritten if specified in helmet", () => {
                    child = render(
                        <Helmet
                            htmlAttributes={{
                                "test": "helmet-attr"
                            }}
                        />,
                        container, child
                    );

                    const htmlTag = document.getElementsByTagName("html")[0];

                    expect(htmlTag.getAttribute("test")).to.equal("helmet-attr");
                    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("test");
                });

                it("can be cleared once it is managed in helmet", () => {
                    child = render(
                        <Helmet
                            htmlAttributes={{
                                "test": "helmet-attr"
                            }}
                        />,
                        container, child
                    );

                    child = render(
                        <Helmet />,
                        container, child
                    );

                    const htmlTag = document.getElementsByTagName("html")[0];

                    expect(htmlTag.getAttribute("test")).to.equal(null);
                    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
                });
            });
        });

        describe("onChangeClientState", () => {
            it("when handling client state change, calls the function with new state, addedTags and removedTags ", () => {
                const spy = sinon.spy();
                child = render(
                    <div>
                        <Helmet
                            base={{"href": "http://mysite.com/"}}
                            link={[{"href": "http://localhost/helmet", "rel": "canonical"}]}
                            meta={[{"charset": "utf-8"}]}
                            script={[{"src": "http://localhost/test.js", "type": "text/javascript"}]}
                            title={"Main Title"}
                            onChangeClientState={spy}
                        />
                    </div>,
                    container, child
                );

                expect(spy.called).to.equal(true);
                const newState = spy.getCall(0).args[0];
                const addedTags = spy.getCall(0).args[1];
                const removedTags = spy.getCall(0).args[2];

                expect(newState).to.contain({title: "Main Title"});
                expect(newState.baseTag).to.contain({href: "http://mysite.com/"});
                expect(newState.metaTags).to.contain({"charset": "utf-8"});
                expect(newState.linkTags).to.contain({"href": "http://localhost/helmet", "rel": "canonical"});
                expect(newState.scriptTags).to.contain({"src": "http://localhost/test.js", "type": "text/javascript"});

                expect(addedTags).to.have.property("baseTag");
                expect(addedTags.baseTag).to.have.deep.property("[0]");
                expect(addedTags.baseTag[0].outerHTML).to.equal(`<base href="http://mysite.com/" ${HELMET_ATTRIBUTE}="true">`);

                expect(addedTags).to.have.property("metaTags");
                expect(addedTags.metaTags).to.have.deep.property("[0]");
                expect(addedTags.metaTags[0].outerHTML).to.equal(`<meta charset="utf-8" ${HELMET_ATTRIBUTE}="true">`);

                expect(addedTags).to.have.property("linkTags");
                expect(addedTags.linkTags).to.have.deep.property("[0]");
                expect(addedTags.linkTags[0].outerHTML).to.equal(`<link href="http://localhost/helmet" rel="canonical" ${HELMET_ATTRIBUTE}="true">`);

                expect(addedTags).to.have.property("scriptTags");
                expect(addedTags.scriptTags).to.have.deep.property("[0]");
                expect(addedTags.scriptTags[0].outerHTML).to.equal(`<script src="http://localhost/test.js" type="text/javascript" ${HELMET_ATTRIBUTE}="true"></script>`);

                expect(removedTags).to.be.empty;
            });

            it("calls the deepest defined callback with the deepest state", () => {
                const spy = sinon.spy();
                child = render(
                    <div>
                        <Helmet title={"Main Title"} onChangeClientState={spy} />
                        <Helmet title={"Deeper Title"} />
                    </div>,
                    container, child
                );

                expect(spy.callCount).to.equal(2);
                expect(spy.getCall(0).args[0]).to.contain({title: "Main Title"});
                expect(spy.getCall(1).args[0]).to.contain({title: "Deeper Title"});
            });
        });

        describe("base tag", () => {
            it("can update base tag", () => {
                child = render(
                    <Helmet
                        base={{"href": "http://mysite.com/"}}
                    />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);

                const filteredTags = [].slice.call(existingTags).filter((tag) => {
                    return tag.getAttribute("href") === "http://mysite.com/";
                });

                expect(filteredTags.length).to.equal(1);
            });

            it("will clear the base tag if one is not specified", () => {
                child = render(
                    <Helmet
                        base={{"href": "http://mysite.com/"}}
                    />,
                    container, child
                );

                child = render(
                    <Helmet />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'href' will not be accepted", () => {
                child = render(
                    <Helmet
                        base={{"property": "won't work"}}
                    />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("will set base tag based on deepest nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            base={{"href": "http://mysite.com/"}}
                        />
                        <Helmet
                            base={{"href": "http://mysite.com/public"}}
                        />
                    </div>,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
                const firstTag = Array.prototype.slice.call(existingTags)[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(1);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("href")).to.equal("http://mysite.com/public");
                expect(firstTag.outerHTML).to.equal(`<base href="http://mysite.com/public" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("won't render tag when primary attribute is null", () => {
                child = render(
                    <Helmet
                        base={{"href": undefined}}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });

        describe("meta tags", () => {
            it("can update meta tags", () => {
                child = render(
                    <Helmet
                        meta={[
                            {"charset": "utf-8"},
                            {"name": "description", "content": "Test description"},
                            {"http-equiv": "content-type", "content": "text/html"},
                            {"property": "og:type", "content": "article"},
                            {"itemprop": "name", "content": "Test name itemprop"}
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);

                expect(existingTags).to.not.equal(undefined);

                const filteredTags = [].slice.call(existingTags).filter((tag) => {
                    return tag.getAttribute("charset") === "utf-8" ||
                        (tag.getAttribute("name") === "description" && tag.getAttribute("content") === "Test description") ||
                        (tag.getAttribute("http-equiv") === "content-type" && tag.getAttribute("content") === "text/html") ||
                        (tag.getAttribute("itemprop") === "name" && tag.getAttribute("content") === "Test name itemprop");
                });

                expect(filteredTags.length).to.be.at.least(4);
            });

            it("will clear all meta tags if none are specified", () => {
                child = render(
                    <Helmet
                        meta={[{"name": "description", "content": "Test description"}]}
                    />,
                    container, child
                );

                child = render(
                    <Helmet />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'name', 'http-equiv', 'property', 'charset', or 'itemprop' will not be accepted", () => {
                child = render(
                    <Helmet
                        meta={[{"href": "won't work"}]}
                    />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("will set meta tags based on deepest nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            meta={[
                                {"charset": "utf-8"},
                                {"name": "description", "content": "Test description"}
                            ]}
                        />
                        <Helmet
                            meta={[
                                {"name": "description", "content": "Inner description"},
                                {"name": "keywords", "content": "test,meta,tags"}
                            ]}
                        />
                    </div>,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);

                const firstTag = existingTags[0];
                const secondTag = existingTags[1];
                const thirdTag = existingTags[2];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(3);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("charset")).to.equal("utf-8");
                expect(firstTag.outerHTML).to.equal(`<meta charset="utf-8" ${HELMET_ATTRIBUTE}="true">`);

                expect(existingTags)
                    .to.have.deep.property("[1]")
                    .that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("name")).to.equal("description");
                expect(secondTag.getAttribute("content")).to.equal("Inner description");
                expect(secondTag.outerHTML).to.equal(`<meta name="description" content="Inner description" ${HELMET_ATTRIBUTE}="true">`);

                expect(existingTags)
                    .to.have.deep.property("[2]")
                    .that.is.an.instanceof(Element);
                expect(thirdTag).to.have.property("getAttribute");
                expect(thirdTag.getAttribute("name")).to.equal("keywords");
                expect(thirdTag.getAttribute("content")).to.equal("test,meta,tags");
                expect(thirdTag.outerHTML).to.equal(`<meta name="keywords" content="test,meta,tags" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("will allow duplicate meta tags if specified in the same component", () => {
                child = render(
                    <Helmet
                        meta={[
                            {"name": "description", "content": "Test description"},
                            {"name": "description", "content": "Duplicate description"}
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];
                const secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(2);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("name")).to.equal("description");
                expect(firstTag.getAttribute("content")).to.equal("Test description");
                expect(firstTag.outerHTML).to.equal(`<meta name="description" content="Test description" ${HELMET_ATTRIBUTE}="true">`);

                expect(existingTags)
                    .to.have.deep.property("[1]")
                    .that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("name")).to.equal("description");
                expect(secondTag.getAttribute("content")).to.equal("Duplicate description");
                expect(secondTag.outerHTML).to.equal(`<meta name="description" content="Duplicate description" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("will override duplicate meta tags with single meta tag in a nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            meta={[
                                {"name": "description", "content": "Test description"},
                                {"name": "description", "content": "Duplicate description"}
                            ]}
                        />
                        <Helmet
                            meta={[
                                {"name": "description", "content": "Inner description"}
                            ]}
                        />
                    </div>,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(1);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("name")).to.equal("description");
                expect(firstTag.getAttribute("content")).to.equal("Inner description");
                expect(firstTag.outerHTML).to.equal(`<meta name="description" content="Inner description" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("will override single meta tag with duplicate meta tags in a nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            meta={[
                                {"name": "description", "content": "Test description"}
                            ]}
                        />
                        <Helmet
                            meta={[
                                {"name": "description", "content": "Inner description"},
                                {"name": "description", "content": "Inner duplicate description"}
                            ]}
                        />
                    </div>,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];
                const secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(2);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("name")).to.equal("description");
                expect(firstTag.getAttribute("content")).to.equal("Inner description");
                expect(firstTag.outerHTML).to.equal(`<meta name="description" content="Inner description" ${HELMET_ATTRIBUTE}="true">`);

                expect(existingTags)
                    .to.have.deep.property("[1]")
                    .that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("name")).to.equal("description");
                expect(secondTag.getAttribute("content")).to.equal("Inner duplicate description");
                expect(secondTag.outerHTML).to.equal(`<meta name="description" content="Inner duplicate description" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("won't render tag when primary attribute is null", () => {
                child = render(
                    <Helmet
                        meta={[
                            {"name": undefined, "content": "Inner duplicate description"}
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });

        describe("link tags", () => {
            it("can update link tags", () => {
                child = render(
                    <Helmet
                        link={[
                            {"href": "http://localhost/helmet", "rel": "canonical"},
                            {"href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css"}
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);

                expect(existingTags).to.not.equal(undefined);

                const filteredTags = [].slice.call(existingTags).filter((tag) => {
                    return (tag.getAttribute("href") === "http://localhost/style.css" && tag.getAttribute("rel") === "stylesheet" && tag.getAttribute("type") === "text/css") ||
                        (tag.getAttribute("href") === "http://localhost/helmet" && tag.getAttribute("rel") === "canonical");
                });

                expect(filteredTags.length).to.be.at.least(2);
            });

            it("will clear all link tags if none are specified", () => {
                child = render(
                    <Helmet
                        link={[
                            {"href": "http://localhost/helmet", "rel": "canonical"}
                        ]}
                    />,
                    container, child
                );

                child = render(
                    <Helmet />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'href' or 'rel' will not be accepted, even if they are valid for other tags", () => {
                child = render(
                    <Helmet
                        link={[{"http-equiv": "won't work"}]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags 'rel' and 'href' will properly use 'rel' as the primary identification for this tag, regardless of ordering", () => {
                child = render(
                    <div>
                        <Helmet
                            link={[{"href": "http://localhost/helmet", "rel": "canonical"}]}
                        />
                        <Helmet
                            link={[{"rel": "canonical", "href": "http://localhost/helmet/new"}]}
                        />
                        <Helmet
                            link={[{"href": "http://localhost/helmet/newest", "rel": "canonical"}]}
                        />
                    </div>,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(1);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/newest");
                expect(firstTag.outerHTML).to.equal(`<link href="http://localhost/helmet/newest" rel="canonical" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("tags with rel='stylesheet' will use the href as the primary identification of the tag, regardless of ordering", () => {
                child = render(
                    <div>
                        <Helmet
                            link={[
                                {"href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css", "media": "all"}
                            ]}
                        />
                        <Helmet
                            link={[
                                {"rel": "stylesheet", "href": "http://localhost/inner.css", "type": "text/css", "media": "all"}
                            ]}
                        />
                    </div>,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];
                const secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(2);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/style.css");
                expect(firstTag.getAttribute("rel")).to.equal("stylesheet");
                expect(firstTag.getAttribute("type")).to.equal("text/css");
                expect(firstTag.getAttribute("media")).to.equal("all");
                expect(firstTag.outerHTML).to.equal(`<link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" ${HELMET_ATTRIBUTE}="true">`);

                expect(existingTags)
                    .to.have.deep.property("[1]")
                    .that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("rel")).to.equal("stylesheet");
                expect(secondTag.getAttribute("href")).to.equal("http://localhost/inner.css");
                expect(secondTag.getAttribute("type")).to.equal("text/css");
                expect(secondTag.getAttribute("media")).to.equal("all");
                expect(secondTag.outerHTML).to.equal(`<link rel="stylesheet" href="http://localhost/inner.css" type="text/css" media="all" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("will set link tags based on deepest nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            link={[
                                {"rel": "canonical", "href": "http://localhost/helmet"},
                                {"href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css", "media": "all"}
                            ]}
                        />
                        <Helmet
                            link={[
                                {"rel": "canonical", "href": "http://localhost/helmet/innercomponent"},
                                {"href": "http://localhost/inner.css", "rel": "stylesheet", "type": "text/css", "media": "all"}
                            ]}
                        />
                    </div>,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];
                const secondTag = existingTags[1];
                const thirdTag = existingTags[2];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.at.least(2);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/style.css");
                expect(firstTag.getAttribute("rel")).to.equal("stylesheet");
                expect(firstTag.getAttribute("type")).to.equal("text/css");
                expect(firstTag.getAttribute("media")).to.equal("all");
                expect(firstTag.outerHTML).to.equal(`<link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" ${HELMET_ATTRIBUTE}="true">`);

                expect(existingTags)
                    .to.have.deep.property("[1]")
                    .that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("href")).to.equal("http://localhost/helmet/innercomponent");
                expect(secondTag.getAttribute("rel")).to.equal("canonical");
                expect(secondTag.outerHTML).to.equal(`<link rel="canonical" href="http://localhost/helmet/innercomponent" ${HELMET_ATTRIBUTE}="true">`);

                expect(existingTags)
                    .to.have.deep.property("[2]")
                    .that.is.an.instanceof(Element);
                expect(thirdTag).to.have.property("getAttribute");
                expect(thirdTag.getAttribute("href")).to.equal("http://localhost/inner.css");
                expect(thirdTag.getAttribute("rel")).to.equal("stylesheet");
                expect(thirdTag.getAttribute("type")).to.equal("text/css");
                expect(thirdTag.getAttribute("media")).to.equal("all");
                expect(thirdTag.outerHTML).to.equal(`<link href="http://localhost/inner.css" rel="stylesheet" type="text/css" media="all" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("will allow duplicate link tags if specified in the same component", () => {
                child = render(
                    <Helmet
                        link={[
                            {"rel": "canonical", "href": "http://localhost/helmet"},
                            {"rel": "canonical", "href": "http://localhost/helmet/component"}
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];
                const secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.at.least(2);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet");
                expect(firstTag.outerHTML).to.equal(`<link rel="canonical" href="http://localhost/helmet" ${HELMET_ATTRIBUTE}="true">`);

                expect(existingTags)
                    .to.have.deep.property("[1]")
                    .that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("rel")).to.equal("canonical");
                expect(secondTag.getAttribute("href")).to.equal("http://localhost/helmet/component");
                expect(secondTag.outerHTML).to.equal(`<link rel="canonical" href="http://localhost/helmet/component" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("will override duplicate link tags with a single link tag in a nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            link={[
                                {"rel": "canonical", "href": "http://localhost/helmet"},
                                {"rel": "canonical", "href": "http://localhost/helmet/component"}
                            ]}
                        />
                        <Helmet
                            link={[
                                {"rel": "canonical", "href": "http://localhost/helmet/innercomponent"}
                            ]}
                        />
                    </div>,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(1);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/innercomponent");
                expect(firstTag.outerHTML).to.equal(`<link rel="canonical" href="http://localhost/helmet/innercomponent" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("will override single link tag with duplicate link tags in a nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            link={[
                                {"rel": "canonical", "href": "http://localhost/helmet"}
                            ]}
                        />
                        <Helmet
                            link={[
                                {"rel": "canonical", "href": "http://localhost/helmet/component"},
                                {"rel": "canonical", "href": "http://localhost/helmet/innercomponent"}
                            ]}
                        />
                    </div>,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];
                const secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(2);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/component");
                expect(firstTag.outerHTML).to.equal(`<link rel="canonical" href="http://localhost/helmet/component" ${HELMET_ATTRIBUTE}="true">`);

                expect(existingTags)
                    .to.have.deep.property("[1]")
                    .that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("rel")).to.equal("canonical");
                expect(secondTag.getAttribute("href")).to.equal("http://localhost/helmet/innercomponent");
                expect(secondTag.outerHTML).to.equal(`<link rel="canonical" href="http://localhost/helmet/innercomponent" ${HELMET_ATTRIBUTE}="true">`);
            });

            it("won't render tag when primary attribute is null", () => {
                child = render(
                    <Helmet
                        link={[
                            {"rel": "icon", "sizes": "192x192", "href": null},
                            {"rel": "canonical", "href": "http://localhost/helmet/component"}
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.be.equal(1);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/component");
                expect(firstTag.outerHTML).to.equal(`<link rel="canonical" href="http://localhost/helmet/component" ${HELMET_ATTRIBUTE}="true">`);
            });
        });

        describe("script tags", () => {
            it("can update script tags", () => {
                const scriptInnerHTML = `
                  {
                    "@context": "http://schema.org",
                    "@type": "NewsArticle",
                    "url": "http://localhost/helmet"
                  }
                `;
                child = render(
                    <Helmet
                        script={[
                            {"src": "http://localhost/test.js", "type": "text/javascript"},
                            {"src": "http://localhost/test2.js", "type": "text/javascript"},
                            {
                                type: "application/ld+json",
                                innerHTML: scriptInnerHTML
                            }
                        ]}
                    />,
                    container, child
                );

                const existingTags = headElement.getElementsByTagName("script");

                expect(existingTags).to.not.equal(undefined);

                const filteredTags = [].slice.call(existingTags).filter((tag) => {
                    return (tag.getAttribute("src") === "http://localhost/test.js" && tag.getAttribute("type") === "text/javascript") ||
                        (tag.getAttribute("src") === "http://localhost/test2.js" && tag.getAttribute("type") === "text/javascript") ||
                        (tag.getAttribute("type") === "application/ld+json" && tag.innerHTML === scriptInnerHTML);
                });

                expect(filteredTags.length).to.be.at.least(3);
            });

            it("will clear all scripts tags if none are specified", () => {
                child = render(
                    <Helmet
                        script={[
                            {"src": "http://localhost/test.js", "type": "text/javascript"}
                        ]}
                    />,
                    container, child
                );

                child = render(
                    <Helmet />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'src' will not be accepted", () => {
                child = render(
                    <Helmet
                        script={[{"property": "won't work"}]}
                    />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("will set script tags based on deepest nested component", () => {
                child = render(
                    <div>
                        <Helmet
                            script={[
                                {"src": "http://localhost/test.js", "type": "text/javascript"}
                            ]}
                        />
                        <Helmet
                            script={[
                                {"src": "http://localhost/test2.js", "type": "text/javascript"}
                            ]}
                        />
                    </div>,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                const firstTag = existingTags[0];
                const secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.at.least(2);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("src")).to.equal("http://localhost/test.js");
                expect(firstTag.getAttribute("type")).to.equal("text/javascript");
                expect(firstTag.outerHTML).to.equal(`<script src="http://localhost/test.js" type="text/javascript" ${HELMET_ATTRIBUTE}="true"></script>`);

                expect(existingTags)
                    .to.have.deep.property("[1]")
                    .that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("src")).to.equal("http://localhost/test2.js");
                expect(secondTag.getAttribute("type")).to.equal("text/javascript");
                expect(secondTag.outerHTML).to.equal(`<script src="http://localhost/test2.js" type="text/javascript" ${HELMET_ATTRIBUTE}="true"></script>`);
            });


            it("sets undefined attribute values to empty strings", () => {
                child = render(
                    <Helmet
                        script={[
                            {
                                src: "foo.js",
                                async: undefined
                            }
                        ]}
                    />,
                    container, child
                );

                const existingTag = headElement.querySelector(`script[${HELMET_ATTRIBUTE}]`);

                expect(existingTag).to.not.equal(undefined);
                expect(existingTag.outerHTML)
                    .to.be.a("string")
                    .that.equals(`<script src="foo.js" async="" ${HELMET_ATTRIBUTE}="true"></script>`);
            });

            it("won't render tag when primary attribute (src) is null", () => {
                child = render(
                    <Helmet
                        script={[
                            {
                                src: undefined,
                                type: "text/javascript"
                            }
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });

            it("won't render tag when primary attribute (innerHTML) is null", () => {
                child = render(
                    <Helmet
                        script={[
                            {
                                innerHTML: undefined
                            }
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });

        describe("noscript tags", () => {
            it("can update noscript tags", () => {
                const noscriptInnerHTML = `<link rel="stylesheet" type="text/css" href="foo.css" />`;
                child = render(
                    <Helmet noscript={[{id: "bar", innerHTML: noscriptInnerHTML}]} />,
                    container, child
                );

                const existingTags = headElement.getElementsByTagName("noscript");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(1);
                expect(existingTags[0].innerHTML === noscriptInnerHTML && existingTags[0].id === "bar");
            });

            it("will clear all noscripts tags if none are specified", () => {
                child = render(<Helmet noscript={[{id: "bar"}]} />, container, child);

                child = render(<Helmet />, container, child);

                const existingTags = headElement.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'innerHTML' will not be accepted", () => {
                child = render(
                    <Helmet noscript={[{"property": "won't work"}]} />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("won't render tag when primary attribute is null", () => {
                child = render(
                    <Helmet
                        noscript={[
                            {
                                innerHTML: undefined
                            }
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });

        describe("style tags", () => {
            it("can update style tags", () => {
                const cssText1 = `
                    body {
                        background-color: green;
                    }
                `;
                const cssText2 = `
                    p {
                        font-size: 12px;
                    }
                `;
                child = render(
                    <Helmet
                        style={[
                            {
                                type: "text/css",
                                cssText: cssText1
                            },
                            {
                                cssText: cssText2
                            }
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);

                const [
                    firstTag,
                    secondTag
                ] = existingTags;
                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.be.equal(2);

                expect(existingTags)
                    .to.have.deep.property("[0]")
                    .that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("type")).to.equal("text/css");
                expect(firstTag.innerHTML).to.equal(cssText1);
                expect(firstTag.outerHTML).to.equal(`<style type="text/css" ${HELMET_ATTRIBUTE}="true">${cssText1}</style>`);

                expect(existingTags)
                    .to.have.deep.property("[1]")
                    .that.is.an.instanceof(Element);
                expect(secondTag.innerHTML).to.equal(cssText2);
                expect(secondTag.outerHTML).to.equal(`<style ${HELMET_ATTRIBUTE}="true">${cssText2}</style>`);
            });

            it("will clear all style tags if none are specified", () => {
                const cssText = `
                    body {
                        background-color: green;
                    }
                `;
                child = render(
                    <Helmet
                        style={[
                            {
                                type: "text/css",
                                cssText
                            }
                        ]}
                    />,
                    container, child
                );

                child = render(
                    <Helmet />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'cssText' will not be accepted", () => {
                child = render(
                    <Helmet
                        style={[{"property": "won't work"}]}
                    />,
                    container, child
                );

                const existingTags = headElement.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("won't render tag when primary attribute is null", () => {
                child = render(
                    <Helmet
                        style={[
                            {
                                cssText: undefined
                            }
                        ]}
                    />,
                    container, child
                );

                const tagNodes = headElement.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
                const existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });
    });

    describe("misc", () => {
        it("throws in rewind() when a DOM is present", () => {
            child = render(
                <Helmet
                    title={"Fancy title"}
                />,
                container, child
            );

            expect(Helmet.rewind).to.throw(
                "You may only call rewind() on the server. Call peek() to read the current state."
            );
        });

        it("lets you read current state in peek() whether or not a DOM is present", () => {
            child = render(
                <Helmet
                    title={"Fancy title"}
                />,
                container, child
            );

            expect(Helmet.peek().title).to.be.equal("Fancy title");
            Helmet.canUseDOM = false;
            expect(Helmet.peek().title).to.be.equal("Fancy title");
            Helmet.canUseDOM = true;
        });

        it("will html encode string", () => {
            child = render(
                <Helmet
                    meta={[
                        {"name": "description", "content": "This is \"quoted\" text and & and '."}
                    ]}
                />,
                container, child
            );

            const existingTags = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
            const existingTag = existingTags[0];

            expect(existingTags).to.not.equal(undefined);

            expect(existingTags.length).to.be.equal(1);

            expect(existingTags)
                .to.have.deep.property("[0]")
                .that.is.an.instanceof(Element);
            expect(existingTag).to.have.property("getAttribute");
            expect(existingTag.getAttribute("name")).to.equal("description");
            expect(existingTag.getAttribute("content")).to.equal("This is \"quoted\" text and & and '.");
            expect(existingTag.outerHTML).to.equal(`<meta name="description" content="This is &quot;quoted&quot; text and &amp; and '." ${HELMET_ATTRIBUTE}="true">`);
        });

        it("will not change the DOM if it is receives identical props", () => {
            const spy = sinon.spy();
            child = render(
                <Helmet
                    meta={[{"name": "description", "content": "Test description"}]}
                    title={"Test Title"}
                    onChangeClientState={spy}
                />,
                container, child
            );

            // Re-rendering will pass new props to an already mounted Helmet
            child = render(
                <Helmet
                    meta={[{"name": "description", "content": "Test description"}]}
                    title={"Test Title"}
                    onChangeClientState={spy}
                />,
                container, child
            );

            expect(spy.callCount).to.equal(1);
        });

        it("will only add new tags and will preserve tags when rendering additional Helmet instances", () => {
            const spy = sinon.spy();
            let addedTags;
            let removedTags;

            child = render(
                <Helmet
                    link={[{"href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css"}]}
                    meta={[{"name": "description", "content": "Test description"}]}
                    onChangeClientState={spy}
                />,
                container, child
            );

            expect(spy.called).to.equal(true);
            addedTags = spy.getCall(0).args[1];
            removedTags = spy.getCall(0).args[2];

            expect(addedTags).to.have.property("metaTags");
            expect(addedTags.metaTags).to.have.deep.property("[0]");
            expect(addedTags.metaTags[0].outerHTML).to.equal(`<meta name="description" content="Test description" ${HELMET_ATTRIBUTE}="true">`);
            expect(addedTags).to.have.property("linkTags");
            expect(addedTags.linkTags).to.have.deep.property("[0]");
            expect(addedTags.linkTags[0].outerHTML).to.equal(`<link href="http://localhost/style.css" rel="stylesheet" type="text/css" ${HELMET_ATTRIBUTE}="true">`);
            expect(removedTags).to.be.empty;

            // Re-rendering will pass new props to an already mounted Helmet
            child = render(
                <Helmet
                    link={[
                        {"href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css"},
                        {"href": "http://localhost/style2.css", "rel": "stylesheet", "type": "text/css"}
                    ]}
                    meta={[{"name": "description", "content": "New description"}]}
                    onChangeClientState={spy}
                />,
                container, child
            );

            expect(spy.callCount).to.equal(2);
            addedTags = spy.getCall(1).args[1];
            removedTags = spy.getCall(1).args[2];

            expect(addedTags).to.have.property("metaTags");
            expect(addedTags.metaTags).to.have.deep.property("[0]");
            expect(addedTags.metaTags[0].outerHTML).to.equal(`<meta name="description" content="New description" ${HELMET_ATTRIBUTE}="true">`);
            expect(addedTags).to.have.property("linkTags");
            expect(addedTags.linkTags).to.have.deep.property("[0]");
            expect(addedTags.linkTags[0].outerHTML).to.equal(`<link href="http://localhost/style2.css" rel="stylesheet" type="text/css" ${HELMET_ATTRIBUTE}="true">`);
            expect(removedTags).to.have.property("metaTags");
            expect(removedTags.metaTags).to.have.deep.property("[0]");
            expect(removedTags.metaTags[0].outerHTML).to.equal(`<meta name="description" content="Test description" ${HELMET_ATTRIBUTE}="true">`);
            expect(removedTags).to.not.have.property("linkTags");
        });

        it("can not nest Helmets", () => {
            child = render(
                <Helmet
                    title={"Test Title"}
                >
                    <Helmet
                        title={"Title you'll never see"}
                    />
                </Helmet>,
                container, child
            );

            expect(document.title).to.equal("Test Title");
        });

        it("will recognize valid tags regardless of attribute ordering", () => {
            child = render(
                <Helmet
                    meta={[{"content": "Test Description", "name": "description"}]}
                />,
                container, child
            );

            const existingTags = headElement.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
            const existingTag = existingTags[0];

            expect(existingTags).to.not.equal(undefined);

            expect(existingTags.length).to.be.equal(1);

            expect(existingTags)
                .to.have.deep.property("[0]")
                .that.is.an.instanceof(Element);
            expect(existingTag).to.have.property("getAttribute");
            expect(existingTag.getAttribute("name")).to.equal("description");
            expect(existingTag.getAttribute("content")).to.equal("Test Description");
            expect(existingTag.outerHTML).to.equal(`<meta content="Test Description" name="description" ${HELMET_ATTRIBUTE}="true">`);
        });
    });


    describe("server", () => {
        const renderedHtmlAttributes = `lang="ga" class="myClassName"`;
        const renderedTitle = `<title ${HELMET_ATTRIBUTE}>Dangerous &lt;script&gt; include</title>`;
        const renderedTitleWithItemProp = `<title ${HELMET_ATTRIBUTE} itemprop="name">Title with Itemprop</title>`;
        const renderedBaseTag = `<base ${HELMET_ATTRIBUTE} target="_blank" href="http://localhost/">`;

        const renderedMetaTags = [
            `<meta ${HELMET_ATTRIBUTE} charset="utf-8">`,
            `<meta ${HELMET_ATTRIBUTE} name="description" content="Test description &amp; encoding of special characters like &quot; &gt; &lt; \`">`,
            `<meta ${HELMET_ATTRIBUTE} http-equiv="content-type" content="text/html">`,
            `<meta ${HELMET_ATTRIBUTE} property="og:type" content="article">`,
            `<meta ${HELMET_ATTRIBUTE} itemprop="name" content="Test name itemprop">`
        ].join("");

        const renderedLinkTags = [
            `<link ${HELMET_ATTRIBUTE} href="http://localhost/helmet" rel="canonical">`,
            `<link ${HELMET_ATTRIBUTE} href="http://localhost/style.css" rel="stylesheet" type="text/css">`
        ].join("");

        const renderedScriptTags = [
            `<script ${HELMET_ATTRIBUTE} src="http://localhost/test.js" type="text/javascript"></script>`,
            `<script ${HELMET_ATTRIBUTE} src="http://localhost/test2.js" type="text/javascript"></script>`
        ].join("");

        const renderedNoscriptTags = [
            `<noscript ${HELMET_ATTRIBUTE} id="foo"><link rel="stylesheet" type="text/css" href="/style.css" /></noscript>`,
            `<noscript ${HELMET_ATTRIBUTE} id="bar"><link rel="stylesheet" type="text/css" href="/style2.css" /></noscript>`
        ].join("");

        const renderedStyleTags = [
            `<style ${HELMET_ATTRIBUTE} type="text/css">body {background-color: green;}</style>`,
            `<style ${HELMET_ATTRIBUTE} type="text/css">p {font-size: 12px;}</style>`
        ].join("");

        before(() => {
            Helmet.canUseDOM = false;
            Helmet.rewind();
        });

        after(() => {
            Helmet.rewind();
            Helmet.canUseDOM = true;
        });

        it("will html encode title", () => {
            renderToString(
                <Helmet
                    title="Dangerous <script> include"
                />
            );

            const head = Helmet.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString()).to.equal(renderedTitle);
        });

        it("will render title as React component", () => {
            renderToString(
                <Helmet
                    title="Dangerous <script> include"
                />
            );

            const head = Helmet.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toComponent");

            const titleComponent = head.title.toComponent();

            expect(titleComponent)
                .to.be.an("array")
                .that.has.length.of(1);

            titleComponent.forEach(title => {
                expect(title)
                    .to.be.an("object")
                    .that.contains.property("nodeName", "title");
            });

            const markup = renderToString(
                <div>
                    {titleComponent}
                </div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${
                    renderedTitle
                }</div>`);
        });

        it("will render title with itemprop name as React component", () => {
            renderToString(
                <Helmet
                    title={"Title with Itemprop"}
                    titleAttributes={{itemprop: "name"}}
                />
            );

            const head = Helmet.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toComponent");

            const titleComponent = head.title.toComponent();

            expect(titleComponent)
                .to.be.an("array")
                .that.has.length.of(1);

            titleComponent.forEach(title => {
                expect(title)
                    .to.be.an("object")
                    .that.contains.property("nodeName", "title");
            });

            const markup = renderToString(
                <div>
                    {titleComponent}
                </div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${
                    renderedTitleWithItemProp
                }</div>`);
        });

        it("will render base tag as React component", () => {
            renderToString(
                <Helmet
                    base={{"target": "_blank", "href": "http://localhost/"}}
                />
            );

            const head = Helmet.rewind();

            expect(head.base).to.exist;
            expect(head.base).to.respondTo("toComponent");

            const baseComponent = head.base.toComponent();

            expect(baseComponent)
                .to.be.an("array")
                .that.has.length.of(1);

            baseComponent.forEach(base => {
                expect(base)
                    .to.be.an("object")
                    .that.contains.property("nodeName", "base");
            });

            const markup = renderToString(
                <div>
                    {baseComponent}
                </div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${
                    renderedBaseTag
                }</div>`);
        });

        it("will render meta tags as React components", () => {
            renderToString(
                <Helmet
                    meta={[
                        {"charset": "utf-8"},
                        {"name": "description", "content": "Test description & encoding of special characters like \" > < `"},
                        {"http-equiv": "content-type", "content": "text/html"},
                        {"property": "og:type", "content": "article"},
                        {"itemprop": "name", "content": "Test name itemprop"}
                    ]}
                />
            );

            const head = Helmet.rewind();

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toComponent");

            const metaComponent = head.meta.toComponent();

            expect(metaComponent)
                .to.be.an("array")
                .that.has.length.of(5);

            metaComponent.forEach(meta => {
                expect(meta)
                    .to.be.an("object")
                    .that.contains.property("nodeName", "meta");
            });

            const markup = renderToString(
                <div>
                    {metaComponent}
                </div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${
                    renderedMetaTags
                }</div>`);
        });

        it("will render link tags as React components", () => {
            renderToString(
                <Helmet
                    link={[
                        {"href": "http://localhost/helmet", "rel": "canonical"},
                        {"href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css"}
                    ]}
                />
            );

            const head = Helmet.rewind();

            expect(head.link).to.exist;
            expect(head.link).to.respondTo("toComponent");

            const linkComponent = head.link.toComponent();

            expect(linkComponent)
                .to.be.an("array")
                .that.has.length.of(2);

            linkComponent.forEach(link => {
                expect(link)
                    .to.be.an("object")
                    .that.contains.property("nodeName", "link");
            });

            const markup = renderToString(
                <div>
                    {linkComponent}
                </div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${
                    renderedLinkTags
                }</div>`);
        });

        it("will render script tags as React components", () => {
            renderToString(
                <Helmet
                    script={[
                        {"src": "http://localhost/test.js", "type": "text/javascript"},
                        {"src": "http://localhost/test2.js", "type": "text/javascript"}
                    ]}
                />
            );

            const head = Helmet.rewind();

            expect(head.script).to.exist;
            expect(head.script).to.respondTo("toComponent");

            const scriptComponent = head.script.toComponent();

            expect(scriptComponent)
                .to.be.an("array")
                .that.has.length.of(2);

            scriptComponent.forEach(script => {
                expect(script)
                    .to.be.an("object")
                    .that.contains.property("nodeName", "script");
            });

            const markup = renderToString(
                <div>
                    {scriptComponent}
                </div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${
                    renderedScriptTags
                }</div>`);
        });

        it("will render noscript tags as React components", () => {
            renderToString(
                <Helmet
                  noscript={[
                    {id: "foo", innerHTML: '<link rel="stylesheet" type="text/css" href="/style.css" />'},
                    {id: "bar", innerHTML: '<link rel="stylesheet" type="text/css" href="/style2.css" />'}
                  ]}
                />
            );

            const head = Helmet.rewind();

            expect(head.noscript).to.exist;
            expect(head.noscript).to.respondTo("toComponent");

            const noscriptComponent = head.noscript.toComponent();

            expect(noscriptComponent)
                .to.be.an("array")
                .that.has.length.of(2);

            noscriptComponent.forEach(noscript => {
                expect(noscript)
                    .to.be.an("object")
                    .that.contains.property("nodeName", "noscript");
            });

            const markup = renderToString(
                <div>
                    {noscriptComponent}
                </div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${
                    renderedNoscriptTags
                }</div>`);
        });

        it("will render style tags as React components", () => {
            renderToString(
                <Helmet
                    style={[
                        {
                            "type": "text/css",
                            "cssText": `body {background-color: green;}`
                        },
                        {
                            "type": "text/css",
                            "cssText": `p {font-size: 12px;}`
                        }
                    ]}
                />
            );

            const head = Helmet.rewind();

            expect(head.style).to.exist;
            expect(head.style).to.respondTo("toComponent");

            const styleComponent = head.style.toComponent();

            expect(styleComponent)
                .to.be.an("array")
                .that.has.length.of(2);

            const markup = renderToString(
                <div>
                    {styleComponent}
                </div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div>${
                    renderedStyleTags
                }</div>`);
        });

        it("will render title tag as string", () => {
            renderToString(
                <Helmet
                    title={"Dangerous <script> include"}
                />
            );

            const head = Helmet.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString())
                .to.be.a("string")
                .that.equals(renderedTitle);
        });

        it("will render title with itemprop name as string", () => {
            renderToString(
                <Helmet
                    title={"Title with Itemprop"}
                    titleAttributes={{itemprop: "name"}}
                />
            );

            const head = Helmet.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            const titleString = head.title.toString();
            expect(titleString)
                .to.be.a("string")
                .that.equals(renderedTitleWithItemProp);
        });

        it("will render base tags as string", () => {
            renderToString(
                <Helmet
                    base={{"target": "_blank", "href": "http://localhost/"}}
                />
            );

            const head = Helmet.rewind();

            expect(head.base).to.exist;
            expect(head.base).to.respondTo("toString");

            expect(head.base.toString())
                .to.be.a("string")
                .that.equals(renderedBaseTag);
        });

        it("will render meta tags as string", () => {
            renderToString(
                <Helmet
                    meta={[
                        {"charset": "utf-8"},
                        {"name": "description", "content": "Test description & encoding of special characters like \" > < `"},
                        {"http-equiv": "content-type", "content": "text/html"},
                        {"property": "og:type", "content": "article"},
                        {"itemprop": "name", "content": "Test name itemprop"}
                    ]}
                />
            );

            const head = Helmet.rewind();

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toString");

            expect(head.meta.toString())
                .to.be.a("string")
                .that.equals(renderedMetaTags);
        });

        it("will render link tags as string", () => {
            renderToString(
                <Helmet
                    link={[
                        {"href": "http://localhost/helmet", "rel": "canonical"},
                        {"href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css"}
                    ]}
                />
            );

            const head = Helmet.rewind();

            expect(head.link).to.exist;
            expect(head.link).to.respondTo("toString");

            expect(head.link.toString())
                .to.be.a("string")
                .that.equals(renderedLinkTags);
        });

        it("will render script tags as string", () => {
            renderToString(
                <Helmet
                    script={[
                        {"src": "http://localhost/test.js", "type": "text/javascript"},
                        {"src": "http://localhost/test2.js", "type": "text/javascript"}
                    ]}
                />
            );

            const head = Helmet.rewind();

            expect(head.script).to.exist;
            expect(head.script).to.respondTo("toString");

            expect(head.script.toString())
                .to.be.a("string")
                .that.equals(renderedScriptTags);
        });

        it("will render style tags as string", () => {
            renderToString(
                <Helmet
                    style={[
                        {
                            "type": "text/css",
                            "cssText": `body {background-color: green;}`
                        },
                        {
                            "type": "text/css",
                            "cssText": `p {font-size: 12px;}`
                        }
                    ]}
                />
            );

            const head = Helmet.rewind();

            expect(head.style).to.exist;
            expect(head.style).to.respondTo("toString");

            expect(head.style.toString())
                .to.be.a("string")
                .that.equals(renderedStyleTags);
        });

        it("will render html attributes as component", () => {
            renderToString(
                <Helmet
                    htmlAttributes={{
                        lang: "ga",
                        className: "myClassName"
                    }}
                />
            );

            const {htmlAttributes} = Helmet.rewind();
            const attrs = htmlAttributes.toComponent();

            expect(attrs).to.exist;

            const markup = renderToString(
                <html lang="en" {...attrs} />
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<html ${renderedHtmlAttributes}></html>`);
        });

        it("will render html attributes as string", () => {
            renderToString(
                <Helmet
                    htmlAttributes={{
                        lang: "ga",
                        class: "myClassName"
                    }}
                />
            );

            const head = Helmet.rewind();

            expect(head.htmlAttributes).to.exist;
            expect(head.htmlAttributes).to.respondTo("toString");

            expect(head.htmlAttributes.toString())
                .to.be.a("string")
                .that.equals(renderedHtmlAttributes);
        });

        it("will not encode all characters with HTML character entity equivalents", () => {
            const chineseTitle = "膣膗 鍆錌雔";
            const stringifiedChineseTitle = `<title ${HELMET_ATTRIBUTE}>${chineseTitle}</title>`;

            renderToString(
                <div>
                    <Helmet title={chineseTitle} />
                </div>
            );

            const head = Helmet.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString())
                .to.be.a("string")
                .that.equals(stringifiedChineseTitle);
        });

        it("rewind() provides a fallback object for empty Helmet state", () => {
            renderToString(
                <div />
            );

            const head = Helmet.rewind();

            expect(head.htmlAttributes).to.exist;
            expect(head.htmlAttributes).to.respondTo("toString");
            expect(head.htmlAttributes.toString()).to.equal("");
            expect(head.htmlAttributes).to.respondTo("toComponent");
            expect(head.htmlAttributes.toComponent()).to.be.an("object")
                .that.is.empty;

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");
            expect(head.title.toString()).to.equal(`<title ${HELMET_ATTRIBUTE}></title>`);
            expect(head.title).to.respondTo("toComponent");

            const markup = renderToString(
                <div>
                    {head.title.toComponent()}
                </div>
            );

            expect(markup)
                .to.be.a("string")
                .that.equals(`<div><title ${HELMET_ATTRIBUTE}></title></div>`);

            expect(head.base).to.exist;
            expect(head.base).to.respondTo("toString");
            expect(head.base.toString()).to.equal("");
            expect(head.base).to.respondTo("toComponent");
            expect(head.base.toComponent()).to.be.an("array")
                .that.is.empty;

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toString");
            expect(head.meta.toString()).to.equal("");
            expect(head.meta).to.respondTo("toComponent");
            expect(head.meta.toComponent()).to.be.an("array")
                .that.is.empty;

            expect(head.link).to.exist;
            expect(head.link).to.respondTo("toString");
            expect(head.link.toString()).to.equal("");
            expect(head.link).to.respondTo("toComponent");
            expect(head.link.toComponent()).to.be.an("array")
                .that.is.empty;

            expect(head.script).to.exist;
            expect(head.script).to.respondTo("toString");
            expect(head.script.toString()).to.equal("");
            expect(head.script).to.respondTo("toComponent");
            expect(head.script.toComponent()).to.be.an("array")
                .that.is.empty;

            expect(head.noscript).to.exist;
            expect(head.noscript).to.respondTo("toString");
            expect(head.noscript.toString()).to.equal("");
            expect(head.noscript).to.respondTo("toComponent");
            expect(head.noscript.toComponent()).to.be.an("array")
                .that.is.empty;

            expect(head.style).to.exist;
            expect(head.style).to.respondTo("toString");
            expect(head.style.toString()).to.equal("");
            expect(head.style).to.respondTo("toComponent");
            expect(head.style.toComponent()).to.be.an("array")
                .that.is.empty;
        });

        it("does not render undefined attribute values", () => {
            renderToString(
                <Helmet
                    script={[
                        {
                            src: "foo.js",
                            async: undefined
                        }
                    ]}
                />
            );

            const {script} = Helmet.rewind();
            const stringifiedScriptTag = script.toString();

            expect(stringifiedScriptTag)
                .to.be.a("string")
                .that.equals(`<script ${HELMET_ATTRIBUTE} src="foo.js" async></script>`);
        });
    });
});

function unmountComponentAtNode(container, child) {
    // render an empty string to force the components to unmount
    return render("", container, child);
}
