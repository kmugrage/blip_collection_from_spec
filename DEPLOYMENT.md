# Deployment Guide

This guide covers deploying the Technology Radar Blip Submission application.

## Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js 18+ and npm
- Anthropic API key
- 1GB RAM minimum, 2GB recommended
- 1GB disk space for application and data

## Option 1: Docker Deployment (Recommended)

### Quick Start

1. **Clone the repository and navigate to the directory:**
   ```bash
   cd blip_collection_from_spec
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

3. **Build and start the application:**
   ```bash
   docker-compose up -d
   ```

4. **Verify it's running:**
   ```bash
   curl http://localhost:3001/api/health
   ```

The application will be available at `http://localhost:3001`

### Docker Commands

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Restart the application
docker-compose restart

# Rebuild after code changes
docker-compose up -d --build
```

### Data Persistence

Submission data is stored in `./data/submissions.json` and persists across container restarts via Docker volume mount.

To backup submissions:
```bash
cp data/submissions.json data/submissions.backup.json
```

## Option 2: Manual Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Fetch Radar Data

```bash
npm run fetch-radar-data
```

This downloads historical radar data from GitHub. Run this periodically to update with new radar editions.

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=production
STORAGE_PATH=./data/submissions.json
```

### 4. Build the Application

```bash
npm run build
```

This builds both frontend and backend.

### 5. Start the Server

```bash
npm start
```

The application will be available at `http://localhost:3001`

## Production Considerations

### Security

1. **HTTPS**: Deploy behind a reverse proxy (nginx, Apache) with SSL/TLS
2. **Firewall**: Only expose port 3001 (or your configured port)
3. **API Key**: Store `ANTHROPIC_API_KEY` securely (e.g., AWS Secrets Manager, environment variables)
4. **CORS**: Update `ALLOWED_ORIGINS` in production to restrict cross-origin requests

### Monitoring

1. **Health Check**: `GET /api/health`
   - Returns `200 OK` if healthy
   - Checks radar data and storage availability

2. **Logs**: Application logs to stdout/stderr
   - Use `docker-compose logs -f` or your logging solution
   - Monitor for errors during submission processing

3. **Metrics**:
   - Submission count: `GET /api/stats`
   - Returns number of submissions and storage path

### Backup

Submission data is stored in JSON format. Backup strategy:

```bash
# Daily backup
cp data/submissions.json backups/submissions-$(date +%Y%m%d).json

# Automated backup (add to crontab)
0 2 * * * cd /path/to/app && cp data/submissions.json backups/submissions-$(date +\%Y\%m\%d).json
```

### Scaling

The application uses file-based storage with concurrency protection suitable for <5 simultaneous users.

For higher load:
- Replace JSON storage with a database (see §10.3 in spec)
- Use load balancer with session affinity
- Consider separating frontend (static hosting) from backend (API server)

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Anthropic API key for LLM coaching |
| `PORT` | No | 3001 | Port for the server to listen on |
| `NODE_ENV` | No | development | Environment (development/production) |
| `STORAGE_PATH` | No | ./data/submissions.json | Path to submissions JSON file |
| `ALLOWED_ORIGINS` | No | localhost | Comma-separated CORS origins for production |
| `USE_MOCK_COACHING` | No | false | Use mock coaching instead of real API (for testing) |

## Reverse Proxy Configuration

### Nginx Example

```nginx
server {
    listen 80;
    server_name radar-submission.example.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

### Application won't start

1. Check environment variables are set: `cat .env`
2. Verify API key is valid: `npm run dev:server`
3. Check port availability: `lsof -i :3001`
4. Review logs: `docker-compose logs` or check console output

### Radar data not available

1. Fetch radar data: `npm run fetch-radar-data`
2. Verify files exist: `ls -la data/radar/`
3. Check index file: `cat data/radar/index.json`

### Submissions not saving

1. Check storage path exists: `mkdir -p data`
2. Verify write permissions: `ls -la data/`
3. Check disk space: `df -h`
4. Review logs for errors

### LLM coaching unavailable

1. Verify API key: `echo $ANTHROPIC_API_KEY`
2. Check API quota/limits with Anthropic
3. Test API directly: `npm run test:api`
4. Enable mock coaching temporarily: `USE_MOCK_COACHING=true`

## Updating

### Update Radar Data

```bash
npm run fetch-radar-data
docker-compose restart  # If using Docker
```

Run this after each new radar edition is published.

### Update Application Code

```bash
git pull
npm install
npm run build
docker-compose up -d --build  # If using Docker
# OR
npm start  # If running manually
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/thoughtworks/tech-radar-blip-submission/issues
- Documentation: See README.md and tech-radar-spec.md
- Security issues: Contact security@thoughtworks.com
