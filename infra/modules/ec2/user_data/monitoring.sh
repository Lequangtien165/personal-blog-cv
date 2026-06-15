#!/bin/bash
set -eux

apt-get update
apt-get install -y prometheus software-properties-common wget apt-transport-https gnupg

wget https://github.com/prometheus/blackbox_exporter/releases/download/v0.25.0/blackbox_exporter-0.25.0.linux-amd64.tar.gz
tar xzf blackbox_exporter-0.25.0.linux-amd64.tar.gz
mv blackbox_exporter-0.25.0.linux-amd64/blackbox_exporter /usr/local/bin/blackbox_exporter

cat > /etc/systemd/system/blackbox-exporter.service <<'EOF'
[Unit]
Description=Prometheus Blackbox Exporter
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/blackbox_exporter
Restart=always

[Install]
WantedBy=multi-user.target
EOF

mkdir -p /etc/apt/keyrings
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" > /etc/apt/sources.list.d/grafana.list

apt-get update
apt-get install -y grafana

systemctl daemon-reload
systemctl enable blackbox-exporter
systemctl start blackbox-exporter
systemctl enable prometheus
systemctl start prometheus
systemctl enable grafana-server
systemctl start grafana-server

