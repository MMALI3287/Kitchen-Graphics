# 3D Kitchen Visualization

An interactive 3D kitchen environment built with Three.js, featuring animated appliances and realistic lighting.

## Features

- Interactive 3D kitchen environment with realistic lighting and shadows
- Animated appliances including:
  - Refrigerator with opening/closing door
  - Stove with toggleable burners and oven door
  - Microwave with door, light, and running animations
  - Cabinet with opening/closing doors
- Orbit controls for camera movement
- Responsive design that adapts to window size

## Controls

- **Mouse Controls:**
  - Click refrigerator to open/close door
  - Click stove knobs to toggle burners
  - Drag mouse to rotate view
  - Mouse wheel to zoom

- **Keyboard Controls:**
  - Spacebar: Toggle microwave door
  - O: Toggle microwave light
  - M: Start/stop microwave
  - C: Open/close cabinet doors
  - V: Open/close oven door
  - Arrow keys: Move camera

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
yarn install
```

### Development

Run the development server:
```bash
yarn vite
```

### Building for Production

Build the project:
```bash
yarn vite build
```

## Technologies Used

- Three.js (3D graphics)
- Vite (Build tool and development server)
- JavaScript (ES6+)

## Model Credits

The 3D book model used in this project is based on "book" by maxdragonn, licensed under CC-BY-4.0.
- Source: https://sketchfab.com/3d-models/book-a48ddaa719564047a894bbe80c6f724d
- Author: maxdragonn (https://sketchfab.com/maxdragon)
- License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)

## License

ISC