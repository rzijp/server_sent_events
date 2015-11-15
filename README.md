# Readme

Simple app to validate server sent events (SSE).
* The client creates a EventSource with an endpoint provided by a node.js server. 
* This endpoint sets the socket timeout to infinity, and broadcasts the server's CPU usage at a fixed interval to the socket
* The client updates the D3 chart when it receives a new message.

## TO-DO
* Have client update chart based on local clock (tick()), indepently from data sent by server
* Smoothen transitions