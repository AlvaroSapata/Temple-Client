TEMPLE


  DESCRIPTION: Es una APP de eventos musicales donde poder apuntarte a diferentes eventos y tambien comprar merch.

  client repo:

  server repo: 
  

 BACKLOG FUNCIONALITIES: 

 -Mejora del apartado del merch
 -Mejorar estilos
 -Implementacion de musica

 TECHNOLOGIES USED: 

  -Javascript
  -JSX
  -React
  -CSS
  
-CLIENT STRUCTURE 

 USER ESTRUCTURE:
 
 -INICIO: Como Usuario puede navegar en la pagina de inicio donde poder acceder a los distintos lugares de la pagina.

 -REGISTRARSE: Como usuario puede registrarse para acceder a varios puntos de la pagina donde solo puedes si estas registrado.

 -INICIAR SESION: Como usuario puede iniciar sesion para poder interactuar dentro de la pagina. 

 -CERRAR SESION: Como usuario puede cerrar sesion.

 -EVENTOS: Como usuario puede acceder y ver todos los eventos.

 -DJS: Como usuario puede ver acceder y ver todos los Djs disponibles para los siguientes eventos.

 -UBICACIONES: Como usuario puede acceder y ver todas la ubicaciones donde seran los eventos.

 -PRODUCTOS: Como usuario puede acceder a productos donde ver y poder comprar los productos de la marca.

 -INSTAGRAM: Como usuario tiene un acceso directo al instragram official de la marca de eventos.




| Camino               | Página           | Componentes            | Permisos                  | Comportamiento                                    |
|----------------------|------------------|------------------------|---------------------------|--------------------------------------------------|
| /                    | Hogar            |                        | público                   | Página de inicio                                  |
| /signup              | Inscribirse      |                        | solo anónimo<IsAnon>      | Formulario de registro, enlace para iniciar sesión, navegar a la página de inicio después del registro |
| /login               | Acceso           |                        | solo anónimo<IsAnon>      | Formulario de inicio de sesión, enlace para registrarse, navegar a la página de inicio después de iniciar sesión |
| /djs                 | DJs              | Editar DJ               | solo usuario<IsPrivate>   | Muestra todos los Djs |
| /events              | Eventos          | Agregar evento          | solo usuario<IsPrivate>   | Muestra todos los eventos en la cartera           |
| /locations           | Localizaciones   | Agregar localización    | solo usuario<IsPrivate>   | Muestra todas las localizaciones       |
| /products            | Productos        |                         | solo usuario<IsPrivate>   | Muestra todos los productos donde poder verlos y comprarlos           |
| /events/:eventId     | Detalles del evento |                      | solo usuario<IsPrivate>   | Muestra los detalles de un evento específico y poder actualizarlo    |
| /locations/:locationId | Detalles de la ubicación |               | solo usuario<IsPrivate>   | Muestra los detalles de una ubicación específica y poder actualizarlas|


 SERVICES:

 Auth Service:

   - verifyService()
   - sigupService()
   - loginService()

 Config.Service:
 
 -config.service

 Djs Service: 

    - getAllDjsService()
    - createDjService()
    - deleteDjService()

 Events Service:

     -getAllEventsService()
     -createEventService()
     -getEventsDetailsService()
     -deleteEventsService()
     -editEventsService()
     -joinService()
     -unJoinService()

 Locations Services:

      -getAllLocationsService()
      -createLocationService()
      -getLocationDetailsService()
      -deleteLocationService()
      -editLocationService()

 Payments Services:

      -createPaymentIntentService()
      -updatePaymentIntentService

 Products Services:
    
      -getAllProductsService()
      -createProductService()
      -deleteProductService()
      -editProductService()

 Upload ervices:

      -uploadImageService()
      -uploadVideoService()


 CONTEXT:

 auth.context


 COLLABORATORS:

 - Alvaro Martinez

 -Jonatan Iglesias



 PROJECT: 

   REPOSITORY LINK CLIENT: https://github.com/AlvaroSapata/Temple-Client

   REPOSITORY LINK SERVER: https://github.com/AlvaroSapata/Temple-Server

   DEPLOY LINK: https://templewav.netlify.app/


   SLIDES: https:

   SLIDES LINK:   https://www.canva.com/design/DAFlUt7352c/4C_0TuI3PdvdAwYS3nGefg/edit?utm_content=DAFlUt7352c&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton