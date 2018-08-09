import React, {Component} from 'react'
import {Message} from 'semantic-ui-react'

class ErrorDismissibleBlock extends Component {
    render() {
        const {removeError, error} = this.props;

        return <Message
            negative
            visible
            onDismiss={removeError}
        >
            <Message.Header>An Error has occurred</Message.Header>
            <p>{error}</p>
        </Message>
    };
}

export default ErrorDismissibleBlock;
