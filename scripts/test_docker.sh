#!/bin/bash

docker build -t tinychat-appview ..
docker run -d --env-file .env -p 8000:8000 -v $(pwd)/data:/app/data tinychat-appview

# docker build -t tinychat-firehose -f Dockerfile.firehose .
# docker run -d --env-file .env -v $(pwd)/data:/app/data tinychat-firehose