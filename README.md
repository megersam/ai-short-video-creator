# AI Short Video Creator

**AI Short Video Creator** is a SaaS-based platform that converts user ideas into videos by generating stories, audio, captions, and images using AI technologies such as Google Gemini AI and Replicate AI. The final result is a seamlessly rendered video from the generated assets. The platform supports monthly subscriptions and uses Clerk for authentication.

## Features

- **Idea to Prompt**: Converts user ideas into AI-generated prompts.
- **Story Generation**: Creates stories using the AI-generated prompts.
- **Audio and Captions**: Converts the generated stories into audio with synchronized captions.
- **Image Generation**: Creates image prompts and generates visuals to accompany the story.
- **Video Creation**: Combines the audio, captions, and images into a final video.
- **Authentication**: Clerk-based user authentication and subscription management.
- **Subscription Plans**: Offers monthly subscription-based access to premium features.

## Technologies Used

- **Framework**: Next.js
- **Frontend**: React.js (with Next.js)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (for storing user data, subscriptions, and projects)
- **AI**: Google Gemini AI (for story generation), Replicate AI (for image generation)
- **Authentication**: Clerk (for user auth and subscription management)
- **Deployment**: Netlify (Frontend)
- **Version Control**: GitHub

## Demo

Live application: [AI Short Video Creator](https://ai-short-video-creator.netlify.app/)

 

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- PostgreSQL
- Git
- Clerk account (for authentication setup)
- API keys for Google Gemini AI and Replicate AI

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/megersam/ai-short-video-creator.git
   cd ai-short-video-creator
   npm install
   npm run dev
