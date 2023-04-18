#!/bin/bash
DEBIAN_FRONTEND=noninteractive
TZ=Asia/Manila
ln -fs /usr/share/zoneinfo/Asia/Manila /etc/localtime
apt-get update
apt-get upgrade -y
apt install build-essential -y
apt-get install nginx -y
add-apt-repository ppa:ondrej/php
apt-get update
apt-get install software-properties-common zip unzip php7.4 php7.4-fpm php7.4-curl php7.4-ldap php7.4-mysql php7.4-gd php7.4-xml php7.4-mbstring php7.4-zip php7.4-bcmath composer curl wget nano -y
apt-get install php7.1 php7.1-fpm php7.1-curl php7.1-ldap php7.1-mysql php7.1-gd php7.1-xml php7.1-mbstring php7.1-zip php7.1-bcmath -y
apt-get install -y php7.0 php7.0-fpm php7.0-curl php7.0-ldap php7.0-mysql php7.0-gd php7.0-xml php7.0-mbstring php7.0-zip php7.0-bcmath -y
apt-get install php7.2 php7.2-fpm php7.2-curl php7.2-ldap php7.2-mysql php7.2-gd php7.2-xml php7.2-mbstring php7.2-zip php7.2-bcmath -y
apt-get install php7.3 php7.3-fpm php7.3-curl php7.3-ldap php7.3-mysql php7.3-gd php7.3-xml php7.3-mbstring php7.3-zip php7.3-bcmath -y
apt-get install php8.0 php8.0-fpm php8.0-curl php8.0-ldap php8.0-mysql php8.0-gd php8.0-xml php8.0-mbstring php8.0-zip php8.0-bcmath -y
apt-get install php8.1 php8.1-fpm php8.1-curl php8.1-ldap php8.1-mysql php8.1-gd php8.1-xml php8.1-mbstring php8.1-zip php8.1-bcmath -y
apt-get install php8.2 php8.2-fpm php8.2-curl php8.2-ldap php8.2-mysql php8.2-gd php8.2-xml php8.2-mbstring php8.2-zip php8.2-bcmath -y
apt-get install certbot python3-certbot-nginx php php-fpm php-curl php-ldap php-mysql php-gd php-xml php-mbstring php-zip php-bcmath php-imagick -y
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
systemctl restart nginx.service
fallocate -l 8G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' >> /etc/sysctl.conf
#mysql_secure_installation
sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart nginx.service
systemctl restart mysql
#git clone https://github.com/nuserv/stock-inventory-monitoring.git /var/www/html/stock/
git clone https://github.com/lancenacabuan/lsapp.git /var/www/html/mainwh/
#git clone https://github.com/rndllhdlgo/digitalfile201.git /var/www/html/hrms/
cd /var/www/html/mainwh/
update-alternatives --set php /usr/bin/php8.1
composer install
chmod 777 . -R
cp .env.example .env
php artisan key:generate
echo 'fs.inotify.max_user_watches=524288' >> /etc/sysctl.conf
sysctl -p