const socialPlus = require('../lib/index');

const apiKey = process.env.SOCIALPLUS_API_KEY;

main().then((result)=>{
    console.log('DONE', result);
}).catch((err)=>{
    console.log('ERROR', err);
});

async function main() {
    const accountService = new socialPlus.service.Account({
        apiKey: apiKey
    });
    const providerOfUserResult = await accountService.providersOfUser({
        identifier: '12345678'
    });
    console.log(providerOfUserResult);
    return;
}
