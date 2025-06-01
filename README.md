# StoryLens - Multi-modal Photo Story Generator

StoryLens transforms your photos into creative stories and brings them to life with AI-generated voice narration. Upload any image and watch as AI crafts unique tales inspired by what it sees.

## 🌟 Features

- **Photo Upload**: Easy drag-and-drop photo upload interface
- **AI Story Generation**: Uses Microsoft's Kosmos-2 model to generate creative stories and poems from images
- **Voice Narration**: Converts stories to speech using Coqui's XTTS-v2 model
- **Story Sharing**: Share your generated stories with others
- **Modern UI**: Beautiful, responsive interface with smooth animations

## 🤖 AI Models Used

- **Image-to-Text**: `microsoft/kosmos-2` - Advanced multimodal model for image understanding and story generation
- **Text-to-Speech**: `coqui/xtts-v2` - High-quality neural text-to-speech synthesis

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd storylens
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up Python environment for AI models**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

### Running the Application

1. **Start the development environment**
   ```bash
   npm run dev
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
storylens/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # AI model integrations
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded images
│   ├── generated/         # Generated content
│   ├── requirements.txt   # Python dependencies
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🎯 Usage

1. **Upload a Photo**: Drag and drop or click to upload any image
2. **Generate Story**: Click "Generate Story" to create an AI-powered narrative
3. **Listen**: Use the "Play Audio" button to hear your story narrated
4. **Share**: Copy the link to share your creation with others

## 🛠️ API Endpoints

- `POST /api/upload` - Upload image
- `POST /api/generate-story` - Generate story from image
- `POST /api/generate-audio` - Convert story to speech
- `GET /api/story/:id` - Retrieve saved story

## 🔧 Configuration

### Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# AI Model Configuration
HUGGINGFACE_API_KEY=your_huggingface_api_key
COQUI_API_KEY=your_coqui_api_key

# File Storage
UPLOAD_DIR=./uploads
GENERATED_DIR=./generated
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Microsoft for the Kosmos-2 model
- Coqui for the XTTS-v2 TTS model
- The open-source community for various tools and libraries used 