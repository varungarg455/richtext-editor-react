import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

class RichTextEditor extends Component {

    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
        this.onChange = (editorState) => this.setState({ editorState });
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

    
    render() {
        return (
            <div className="editor-window">
                <Editor editorState={this.state.editorState}
                    onChange={this.onChange}
                    handleKeyCommand={this.handleKeyCommand} />
            </div>
        );
    }
}

export default RichTextEditor;