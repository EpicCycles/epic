import apostle
import re

from epic.form_helpers.regular_expressions import EMAIL_REGEX
from mysite.settings import DEBUG, APOSTLE_DOMAIN_KEY, TO_EMAIL, FROM_EMAIL


def create_apostle_email(template_name, recipient_name, recipient_email):
    if template_name == '':
        raise ValueError('Missing Template name')
    if recipient_name == '':
        raise ValueError('Missing Template name')
    if recipient_email == '':
        raise ValueError('Missing Template name')

    match = re.match(EMAIL_REGEX, recipient_email)
    if match is None:
        raise ValueError('Invalid recipient email', recipient_email)

    from_address = FROM_EMAIL
    if DEBUG:
        recipient_email = TO_EMAIL
    return apostle.Mail(template_name, {"name": recipient_name, "email": recipient_email, "from_address": from_address})


def send_apostle_email(apostle_mail):
    apostle.domain_key = APOSTLE_DOMAIN_KEY

    queue = apostle.Queue()

    queue.add(apostle_mail)
    queue.deliver()
