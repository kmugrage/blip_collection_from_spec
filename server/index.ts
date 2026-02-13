/**
 * Express server for Technology Radar Blip Submission
 *
 * Provides REST API endpoints for:
 * - Prior radar lookup
 * - LLM coaching
 * - Blip submission
 * - Health check
 */

import '@anthropic-ai/sdk/shims/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { findPriorRadarMatch, isRadarDataAvailable } from './services/radar-matcher';
import { getCoaching, getMockCoaching } from './services/llm-coaching';
import { saveSubmission, isStorageAvailable, getStorageStats } from './services/storage';
import { validateAndSanitize } from './services/validation';
import {
  PriorRadarLookupRequest,
  PriorRadarLookupResponse,
  CoachingRequest,
  CoachingResponse,
  BlipSubmission,
  ApiResponse
} from './types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      radarData: isRadarDataAvailable(),
      storage: isStorageAvailable(),
    }
  };

  res.json(health);
});

/**
 * Storage statistics (for debugging)
 */
app.get('/api/stats', (req, res) => {
  try {
    const stats = getStorageStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
});

/**
 * Prior radar lookup endpoint
 * POST /api/prior-radar-lookup
 */
app.post('/api/prior-radar-lookup', (req, res) => {
  try {
    const { name } = req.body as PriorRadarLookupRequest;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      } as ApiResponse<never>);
    }

    // Check if radar data is available
    if (!isRadarDataAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'Radar data is temporarily unavailable'
      } as ApiResponse<never>);
    }

    const match = findPriorRadarMatch(name);

    const response: PriorRadarLookupResponse = {
      found: match !== null,
      match: match || undefined
    };

    res.json({
      success: true,
      data: response
    } as ApiResponse<PriorRadarLookupResponse>);

  } catch (error) {
    console.error('Error in prior radar lookup:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse<never>);
  }
});

/**
 * Coaching endpoint
 * POST /api/coaching
 */
app.post('/api/coaching', async (req, res) => {
  try {
    const request = req.body as CoachingRequest;

    // Use mock coaching in test environment or if explicitly requested
    const useMock = process.env.USE_MOCK_COACHING === 'true' ||
                    req.query.mock === 'true';

    let response: CoachingResponse;

    if (useMock) {
      response = getMockCoaching(request);
    } else {
      response = await getCoaching(request);
    }

    res.json({
      success: true,
      data: response
    } as ApiResponse<CoachingResponse>);

  } catch (error) {
    console.error('Error in coaching:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse<never>);
  }
});

/**
 * Submit blip endpoint
 * POST /api/submit
 */
app.post('/api/submit', async (req, res) => {
  try {
    const data = req.body as Partial<BlipSubmission>;

    // Validate and sanitize
    const { sanitized, errors } = validateAndSanitize(data);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: 'Validation failed'
      } as ApiResponse<never>);
    }

    // Create complete submission
    const submission: BlipSubmission = {
      id: uuidv4(),
      name: sanitized.name!,
      quadrant: sanitized.quadrant!,
      ring: sanitized.ring!,
      description: sanitized.description!,
      clientExamples: sanitized.clientExamples,
      cautionReasoning: sanitized.cautionReasoning,
      submissionType: sanitized.submissionType || 'new',
      priorRadarReference: sanitized.priorRadarReference,
      suggestedNewRing: sanitized.suggestedNewRing,
      createdAt: new Date().toISOString()
    };

    // Save submission
    await saveSubmission(submission);

    res.status(201).json({
      success: true,
      data: { id: submission.id },
      message: 'Submission saved successfully'
    } as ApiResponse<{ id: string }>);

  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save submission'
    } as ApiResponse<never>);
  }
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

/**
 * Error handler
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Radar data available: ${isRadarDataAvailable()}`);
  console.log(`💾 Storage available: ${isStorageAvailable()}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
