import apostle

from mysite.settings import DEBUG

APOSTLE_DOMAIN_KEY= "130b06ec68e5d0805ffd8d57db463f0d99f85627"
DEV_EMAIL = "anna.weaverhr6@gmail.com"
FROM_EMAIL_LIVE = "admin.epiccycles@gmail.com"
FROM_EMAIL_DEV = "appdev.epiccycles@gmail.com"

def create_apostle_email(template_name, recipient_name, recipient_email):
    from_address = FROM_EMAIL_LIVE
    if DEBUG:
        from_address = FROM_EMAIL_DEV
        recipient_email = DEV_EMAIL
    return apostle.Mail(template_name,{"name": recipient_name, "email": recipient_email, "from_address": from_address})

def send_apostle_email(apostle_mail):
    apostle.domain_key = APOSTLE_DOMAIN_KEY

    queue = apostle.Queue()
    queue.add(apostle_mail)
    queue.deliver()
