import React, {Component} from 'react'
import {Message} from 'semantic-ui-react'

class ErrorDismissibleBlock extends Component {
    render() {
        const { application, removeMessage } = this.props;
        const messageColor = (application.messageType && (application.messageType === 'E')) ? 'red' : 'green';

        return <Message color={messageColor}
                        content={application.message}
                        onDismiss={removeMessage}
        />
    };
}

export default ErrorDismissibleBlock;
