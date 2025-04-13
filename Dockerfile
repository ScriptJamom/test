FROM alpine:latest

# Устанавливаем Xray
RUN apk add --no-cache curl unzip && \
    mkdir -p /usr/local/bin /etc/xray && \
    curl -L -o xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip && \
    unzip xray.zip -d /usr/local/bin && \
    rm xray.zip && \
    chmod +x /usr/local/bin/xray

COPY config.json /etc/xray/config.json

EXPOSE 10000

CMD ["xray", "-c", "/etc/xray/config.json"]
