FROM grafana/grafana:11.3.0

COPY datasources/datasource.yml /etc/grafana/provisioning/datasources/datasource.yml
COPY dashboards/dashboards.yaml /etc/grafana/provisioning/dashboards/dashboards.yaml
COPY dashboards/rapharch.json /etc/grafana/provisioning/dashboards/rapharch.json

EXPOSE 3000
