#!/bin/bash

case "$1" in
  up)
    docker-compose up -d --build
    ;;
  down)
    docker-compose down
    ;;
  restart)
    docker-compose restart
    ;;
  logs)
    docker-compose logs -f
    ;;
  status)
    docker-compose ps
    ;;
  health)
    curl -s http://localhost:3000/api/health || echo "Health check failed"
    ;;
  *)
    echo "Usage: $0 {up|down|restart|logs|status|health}"
    exit 1
    ;;
esac
