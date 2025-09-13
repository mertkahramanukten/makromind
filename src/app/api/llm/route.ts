import { NextRequest, NextResponse } from 'next/server';

interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  temperature?: number;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, temperature = 0.7 } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Ollama API endpoint
    const ollamaUrl = 'http://localhost:11434/api/generate';
    
    const ollamaRequest: OllamaRequest = {
      model: 'llama3.1:8b',
      prompt,
      stream: false,
      temperature: Math.max(0, Math.min(2, temperature)), // Clamp between 0-2
    };

    // Ollama'ya istek gönder
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaRequest),
    });

    // Ollama kapalıysa veya model yoksa hata ver
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: 'Ollama service not found. Please ensure Ollama is running and llama3.1:8b model is installed.',
            details: 'Run: ollama pull llama3.1:8b'
          },
          { status: 503 }
        );
      }
      
      if (response.status === 500) {
        return NextResponse.json(
          { 
            error: 'Model not available. Please install the model first.',
            details: 'Run: ollama pull llama3.1:8b'
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: `Ollama API error: ${response.status}` },
        { status: 503 }
      );
    }

    const ollamaResponse: OllamaResponse = await response.json();

    // Başarılı yanıt döndür
    return NextResponse.json({
      text: ollamaResponse.response,
      model: ollamaResponse.model,
      duration: ollamaResponse.total_duration,
    });

  } catch (error) {
    console.error('LLM API Error:', error);
    
    // Network hataları için özel mesaj
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Cannot connect to Ollama. Please ensure Ollama is running on localhost:11434',
          details: 'Start Ollama service or install it from https://github.com/ollama/ollama'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error while processing LLM request' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  try {
    // Ollama'nın çalışıp çalışmadığını kontrol et
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Ollama service not available',
          details: 'Please ensure Ollama is running on localhost:11434'
        },
        { status: 503 }
      );
    }

    const data = await response.json();
    const models = data.models || [];
    const hasRequiredModel = models.some((model: any) => 
      model.name.includes('llama3.1:8b')
    );

    return NextResponse.json({
      status: 'ok',
      ollamaAvailable: true,
      models: models.map((model: any) => model.name),
      requiredModelInstalled: hasRequiredModel,
      requiredModel: 'llama3.1:8b'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Cannot connect to Ollama',
        details: 'Please install and start Ollama service'
      },
      { status: 503 }
    );
  }
}
