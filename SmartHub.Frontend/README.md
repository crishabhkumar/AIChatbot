# SmartHub Frontend

A modern React-based chat interface for the SmartHub.API backend. This frontend provides an intuitive chat experience with AI providers, real-time messaging, and customizable settings.

## Features

- 💬 **Real-time Chat Interface**: Clean, modern chat UI with message bubbles
- 🤖 **Multiple AI Providers**: Support for Azure OpenAI and Amazon Bedrock
- ⚙️ **Customizable Settings**: Adjust temperature, max tokens, system messages, and provider selection
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 💾 **Chat History**: Automatically saves and restores chat history
- 🔄 **Auto-fallback**: Automatic provider fallback when primary provider fails
- 📊 **Message Metadata**: Shows provider, model, and token usage information
- 🌐 **Connection Status**: Real-time connection monitoring
- 🚀 **Modern UI**: Clean design with smooth animations and intuitive interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- SmartHub.API backend running (default: http://localhost:5189)

## Installation

1. **Clone or navigate to the frontend directory**:
   ```bash
   cd SmartHub.Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed):
   Update the API_BASE_URL in `src/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost:5189/api';
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser**:
   Navigate to http://localhost:3000

## Usage

### Starting a Conversation

1. Type your message in the input field at the bottom
2. Press Enter or click the Send button
3. The AI will respond based on your configured settings

### Configuring Settings

Use the settings panel at the top to configure:

- **AI Provider**: Choose specific provider or use auto-fallback
- **Temperature**: Control response creativity (0 = conservative, 2 = very creative)
- **Max Tokens**: Set maximum response length (1-4000)

### Chat Management

- **Clear Chat**: Click the trash icon to clear conversation history
- **Auto-save**: Chat history is automatically saved to browser storage
- **Responsive**: Interface adapts to different screen sizes

## API Integration

The frontend communicates with SmartHub.API through these endpoints:

- `POST /api/ai/generate` - Generate response with specific provider
- `POST /api/ai/generate-with-fallback` - Generate with automatic fallback
- `GET /api/ai/providers` - Get available providers
- `GET /api/ai/health` - Health check

## Component Architecture

The application is built with a modular component structure:

```
src/
├── components/
│   ├── Chat.tsx             # Main chat container component
│   ├── ChatHeader.tsx       # Header with title and connection status
│   ├── SettingsPanel.tsx    # Configuration panel for AI settings
│   ├── MessagesArea.tsx     # Message display area
│   ├── ChatInput.tsx        # Input field and send functionality
│   └── ChatFooter.tsx       # Footer with provider information
├── types.ts                 # TypeScript type definitions
├── api.ts                   # API integration layer
├── App.tsx                  # Main application entry component
├── App.css                  # Component styles
├── index.tsx               # React application entry point
└── index.css               # Global styles
```

### Component Responsibilities

- **App.tsx**: Main application wrapper that renders the Chat component
- **Chat.tsx**: Core chat logic, state management, and API integration
- **ChatHeader.tsx**: Displays app title and connection status
- **SettingsPanel.tsx**: Handles AI configuration (temperature, tokens, provider)
- **MessagesArea.tsx**: Renders chat messages and loading states
- **ChatInput.tsx**: Manages message input and form submission
- **ChatFooter.tsx**: Shows API status and provider information

## Technologies Used

- **React 18** with TypeScript
- **Axios** for API communication
- **CSS3** with modern features (flexbox, grid, animations)
- **Emoji** for intuitive UI icons
- **localStorage** for chat history persistence

## Customization

### Styling
The interface uses CSS classes with a clean, modern design. To customize:

1. Modify styles in `src/App.css`
2. Update color schemes and gradients
3. Adjust component spacing and layout

### Adding Features
To extend functionality:

1. Add new types to `types.ts`
2. Extend API integration in `api.ts`
3. Create new components in the `components/` directory
4. Update the main `Chat.tsx` component to use new features

### API Configuration
Update the API base URL in `src/api.ts`:

```typescript
const API_BASE_URL = 'http://your-api-server:port/api';
```

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `build/` directory ready for deployment.

## Troubleshooting

### Common Issues

1. **API Connection Failed**:
   - Ensure SmartHub.API is running on the correct port
   - Check the API URL in `api.ts`
   - Verify CORS settings in the backend

2. **Messages Not Sending**:
   - Check browser console for errors
   - Verify network connectivity
   - Check API health endpoint response

3. **Settings Not Saving**:
   - Settings are stored in component state (session-based)
   - Chat history uses localStorage
   - Clear browser data if issues persist

4. **Compilation Errors**:
   - Ensure all dependencies are installed (`npm install`)
   - Check TypeScript configuration in `tsconfig.json`
   - Verify all imports are correct

### Development Tips

- Use browser developer tools to inspect network requests
- Check the console for any JavaScript errors
- The app includes connection status monitoring
- Use the health endpoint to verify backend connectivity
- Chat history is preserved between browser sessions

## Project Structure Details

### State Management
- Uses React hooks (`useState`, `useEffect`) for state management
- Chat history persisted in localStorage
- Connection status monitored with periodic health checks

### TypeScript Integration
- Full TypeScript support with strict type checking
- Interface definitions in `types.ts`
- Type-safe API calls and component props

### Responsive Design
- Mobile-first approach
- Flexible layouts that adapt to screen size
- Touch-friendly controls for mobile devices
