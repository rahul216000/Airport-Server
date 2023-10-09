const Sib = require('sib-api-v3-sdk')
console.log('Send mail');
const client = Sib.ApiClient.instance
const MyapiKey = client.authentications['api-key']
MyapiKey.apiKey = "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";

async function SendMail(sender, email, subject, content) {
    const tranEmailApi = new Sib.TransactionalEmailsApi()

    const receivers = [
        {
            email: email
        }
    ]

   await tranEmailApi
        .sendTransacEmail({
            sender,
            to: receivers,
            subject: subject,
            htmlContent: `${content}
        `
        })
        .then(console.log)
        .catch(console.log)
}

module.exports = SendMail;