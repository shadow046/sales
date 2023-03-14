mysql -u yourusername -p yourpassword -D sqlpriceupdate -e "SELECT 'fcode', 'desc1', 'effdate', 'upa1', 'upa2', 'upa3', 'upa4', 'upa5', 'upa6', 'upa7', 'upa8', 'suspend' FROM sqlpriceupdate WHERE status = 1" | \

# Loop through the results and write each row to the output file in the desired format
while read -r fcode desc1 effdate upa1 upa2 upa3 upa4 upa5 upa6 upa7 upa8 suspend recid; do
    printf "REPLACE INTO \`sqlpriceupdate\` (\`fcode\`, \`desc1\`, \`effdate\`, \`upa1\`, \`upa2\`, \`upa3\`, \`upa4\`, \`upa5\`, \`upa6\`, \`upa7\`, \`upa8\`, \`suspend\`, \`recid\`) VALUES ('%s', '%s', '%s', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);\n" \
    "$fcode" "$desc1" "$effdate" "$upa1" "$upa2" "$upa3" "$upa4" "$upa5" "$upa6" "$upa7" "$upa8" "$suspend" "$recid"
done > output.sql
