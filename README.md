# WebClin Vue CLI 3
Gerenciador de Pacientes para Clínicas Particulares

Demonstração: [Clique aqui para acessar](https://webclin.iwantproject.com.br "Clique aqui para acessar")

| Usuário  | Senha  |
| ------------ | ------------ |
|  webclin  | 123456  |

------------

> Authentication

![](https://github.com/roqueribeiro/webclin/blob/master/wcn-arts-project/screens/1_login.png)

> Patients List

![](https://github.com/roqueribeiro/webclin/blob/master/wcn-arts-project/screens/2_patients.png)

> Waiting List

![](https://github.com/roqueribeiro/webclin/blob/master/wcn-arts-project/screens/7_waiting_list.png)

> Patient Edit

![](https://github.com/roqueribeiro/webclin/blob/master/wcn-arts-project/screens/8_edit_patient.png)

> Patient Appointments

![](https://github.com/roqueribeiro/webclin/blob/master/wcn-arts-project/screens/5_appointments.png)

------------

## Executar em Produção

1. `cd wcn-front-project`

1. `yarn build`

1. `cd ..`

1. `cd wcn-front-project`

1. `yarn start`

------------

> Especificar a rota do build do Front End e subdominio do Back End
/Users/roqueribeirodasilva/Desktop/webclin/wcn-back-project/server.js

	application.set('port', 443);
    application.use(vhost('api.iwantproject.com.br', api));
    application.use(vhost('webclin.iwantproject.com.br', app));
