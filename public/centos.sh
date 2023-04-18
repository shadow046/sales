#!/bin/bash
set -x
http://releases.ubuntu.com/xenial/ubuntu-16.04.6-desktop-i386.iso
yum install -y libc.so.6 libdevmapper.so.1.02 libpthread.so.0 libsqlite3.so.0
yum install -y https://get.docker.com/rpm/1.7.0/centos-6/RPMS/x86_64/docker-engine-1.7.0-1.el6.x86_64.rpm
rpm -ivh docker-engine-1.13.1-1.el6.x86_64.rpm
#yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine -y
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io
systemctl start docker
systemctl enable docker
echo "1bd8c4c5298947be49ff667dcb5215210f019f84" > ~/TOKEN.txt
cat ~/TOKEN.txt | docker login https://docker.pkg.github.com -u shadow046 --password-stdin
rm ~/TOKEN.txt
docker pull docker.pkg.github.com/lancenacabuan/tms/tim:latest
echo "docker run -dit -p 8001:8001" > docker.txt
docker images > image.txt
sed -n 2p image.txt > images.txt
echo $(cat images.txt) | cut -d ' ' -f3 >> docker.txt
echo "#!/bin/bash" > dock.sh
echo $(cat docker.txt) >>dock.sh
rm image.txt
rm images.txt
rm docker.txt
chmod +x dock.sh
./dock.sh
rm dock.sh
