import React, { Component } from 'react';
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';

/* 
    This is used to include emoji plugin in the editor.
    We can invoke the emoji suggestions using : keyword.
*/
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;

class RichTextEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        /* 
            Below lines are used to retrieve data from the local storage.
            This can be useful in cases we accidently reload the page
            while we are still typing.
        */
        const content = window.localStorage.getItem('content');

        if (content) {
            this.state.editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(content)));
        } else {
            this.state.editorState = EditorState.createEmpty();
        }

        this.onChange = this.onChange.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    /* 
       RichUtils has information about the core key commands available to web editors, 
       such as Cmd+B (bold), Cmd+I (italic), and so on.
       We can observe and handle key commands via the handleKeyCommand prop, 
       and hook these into RichUtils to apply or remove the desired style.
    */
    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    onChange(editorState) {
        const contentState = editorState.getCurrentContent();
        this.saveContent(contentState);
        this.setState({
            editorState,
        });
    }

    saveContent = (content) => {
        window.localStorage.setItem('content', JSON.stringify(convertToRaw(content)));
    }

    _onBoldClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    _onToggleCode = () => {
        this.onChange(RichUtils.toggleCode(this.state.editorState));
    }

    render() {
        return (
            <div className="editor-window">
                <button onClick={this._onBoldClick.bind(this)}>Bold</button>
                <button onClick={this._onToggleCode}>Code Block</button>
                <Editor editorState={this.state.editorState}
                    onChange={this.onChange}
                    handleKeyCommand={this.handleKeyCommand}
                    plugins={[emojiPlugin]} />
                <EmojiSuggestions />
            </div>
        );
    }
}

export default RichTextEditor;