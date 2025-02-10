# Interactive Puzzle Game with ESP32 Integration

A web-based sliding puzzle game that interfaces with an ESP32 microcontroller. When the puzzle is solved, it triggers an LED connected to the ESP32.

## Features

- 3x3 sliding puzzle game
- Drag-and-drop puzzle piece movement
- Touch screen support
- Puzzle shuffle functionality
- Visual feedback on successful completion
- ESP32 LED indication when puzzle is solved
- Responsive design

## Hardware Requirements

- ESP32 development board
- LED (connected to GPIO2)
- USB cable for programming
- Power supply for ESP32

## Software Requirements

- Arduino IDE
- Required Arduino Libraries:
  - WiFi.h
  - WebServer.h

## Setup Instructions

1. **ESP32 Setup**
   ```cpp
   - Connect LED to GPIO2 and ground
   - Open ESP.ino in Arduino IDE
   - Update WiFi credentials:
     const char* ssid = "YOUR_WIFI_SSID";
     const char* password = "YOUR_WIFI_PASSWORD";
   ```

2. **Upload Code**
   - Select correct board and port in Arduino IDE
   - Upload the code to ESP32
   - Monitor serial output for IP address

3. **Access the Game**
   - Open web browser
   - Enter ESP32's IP address
   - Game interface should load automatically

## How to Play

1. The puzzle starts with two empty spaces
2. Drag pieces to adjacent empty spaces to move them
3. Click the "Shuffle" button to randomize the puzzle
4. Arrange the pieces in correct order to solve
5. When solved:
   - The complete image appears
   - "Puzzle Solved!" message displays
   - ESP32's LED lights up for 5 seconds

## Technical Details

- Image Size: 300x300 pixels
- Grid: 3x3 (9 pieces)
- Individual Piece Size: 100x100 pixels
- Supported Browsers: Chrome, Firefox, Safari, Edge

## File Structure

```
PuzzleGame/
│
├── ESP.ino          # ESP32 main code
├── index.html       # Game HTML structure
├── styles.css       # Game styling
└── script.js        # Game logic
```

## Network Configuration

- Protocol: HTTP
- Port: 80
- Endpoints:
  - `/` - Serves the game interface
  - `/puzzleSolved` - Handles puzzle completion
