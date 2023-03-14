#!/bin/bash
Month=`date -d "$(date +%Y-%m-%d) -1 month" +%B%Y`
Date=`date -d "$(date +%Y-%m-%d) -1 month" +%Y%m01`
cat >>/import_monthly_master.sql<<EOF
    USE asterisk

    DELETE from $Month
    CREATE TABLE IF NOT EXISTS `$Month` (
        `id` bigint(20) NOT NULL AUTO_INCREMENT,
        `accountcode` varchar(30) DEFAULT NULL,
        `src` varchar(64) DEFAULT NULL,
        `dst` varchar(64) DEFAULT NULL,
        `dcontext` varchar(32) DEFAULT NULL,
        `clid` varchar(64) DEFAULT NULL,
        `channel` varchar(32) DEFAULT NULL,
        `dstchannel` varchar(32) DEFAULT NULL,
        `lastapp` varchar(32) DEFAULT NULL,
        `lastdata` varchar(256) DEFAULT NULL,
        `calldate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `answerdate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
        `hangupdate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
        `duration` int(8) unsigned DEFAULT NULL,
        `billsec` int(8) unsigned DEFAULT NULL,
        `disposition` varchar(32) DEFAULT NULL,
        `amaflags` varchar(128) DEFAULT NULL,
        `uniqueid` varchar(128) DEFAULT NULL,
        `userfield` varchar(128) DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `calldate` (`calldate`)
    ) ENGINE=InnoDB AUTO_INCREMENT=157672851 DEFAULT CHARSET=utf8;
    LOAD DATA LOCAL INFILE '/var/log/asterisk/cdr-csv/Master.csv-$Date
    INTO TABLE asterisk.$Month
    FIELDS TERMINATED BY ',' ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    (
        accountcode,
        src,
        dcontext,
        clid,
        channel,
        dstchannel,
        lastapp,
        lastdata,
        calldate,
        answerdate,
        hangupdate,
        duration,
        billsec,
        disposition,
        amaflags,
        uniqueid,
        userfield
    );
EOF

mysql -ucdm --password=applied -h db.apsoft.com.ph < /import_monthly_master.sql