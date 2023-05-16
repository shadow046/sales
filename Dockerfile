FROM ubuntu:18.04
LABEL maintainer="Jerome Lopez"
RUN groupadd -r jerome && useradd -r -g jerome jerome
RUN chsh -s /usr/sbin/nologin root

ENV HOME /home/jerome
ENV TZ=Asia/Manila
ENV DEBIAN_FRONTEND=noninteractive
RUN 	ln -fs /usr/share/zoneinfo/Asia/Manila /etc/localtime
RUN 	apt-get update -y && \
	apt-get upgrade -y && \
	apt-get dist-upgrade -y
RUN apt-get install software-properties-common -y 
RUN	add-apt-repository ppa:ondrej/php -y
RUN apt-get update -y
RUN apt-get install php8.0 php8.0-fpm php8.0-curl php8.0-ldap php8.0-mysql php8.0-gd \
	php8.0-xml php8.0-mbstring php8.0-zip php8.0-bcmath composer curl wget nano php -y
#RUN apt-get install composer curl wget nano php8.0 php8.0-fpm php8.0-curl php8.0-ldap php8.0-mysql php8.0-gd php8.0-xml php8.0-mbstring php8.0-zip php8.0-bcmath -y
RUN apt-get install php8.1 php8.1-fpm php8.1-curl php8.1-ldap php8.1-mysql php8.1-gd php8.1-xml php8.1-mbstring php8.1-zip php8.1-bcmath -y
RUN apt-get purge apache2 apache* -y
RUN apt-get remove --purge php8.2* -y

# Create a new directory for the Laravel files
RUN mkdir /home/jerome
RUN mkdir /home/laravel
RUN mkdir /opt/app
RUN mkdir /opt/app/tmp
RUN mkdir /opt/app/tmp/app
WORKDIR /opt/app/tmp/app

# Copy the Laravel files into the new directory
COPY . .
RUN php -i | grep 'extension_dir' | awk '{print $NF}' > /tmp/extension_dir
RUN cp bolt.so $(cat /tmp/extension_dir)/bolt.so
RUN echo "extension=bolt.so" >> $(php -i | awk '/^Loaded Configuration File/ {print $NF}')
RUN service php8.1-fpm restart
# Set the ownership and permissions for the new directory
RUN chown -R www-data:www-data /opt/app/tmp/app
RUN chmod -R 750 /opt/app/tmp/app

# Install the Laravel dependencies
RUN composer install

# Expose the Laravel port
EXPOSE 8001

# Start the Laravel server
CMD php artisan serve --host 0.0.0.0 --port 8001
WORKDIR /home/laravel