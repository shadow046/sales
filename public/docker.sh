#!/bin/bash
set -x
apt-get remove docker docker-engine docker.io -y
apt install docker.io -y
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

