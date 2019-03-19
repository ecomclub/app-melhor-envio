# app-melhor-envio
E-Com Plus app to integrate Melhor Envio

>Environment variables

Env | Val
---------|--------
ME_CLIENT_ID | Melhor envio client id
ME_CLIENT_SECRET | Melhor envio client_secret
ME_SANDBOX | environment. default false.
ME_REDIRECT_URI | url oauth callback https://meuapp.com/callback
ME_SCOPE | scope de authorização oauth melhor envio
BD_PATH | caminho para sqlite

## Production server

Published at https://melhorenvio.ecomplus.biz

### Continuous deployment

When app version is **production ready**,
[create a new release](https://github.com/ecomclub/app-melhor-envio/releases)
to run automatic deploy from `master` branch.
