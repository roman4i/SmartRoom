# SmartRoom
Arduino-based smart room system
Can control light (LED strip) by PWM.
Also added BMP180 sensor for tempreture monitoring.

## Project details
### Server
ESP8266 works as server. Sends and receives requests to frontend.
Server based on ESPAsyncWebServer.

### User interface
Interface generates by JS with HTML and CSS.
Interface consist 3 different blocks - sensor, binary, PWM.

#### PWM block
PWM block for power control by transistors (LED light, motors).
Have scale for power control and button for sending data to server.

#### Sensor block
Sensor block just for sensor data output, have only text value.

#### Binary block
Binary block for control binary devices (as ATX PSU on/off or relays).
Have check for setting high or low level.

### Project files
Project is developing in VC Code with Platformio extension.
Server file (main Arduino file) is in src folder.
Interface files are in data folder.
