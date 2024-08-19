Getting started

Links:
Live URL: https://kind-sea-05c903603.5.azurestaticapps.net
GitHub (GUI): https://github.com/dzuburjasmin/LiveChatGui
GitHub (API): https://github.com/dzuburjasmin/LiveChat

Technologies:
•	Angular 12
•	Bootstrap 4
•	JWT
•	ASP .NET Core 8
•	Entity Framework Core 8
•	SignalR
•	MSSQL 
•	Azure

Run, build, deploy
For development purposes, the app runs on localhost, on 2 ports (Angular app, .NET app) and the database is local.

To run it locally:
Angular – npm run start (or ng serve) runs the app on localhost:4200 (default port)
.NET – running the app in Visual Studio runs the app on localhost:5115 (default port)
BaseUrl for the API on the frontend side is adjustable in the environment.ts and environment.prod.ts
Connection string for the database on the backend side, as well as token issuer and key are in appsettings.json

Azure
All parts of the app (alonside other resources like the server, log workspace and storage account) are published on Azure.
•	frontend – as a static Web App
•	backend – as an App Service
•	database – as an SQL database
The entry point (GUI) is accessible on the URL mentioned in the „Getting started“ section.
API endpoints, as well as database connection strings, are configured in enviroment and config files 

Design and architecture

Frontend:
Simple Angular frontend, consists of 3 main components and 2 services

Components:
Login/register component
•	2 angular forms with 2 methods for login and registration

Chat details component
•	consists of 2 parts: users and messages
•	users – a list of online users and the current user can initialize a private chat by clicking on one of the users from the list
•	messages – a live chat container where users can send real-time messages where every message has the information on: who sent it, when is the message sent, message content
•	a user can send maximum 10 messages per minute, when the limit is reached the user is notified and messages are on a cool-down
•	when a new user enters the chat, 10 most recent messages appear inside the container

Private chat component
•	a popup component where users can send private messages one-to-another, when a user receives a new private message, the popup automatically opens
•	when one of the users closes the private chat, unlike the live chat room, all messages are lost from the chat but still they are saved in the database
 Services:
Auth Service
•	holds all necessary methods for authorization and authentication
•	the service is injected in components when needed 
Chat Service
•	builds a HubConnection instance for SignalR
•	holds all necessary methods and callbacks for the WebSocket API

Tests are included in spec.ts files.

Backend
Consists of 2 services and 2 models.
Program.cs
•	all services registered (authorization, authentication, signalR)
ChatService & ChatHub
•	holds all methods and operations for the real-time chat functionality
TokenService & TokenController
•	holds all methods for JWT authorization and authentication



