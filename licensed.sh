#!/bin/bash

# Get MAC address and hard disk serial number
mac_address=$(ip link | awk '/ether/ {print $2}' | head -n 1 | md5sum | cut -d ' ' -f 1)
serial_number=$(lsblk -o SERIAL | tail -n 1 | md5sum | cut -d ' ' -f 1)
echo $mac_address-$serial_number
# Generate a license key
license_key=$(echo "$mac_address-$serial_number" | md5sum | cut -d ' ' -f 1)

echo "Generated License Key: $license_key"

# Store the license key
echo "Storing License Key..."
echo "$license_key" > license.key

# Check the validity of the license key
echo "Enter the license key to check its validity: "
read input_key

if [[ "$input_key" == "$license_key" ]]; then
    echo "License key is valid"
else
    echo "License key is not valid"
fi
