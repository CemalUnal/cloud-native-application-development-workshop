FROM ubuntu:18.04

RUN apt update && apt-get -y install nginx

COPY index.html /var/www/html

CMD ["nginx", "-g", "daemon off;"]
