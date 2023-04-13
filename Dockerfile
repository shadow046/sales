FROM ubuntu:18.04
ENV TZ=Asia/Manila
ENV DEBIAN_FRONTEND=noninteractive
RUN 	ln -fs /usr/share/zoneinfo/Asia/Manila /etc/localtime
RUN 	apt-get update -y && \
	apt-get upgrade -y && \
	apt-get dist-upgrade -y
RUN apt-get install software-properties-common -y 
RUN	add-apt-repository ppa:ondrej/php -y
RUN apt-get update -y
RUN apt-get install php8.1 php8.1-fpm php8.1-curl php8.1-ldap php8.1-mysql php8.1-gd \
	php8.1-xml php8.1-mbstring php8.1-zip php8.1-bcmath composer curl wget nano php -y
RUN apt-get purge apache2 apache* -y
#RUN apt-get remove --purge php8* -y
WORKDIR /home/
COPY . .
RUN composer install
#RUN php artisan key:generate
RUN chmod 777 -R .
EXPOSE 8001
CMD php artisan serve --host 0.0.0.0 --port 8001
