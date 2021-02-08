Уважаемые проверяющие!
-----------------------------------

В работе используется API Яндекс.Расписаний.  
Для корректной работы приложения установите и активируйте расширение для Chrome, разрешающее кросс-доменные запросы, например, [вот это](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino).  

Согласно действующему тарифу максимальное количесво запросов к API в сутки - 500. Ошибка **429 Too Many Requests** свидетельствует об исчерпании лимита запросов на текущие сутки. Если вы видите эту ошибку, попробуйте запустить приложение позже.

По возникающим вопросам обращайтесь, пожалуйста, в telegram: [mm_mnishek](https://tlgg.ru/mm_mnishek)


Особенности технический реализации
-----------------------------------
В прокте используется:
 - [API Яндекс.Расписаний](https://yandex.ru/dev/rasp/raspapi/)
 - [API Яндекс.Карт](https://yandex.ru/dev/maps/)
 - [Календарь Datepicker.js](https://wwilsman.github.io/Datepicker.js/)
 - работа с аудио
 - работа с Local Storage, Session Storage
 - webpack
 - eslint, eslint-config-airbnb-base

